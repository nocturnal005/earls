// ─────────────────────────────────────────────────────────────────────────────
// Server-side pricing engine — the authoritative source for what a customer is
// charged. Never trusts client-supplied prices.
//
// The pricing DATA lives in data/pricing-data.json, generated from the
// configurator's source of truth (configurator/src/newData.js) via
// `node scripts/gen-pricing.mjs`. The FORMULAS below mirror the calc* functions
// in newData.js — keep them in sync if the formulas ever change.
// ─────────────────────────────────────────────────────────────────────────────

const data = require('../data/pricing-data.json');
const C = data.constants;

const MAX_LINES = 50;

function round2(n) {
  return Math.round(n * 100) / 100;
}

function calcPrintPrice(printType, sizeId) {
  if (printType === 'none') return 0;
  const prices = data.printPrices[printType];
  const p = prices ? prices[sizeId] : null;
  return p == null ? 0 : p;
}

function calcFramePrice(frame, w_cm, h_cm, mountTypeId, mountWidthMm) {
  let frameW = w_cm, frameH = h_cm;
  if (mountTypeId && mountTypeId !== 'none') {
    const borderCm = mountWidthMm / 10;
    frameW = w_cm + 2 * borderCm;
    frameH = h_cm + 2 * borderCm;
  }
  const perimM = ((frameW + frameH) * 2) / 100;
  const mitreM = (8 * frame.widthMm) / 1000;
  return (perimM + mitreM) * frame.costPerM * C.FRAME_MARKUP + C.FRAME_BASE;
}

function calcMountPrice(mountTypeId, w_cm, h_cm, mountWidthMm) {
  const mt = data.mountTypes[mountTypeId];
  if (!mt || mt.multiplier === 0) return 0;
  const borderCm = mountWidthMm / 10;
  const outerArea = (w_cm + 2 * borderCm) * (h_cm + 2 * borderCm);
  const mountAreaSqFt = (outerArea - w_cm * h_cm) / C.SQCM_PER_SQFT;
  // Multiplier applies to the whole mount price (area + base) so Double = 2× Plain.
  return ((mountAreaSqFt * C.MOUNT_BASE_RATE_PER_SQFT + C.MOUNT_BASE) * mt.multiplier) + mt.surcharge;
}

function calcGlassPrice(glassId, w_cm, h_cm, mountTypeId, mountWidthMm) {
  const rate = data.glassRates[glassId];
  if (!rate) return 0;
  let glassW = w_cm, glassH = h_cm;
  if (mountTypeId && mountTypeId !== 'none') {
    const borderCm = mountWidthMm / 10;
    glassW = w_cm + 2 * borderCm;
    glassH = h_cm + 2 * borderCm;
  }
  const areaSqFt = (glassW * glassH) / C.SQCM_PER_SQFT;
  return areaSqFt * rate + C.GLASS_BASE;
}

// Compute the authoritative subtotal for one configured line item.
// Mirrors the `pricing` useMemo in NewConfigurator.jsx. Returns a positive
// number, or null if the configuration is invalid / unpriceable.
function priceLineItem(sel) {
  if (!sel || typeof sel !== 'object') return null;

  const isCustom = sel.sizeId === 'custom';
  const size = data.printSizes[sel.sizeId];
  const w = isCustom ? Number(sel.customW) : (size ? size.w_cm : null);
  const h = isCustom ? Number(sel.customH) : (size ? size.h_cm : null);
  if (!(w > 0) || !(h > 0)) return null;

  const mountTypeId = sel.mountTypeId || 'none';
  const printType = sel.printType;

  const mountWidthMm = sel.mountWidthId === 'custom'
    ? (Number(sel.customMountWidth) || 0)
    : (data.mountWidths[sel.mountWidthId] != null ? data.mountWidths[sel.mountWidthId] : 50);

  const printPrice = (!isCustom && printType) ? (calcPrintPrice(printType, sel.sizeId) || 0) : 0;

  let frame = null;
  if (sel.frameId) {
    frame = data.frames[sel.frameId];
    if (!frame) return null; // unknown frame id → reject rather than under/over-charge
  }
  const frameNet = frame ? calcFramePrice(frame, w, h, mountTypeId, mountWidthMm) : 0;
  const mountNet = (mountTypeId !== 'none' && printType !== 'canvas')
    ? calcMountPrice(mountTypeId, w, h, mountWidthMm) : 0;
  const glassNet = (sel.glassId && sel.glassId !== 'none' && printType !== 'canvas')
    ? calcGlassPrice(sel.glassId, w, h, mountTypeId, mountWidthMm) : 0;
  const framingNet = frameNet + mountNet + glassNet;

  if (!(printPrice + framingNet > 0)) return null;

  // Print = framer's list (already VAT-inclusive). Framing = net, + 20% VAT.
  const VAT_RATE = (C.VAT_RATE != null ? C.VAT_RATE : 0.20);
  const unit = printPrice + framingNet * (1 + VAT_RATE);   // inclusive per-item, excl delivery

  // Delivery tier is keyed off the print/artwork size (A4/A3 → £5, A2 → £9, etc.).
  const longestEdgeCm = Math.max(w, h);

  return { unit: round2(unit), longestEdgeCm };
}

function deliveryFromTiers(tiers, longestEdgeCm) {
  const list = tiers && tiers.length ? tiers : [{ maxEdgeCm: null, price: 5.95 }];
  for (const t of list) {
    if (t.maxEdgeCm == null || (longestEdgeCm || 0) <= t.maxEdgeCm) return t.price;
  }
  return list[list.length - 1].price;
}
function standardDelivery(longestEdgeCm) {
  return deliveryFromTiers(data.standardDeliveryTiers, longestEdgeCm);
}
function expressDelivery(longestEdgeCm) {
  return deliveryFromTiers(data.expressDeliveryTiers, longestEdgeCm);
}

// Price a whole order. `lines` is [{ selection, quantity }, ...].
// Returns { lines:[{unit, qty}], subtotal, delivery, vat, total } or { error }.
function priceOrder(lines, shippingMethod) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { error: 'No items in order.' };
  }
  if (lines.length > MAX_LINES) {
    return { error: 'Too many items in order.' };
  }

  const priced = [];
  let subtotal = 0;
  let maxStandard = 0;
  let maxExpress = 0;
  for (const li of lines) {
    const item = priceLineItem(li && li.selection);
    if (item === null) return { error: 'Invalid item configuration.' };
    const qty = Math.max(1, Math.min(99, parseInt(li.quantity, 10) || 1));
    subtotal += item.unit * qty;
    maxStandard = Math.max(maxStandard, standardDelivery(item.longestEdgeCm));
    maxExpress = Math.max(maxExpress, expressDelivery(item.longestEdgeCm));
    priced.push({ unit: item.unit, qty });
  }
  subtotal = round2(subtotal);

  // Delivery scales with the largest item; express is its own (higher) tier.
  const delivery = shippingMethod === 'express' ? maxExpress : maxStandard;
  const total = round2(subtotal + delivery);
  const VAT_RATE = (C.VAT_RATE != null ? C.VAT_RATE : 0.20);
  const vat = round2(total - total / (1 + VAT_RATE)); // VAT element within the inclusive total

  return { lines: priced, subtotal, delivery, vat, total };
}

module.exports = { priceLineItem, priceOrder, standardDelivery, expressDelivery, constants: C };
