// ─────────────────────────────────────────────────────────────────────────────
// Pricing snapshot generator
//
// Extracts the authoritative pricing data from the configurator's source of
// truth (configurator/src/newData.js) into data/pricing-data.json, which the
// serverless checkout (api/_pricing.js) uses to recompute prices server-side.
//
// Run this whenever any price in newData.js changes:
//   node scripts/gen-pricing.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  SQCM_PER_SQFT,
  PRINT_PRICES,
  PRINT_SIZES,
  GLASS_OPTIONS,
  MOUNT_TYPES,
  MOUNT_WIDTHS,
  MOUNT_BASE_RATE_PER_SQFT,
  FRAME_MARKUP,
  FRAME_BASE,
  MOUNT_BASE,
  GLASS_BASE,
  FLAT_VAT,
  PACKING_DELIVERY,
  EXPRESS_DELIVERY,
  FRAME_CATALOGUE,
} from '../configurator/src/newData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const printSizes = {};
for (const s of PRINT_SIZES) printSizes[s.id] = { w_cm: s.w_cm, h_cm: s.h_cm };

const glassRates = {};
for (const g of GLASS_OPTIONS) glassRates[g.id] = g.ratePerSqFt;

const mountTypes = {};
for (const m of MOUNT_TYPES) mountTypes[m.id] = { multiplier: m.multiplier, surcharge: m.surcharge };

const mountWidths = {};
for (const w of MOUNT_WIDTHS) mountWidths[w.id] = w.mm;

const frames = {};
for (const f of FRAME_CATALOGUE) frames[f.id] = { costPerM: f.costPerM, widthMm: f.widthMm };

const out = {
  _generated: new Date().toISOString(),
  _note: 'AUTO-GENERATED from configurator/src/newData.js. Do not edit by hand. Regenerate: node scripts/gen-pricing.mjs',
  constants: {
    SQCM_PER_SQFT,
    MOUNT_BASE_RATE_PER_SQFT,
    FRAME_MARKUP,
    FRAME_BASE,
    MOUNT_BASE,
    GLASS_BASE,
    FLAT_VAT,
    PACKING_DELIVERY,
    EXPRESS_DELIVERY,
  },
  printPrices: PRINT_PRICES,
  printSizes,
  glassRates,
  mountTypes,
  mountWidths,
  frames,
};

const dest = join(__dirname, '..', 'data', 'pricing-data.json');
writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`Wrote ${dest}`);
console.log(`  ${Object.keys(frames).length} frames, ${Object.keys(printSizes).length} sizes`);
