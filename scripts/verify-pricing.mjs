// One-off check: server pricing (api/_pricing.js) must match the client
// pricing engine (configurator/src/newData.js) for every combination.
//   node scripts/verify-pricing.mjs

import { createRequire } from 'node:module';
import {
  PRINT_SIZES, PRINT_TYPES, MOUNT_TYPES, MOUNT_WIDTHS, GLASS_OPTIONS,
  FRAME_CATALOGUE, calcPrintPrice, calcFramePrice, calcMountPrice, calcGlassPrice,
} from '../configurator/src/newData.js';

const require = createRequire(import.meta.url);
const server = require('../api/_pricing.js');

const round2 = n => Math.round(n * 100) / 100;

// Replicate the client's per-item subtotal (the `pricing` useMemo logic).
function clientSubtotal(sel) {
  const isCustom = sel.sizeId === 'custom';
  const size = PRINT_SIZES.find(s => s.id === sel.sizeId);
  const w = isCustom ? sel.customW : size?.w_cm;
  const h = isCustom ? sel.customH : size?.h_cm;
  const hasDims = w > 0 && h > 0;
  if (!hasDims) return null;
  const mountWidthMm = sel.mountWidthId === 'custom'
    ? (sel.customMountWidth || 0)
    : (MOUNT_WIDTHS.find(mw => mw.id === sel.mountWidthId)?.mm || 50);
  const frame = sel.frameId ? FRAME_CATALOGUE.find(f => f.id === sel.frameId) : null;
  const printPrice = (!isCustom && sel.printType && size) ? (calcPrintPrice(sel.printType, sel.sizeId) || 0) : 0;
  const framePrice = (frame && w) ? calcFramePrice(frame, w, h, sel.mountTypeId, mountWidthMm) : 0;
  const mountPrice = (sel.mountTypeId !== 'none' && sel.printType !== 'canvas' && w) ? calcMountPrice(sel.mountTypeId, w, h, mountWidthMm) : 0;
  const glassPrice = (sel.glassId && sel.glassId !== 'none' && sel.printType !== 'canvas' && w) ? calcGlassPrice(sel.glassId, w, h, sel.mountTypeId, mountWidthMm) : 0;
  const subtotal = printPrice + framePrice + mountPrice + glassPrice;
  if (!(subtotal > 0)) return null;
  return round2(subtotal);
}

let checked = 0, mismatches = 0;
const sampleFrames = [null, ...FRAME_CATALOGUE.map(f => f.id).filter((_, i) => i % 11 === 0)];
const printTypes = PRINT_TYPES.map(p => p.id);
const sizes = PRINT_SIZES.map(s => s.id);

for (const frameId of sampleFrames) {
  for (const printType of printTypes) {
    for (const sizeId of sizes) {
      for (const mountTypeId of MOUNT_TYPES.map(m => m.id)) {
        for (const glassId of ['none', 'standard', 'uv']) {
          const sel = {
            frameId, printType, sizeId,
            customW: null, customH: null,
            mountTypeId,
            mountWidthId: 'standard', customMountWidth: null,
            glassId,
          };
          const c = clientSubtotal(sel);
          const s = server.priceLineItem(sel);
          checked++;
          if (c !== s) {
            mismatches++;
            if (mismatches <= 10) {
              console.log('MISMATCH', JSON.stringify(sel), 'client=', c, 'server=', s);
            }
          }
        }
      }
    }
  }
}

// A few custom-size + custom mount-width cases
for (const frameId of [null, 'E001', 'P047']) {
  for (const mw of [50, 70, 90, 33]) {
    const sel = {
      frameId, printType: 'none', sizeId: 'custom',
      customW: 45.5, customH: 60,
      mountTypeId: frameId ? 'double' : 'none',
      mountWidthId: 'custom', customMountWidth: mw,
      glassId: frameId ? 'uv' : 'none',
    };
    const c = clientSubtotal(sel);
    const s = server.priceLineItem(sel);
    checked++;
    if (c !== s) { mismatches++; console.log('CUSTOM MISMATCH', JSON.stringify(sel), 'client=', c, 'server=', s); }
  }
}

console.log(`\nChecked ${checked} combinations — ${mismatches} mismatches.`);
process.exit(mismatches === 0 ? 0 : 1);
