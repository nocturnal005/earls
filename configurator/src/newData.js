// ═══════════════════════════════════════════════════════════════════════════════
// Earl's Frame Studio — Data Layer (Rebuild)
// Merged catalogue: 104 ECON + ~54 premium frames
// Component-based pricing: print + frame + mount + glass + handling + VAT
// ═══════════════════════════════════════════════════════════════════════════════

// ── PRINT SIZES & PRICES ────────────────────────────────────────────────────
// Client's Wall Art price list — print-only prices (no framing)

export const PRINT_SIZES = [
  // ISO A-sizes
  { id: 'A4',    label: 'A4',     w_cm: 29.7, h_cm: 21.0,  w_in: '11.7"',  h_in: '8.3"',   group: 'ISO' },
  { id: 'A3',    label: 'A3',     w_cm: 42.0, h_cm: 29.7,  w_in: '16.5"',  h_in: '11.7"',  group: 'ISO' },
  { id: 'A2',    label: 'A2',     w_cm: 59.4, h_cm: 42.0,  w_in: '23.4"',  h_in: '16.5"',  group: 'ISO' },
  { id: 'A1',    label: 'A1',     w_cm: 84.1, h_cm: 59.4,  w_in: '33.1"',  h_in: '23.4"',  group: 'ISO' },
  { id: 'A0',    label: 'A0',     w_cm: 118.9,h_cm: 84.1,  w_in: '46.8"',  h_in: '33.1"',  group: 'ISO' },
  // Imperial sizes (inches, converted to cm for calculations)
  { id: '10x12', label: '10×12"', w_cm: 25.4, h_cm: 30.5,  w_in: '10"',    h_in: '12"',    group: 'Imperial' },
  { id: '12x16', label: '12×16"', w_cm: 30.5, h_cm: 40.6,  w_in: '12"',    h_in: '16"',    group: 'Imperial' },
  { id: '12x18', label: '12×18"', w_cm: 30.5, h_cm: 45.7,  w_in: '12"',    h_in: '18"',    group: 'Imperial' },
  { id: '16x20', label: '16×20"', w_cm: 40.6, h_cm: 50.8,  w_in: '16"',    h_in: '20"',    group: 'Imperial' },
  { id: '20x30', label: '20×30"', w_cm: 50.8, h_cm: 76.2,  w_in: '20"',    h_in: '30"',    group: 'Imperial' },
  { id: '30x40', label: '30×40"', w_cm: 76.2, h_cm: 101.6, w_in: '30"',    h_in: '40"',    group: 'Imperial' },
  { id: '40x60', label: '40×60"', w_cm: 101.6,h_cm: 152.4, w_in: '40"',    h_in: '60"',    group: 'Imperial' },
];

export const PRINT_TYPES = [
  { id: 'poster',    label: 'Poster',         desc: 'Standard photo paper' },
  { id: 'art_paper', label: 'Art Paper',       desc: 'Premium fine art paper' },
  { id: 'canvas',    label: 'Canvas',          desc: 'Stretched canvas print' },
  { id: 'none',      label: 'No Print',        desc: 'I have my own artwork' },
];

// Print prices: keyed by print type → size id
export const PRINT_PRICES = {
  poster: {
    'A4': 14.95, 'A3': 19.95, 'A2': 29.95, 'A1': 39.95, 'A0': 69.99,
    '10x12': 16.95, '12x16': 19.95, '12x18': 23.95, '16x20': 27.95,
    '20x30': 33.00, '30x40': 59.99, '40x60': 89.99,
  },
  art_paper: {
    'A4': 24.95, 'A3': 49.95, 'A2': 67.50, 'A1': 110.00, 'A0': 220.00,
    '10x12': 44.95, '12x16': 49.95, '12x18': 59.95, '16x20': 64.95,
    '20x30': 89.95, '30x40': 220.00, '40x60': 400.00,
  },
  canvas: {
    'A4': null, 'A3': null, 'A2': null, 'A1': null, 'A0': null,
    '10x12': 39.95, '12x16': 44.95, '12x18': null, '16x20': 59.95,
    '20x30': 99.95, '30x40': 189.95, '40x60': 259.95,
  },
  none: {},
};


// ── GLASS PRICING ────────────────────────────────────────────────────────────
// Per square foot rates — price scales with glass area

export const SQCM_PER_SQFT = 929.0304;

export const GLASS_OPTIONS = [
  { id: 'none',       label: 'None',             desc: 'No glazing',                            ratePerSqFt: 0 },
  { id: 'standard',   label: 'Standard Glass',   desc: 'Clear float glass',                     ratePerSqFt: 10.00 },
  { id: 'acrylic',    label: 'Acrylic',          desc: 'Lightweight, shatterproof',              ratePerSqFt: 12.50 },
  { id: 'non_refl',   label: 'Non-Reflective',   desc: 'Anti-glare coating',                    ratePerSqFt: 15.00 },
  { id: 'uv',         label: 'UV Conservation',   desc: '99% UV protection',                     ratePerSqFt: 18.00 },
  { id: 'museum',     label: 'Museum Quality',    desc: 'Anti-reflective + UV protection',       ratePerSqFt: 25.00 },
];


// ── MOUNT OPTIONS ────────────────────────────────────────────────────────────
// Base rate per sq ft for mount board, with multipliers for mount type

export const MOUNT_BASE_RATE_PER_SQFT = 5.00;

export const MOUNT_TYPES = [
  { id: 'none',       label: 'No Mount',          multiplier: 0,    surcharge: 0 },
  { id: 'plain',      label: 'Plain Mount',       multiplier: 1.0,  surcharge: 0 },
  { id: 'v_groove',   label: 'Mount + V-Groove',  multiplier: 1.0,  surcharge: 3.50 },
  { id: 'double',     label: 'Double Mount',      multiplier: 1.6,  surcharge: 0 },
  { id: 'oval',       label: 'Oval Mount',        multiplier: 1.0,  surcharge: 5.00 },
  { id: 'round',      label: 'Round Mount',       multiplier: 1.0,  surcharge: 5.00 },
];

export const MOUNT_WIDTHS = [
  { id: 'standard', label: 'Standard', mm: 50 },
  { id: 'wide',     label: 'Wide',     mm: 70 },
  { id: 'extra',    label: 'Extra Wide', mm: 90 },
];

export const VGROOVE_COLOURS = [
  { id: 'vg-black',     label: 'Black',     hex: '#1A1A1A' },
  { id: 'vg-white',     label: 'White',     hex: '#FFFFFF' },
  { id: 'vg-off-white', label: 'Off White', hex: '#F5F0E1' },
];

export const MOUNT_COLOUR_GROUPS = [
  { id: 'whites',  label: 'Whites & Ivories' },
  { id: 'naturals', label: 'Warm Naturals' },
  { id: 'yellows', label: 'Yellows & Golds' },
  { id: 'pinks',   label: 'Pinks & Reds' },
  { id: 'blues',   label: 'Blues' },
  { id: 'greens',  label: 'Greens' },
  { id: 'greys',   label: 'Greys & Silvers' },
  { id: 'browns',  label: 'Browns, Purples & Black' },
];

export const MOUNT_COLOURS = [
  // Whites & Ivories
  { id: 'pure-white',         label: 'Pure White',         hex: '#FFFFFF', group: 'whites',  code: 'WC-sw23', finish: 'smooth' },
  { id: 'soft-white',         label: 'Soft White',         hex: '#F9F6F1', group: 'whites',  code: 'WC-Aq1',  finish: 'smooth' },
  { id: 'polar-white-ingres', label: 'Polar White Ingres', hex: '#F5F5F0', group: 'whites',  code: 'WC-sw20', finish: 'ingres' },
  { id: 'buttermilk',         label: 'Buttermilk',         hex: '#F5EFE0', group: 'whites',  code: 'WC-8629', finish: 'smooth' },
  { id: 'ivory',              label: 'Ivory',              hex: '#F1E8D6', group: 'whites',  code: 'WC-Aq2',  finish: 'smooth' },
  { id: 'cream-ingres',       label: 'Cream Ingres',       hex: '#F0E9D8', group: 'whites',  code: 'WC-8048', finish: 'ingres' },

  // Warm Naturals
  { id: 'vanilla',            label: 'Vanilla',            hex: '#F3E5C4', group: 'naturals', code: 'WC-8701', finish: 'smooth' },
  { id: 'milkwood-ingres',    label: 'Milkwood Ingres',    hex: '#EDE3D0', group: 'naturals', code: 'WC-8285', finish: 'ingres' },
  { id: 'bamboo',             label: 'Bamboo',             hex: '#D4C5A0', group: 'naturals', code: 'WC-8695', finish: 'smooth' },
  { id: 'maple',              label: 'Maple',              hex: '#C4A265', group: 'naturals', code: 'WC-8017', finish: 'smooth' },
  { id: 'stone',              label: 'Stone',              hex: '#C8BDAD', group: 'naturals', code: 'WC-8632', finish: 'smooth' },
  { id: 'hazelnut',           label: 'Hazelnut',           hex: '#9C7E5A', group: 'naturals', code: 'WC-8013', finish: 'smooth' },

  // Yellows & Golds
  { id: 'primrose',           label: 'Primrose',           hex: '#F7EE8A', group: 'yellows', code: 'WC-Y01',  finish: 'smooth' },
  { id: 'vanilla-b',          label: 'Vanilla',            hex: '#F0DDA0', group: 'yellows', code: 'WC-8701B', finish: 'smooth' },
  { id: 'sahara',             label: 'Sahara',             hex: '#E0C882', group: 'yellows', code: 'WC-Y02',  finish: 'smooth' },
  { id: 'daffodil',           label: 'Daffodil',           hex: '#F5D622', group: 'yellows', code: 'WC-LJ01', finish: 'smooth' },
  { id: 'mustard',            label: 'Mustard',            hex: '#C8A83C', group: 'yellows', code: 'WC-LJ02', finish: 'smooth' },
  { id: 'gold-metallic',      label: 'Gold Metallic',      hex: '#C9A84C', group: 'yellows', code: 'WC-8032', finish: 'metallic' },

  // Pinks & Reds
  { id: 'pastel-pink',        label: 'Pastel Pink',        hex: '#F5D6D6', group: 'pinks',  code: 'WC-P01',  finish: 'smooth' },
  { id: 'dusty-pink',         label: 'Dusty Pink',         hex: '#D4A0A0', group: 'pinks',  code: 'WC-8028', finish: 'smooth' },
  { id: 'dawn-mist',          label: 'Dawn Mist',          hex: '#EECCBB', group: 'pinks',  code: 'WC-8628', finish: 'smooth' },
  { id: 'rouge',              label: 'Rouge',              hex: '#C03030', group: 'pinks',  code: 'WC-8020', finish: 'smooth' },
  { id: 'beaujolais',         label: 'Beaujolais',         hex: '#7B2038', group: 'pinks',  code: 'WC-8151', finish: 'smooth' },
  { id: 'burgundy',           label: 'Burgundy',           hex: '#6B1C2A', group: 'pinks',  code: 'WC-8016', finish: 'smooth' },

  // Blues
  { id: 'pastel-blue',        label: 'Pastel Blue',        hex: '#C4DBE8', group: 'blues',  code: 'WC-8051', finish: 'smooth' },
  { id: 'iced-blue-ingres',   label: 'Iced Blue Ingres',   hex: '#B8D0DD', group: 'blues',  code: 'WC-8154', finish: 'ingres' },
  { id: 'sky',                label: 'Sky',                hex: '#7EB5D6', group: 'blues',  code: 'WC-8805', finish: 'smooth' },
  { id: 'bluebell',           label: 'Bluebell',           hex: '#6B9BC8', group: 'blues',  code: 'WC-8053', finish: 'smooth' },
  { id: 'oxford-blue',        label: 'Oxford Blue',        hex: '#1E3A5F', group: 'blues',  code: 'WC-8054', finish: 'smooth' },
  { id: 'imperial-blue',      label: 'Imperial Blue',      hex: '#0F1F3D', group: 'blues',  code: 'WC-8640', finish: 'smooth' },

  // Greens
  { id: 'pastel-green',       label: 'Pastel Green',       hex: '#C4E0C8', group: 'greens', code: 'WC-8426', finish: 'smooth' },
  { id: 'sage',               label: 'Sage',               hex: '#9CB08C', group: 'greens', code: 'WC-8034', finish: 'smooth' },
  { id: 'guacamole',          label: 'Guacamole',          hex: '#7A8C4A', group: 'greens', code: 'WC-8416', finish: 'smooth' },
  { id: 'laurel',             label: 'Laurel',             hex: '#3D6B3D', group: 'greens', code: 'WC-8645', finish: 'smooth' },
  { id: 'bottle-green',       label: 'Bottle Green',       hex: '#1E4D2B', group: 'greens', code: 'WC-8018G', finish: 'smooth' },
  { id: 'nightshade',         label: 'Nightshade',         hex: '#1A3A30', group: 'greens', code: 'WC-8071', finish: 'smooth' },

  // Greys & Silvers
  { id: 'dove',               label: 'Dove',               hex: '#C8C0B8', group: 'greys',  code: 'WC-8633', finish: 'smooth' },
  { id: 'smoke',              label: 'Smoke',              hex: '#A0A0A0', group: 'greys',  code: 'WC-8026', finish: 'smooth' },
  { id: 'mid-grey',           label: 'Mid Grey',           hex: '#808080', group: 'greys',  code: 'WC-8491', finish: 'smooth' },
  { id: 'slate',              label: 'Slate',              hex: '#5A6A78', group: 'greys',  code: 'WC-8159', finish: 'smooth' },
  { id: 'charcoal',           label: 'Charcoal',           hex: '#383838', group: 'greys',  code: 'WC-8010', finish: 'smooth' },
  { id: 'silver-metallic',    label: 'Silver Metallic',    hex: '#B8B8C0', group: 'greys',  code: 'WC-3033', finish: 'metallic' },

  // Browns, Purples & Black
  { id: 'chestnut',           label: 'Chestnut',           hex: '#7A4A2A', group: 'browns', code: 'WC-8023', finish: 'smooth' },
  { id: 'sepia',              label: 'Sepia',              hex: '#6B4E2F', group: 'browns', code: 'WC-8050', finish: 'smooth' },
  { id: 'rust',               label: 'Rust',               hex: '#B5451B', group: 'browns', code: 'WC-LJ04', finish: 'smooth' },
  { id: 'violet',             label: 'Violet',             hex: '#6B3FA0', group: 'browns', code: 'WC-28031', finish: 'smooth' },
  { id: 'damson',             label: 'Damson',             hex: '#4A1942', group: 'browns', code: 'WC-LJ06', finish: 'smooth' },
  { id: 'deep-black',         label: 'Poster Black',       hex: '#1A1A1A', group: 'browns', code: 'WC-BLK',  finish: 'smooth' },
];


// ── HANDLING / CRAFTING ──────────────────────────────────────────────────────

export const HANDLING_FEE = 5.00;


// ── VAT ──────────────────────────────────────────────────────────────────────

export const VAT_RATE = 0.20;


// ── FRAME MOULDING MARKUP ────────────────────────────────────────────────────

export const FRAME_MARKUP = 3.0;


// ── COLOUR GROUPS (for frame selector Step 1) ────────────────────────────────

export const COLOUR_GROUPS = [
  { id: 'black',        label: 'Black',        hex: '#1C1C1C' },
  { id: 'white',        label: 'White',        hex: '#F5F2ED' },
  { id: 'grey',         label: 'Grey',         hex: '#8A8A8A' },
  { id: 'dark-wood',    label: 'Dark Wood',    hex: '#5C3D2E' },
  { id: 'natural-wood', label: 'Natural Wood', hex: '#C4A265' },
  { id: 'cream',        label: 'Cream',        hex: '#F5ECD7' },
  { id: 'gold',         label: 'Gold',         hex: '#C9A84C' },
  { id: 'silver',       label: 'Silver',       hex: '#A8A8A8' },
  { id: 'colour',       label: 'Colour',       hex: '#5A7A5C' },
];


// ── FRAME CATALOGUE ──────────────────────────────────────────────────────────
// Merged: 104 ECON everyday + ~54 premium (de-duplicated)
// costPerM = Simons cost; retailPerM = costPerM * FRAME_MARKUP
// tier: 'everyday' (ECON range) or 'premium' (specialty/ornate/etc)

export const FRAME_CATALOGUE = [

  // ═══════════════════════════════════════════════════════════════════════════
  // EVERYDAY COLLECTION — ECON & Classic Mouldings (Client's 104 curated list)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── BLACK — Matt (8) ──
  { id: 'E001', code: 'ECON/0008', name: '14mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 13, costPerM: 1.12, tier: 'everyday' },
  { id: 'E002', code: 'ECON/0007', name: '19mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 19, heightMm: 13, costPerM: 1.25, tier: 'everyday' },
  { id: 'E003', code: 'ECON/0003', name: '21mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 21, heightMm: 23, costPerM: 1.90, tier: 'everyday' },
  { id: 'E004', code: 'ECON/0006', name: '24mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 24, heightMm: 13, costPerM: 1.51, tier: 'everyday' },
  { id: 'E005', code: 'ECON/0002', name: '28mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 28, heightMm: 20, costPerM: 2.03, tier: 'everyday' },
  { id: 'E006', code: 'ECON/0005', name: '29mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 29, heightMm: 13, costPerM: 1.80, tier: 'everyday' },
  { id: 'E007', code: 'ECON/0001', name: '38mm Matt Black (deep)',    colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.61, tier: 'everyday' },
  { id: 'E008', code: 'ECON/0004', name: '39mm Matt Black (slim)',    colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 39, heightMm: 13, costPerM: 2.30, tier: 'everyday' },

  // ── BLACK — Stained / Obeche (6) ──
  { id: 'E009', code: 'ECON/0029', name: '15mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E010', code: 'ECON/0022', name: '20mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.51, tier: 'everyday' },
  { id: 'E011', code: 'ECON/0017', name: '35mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 1.90, tier: 'everyday' },
  { id: 'E012', code: 'ECON/0034', name: '38mm Stained Black',        colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },
  { id: 'E013', code: 'ECON/0047', name: '25mm Flat Compo Black',     colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 25, heightMm: 56, costPerM: 4.46, tier: 'everyday' },
  { id: 'E014', code: 'ECON/0049', name: '14mm Flat Compo Black',     colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 14, heightMm: 25, costPerM: 1.80, tier: 'everyday' },

  // ── BLACK — Open Grain (5) ──
  { id: 'E015', code: 'ECON/0076', name: '22mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E016', code: 'ECON/0073', name: '30mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 30, heightMm: 20, costPerM: 2.43, tier: 'everyday' },
  { id: 'E017', code: 'ECON/0070', name: '40mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 40, heightMm: 20, costPerM: 2.89, tier: 'everyday' },
  { id: 'E018', code: 'ECON/0067', name: '55mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 55, heightMm: 20, costPerM: 4.00, tier: 'everyday' },
  { id: 'E019', code: 'ECON/0086', name: '22mm Smooth Black',         colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.84, tier: 'everyday' },

  // ── BLACK — Deep Rebate (1) ──
  { id: 'E020', code: 'ECON/0065', name: '20mm Deep Rebate Black',    colour: 'black', finish: 'Matt',       profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, tier: 'everyday' },

  // ── BLACK — Cushion (7) ──
  { id: 'E021', code: '0075',      name: '½" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.18, tier: 'everyday' },
  { id: 'E022', code: '0080',      name: '⅜" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 9.5,  heightMm: 8,  costPerM: 1.31, tier: 'everyday' },
  { id: 'E023', code: '0080/B',    name: '⅜" Black Stained Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 9.5,  heightMm: 8,  costPerM: 1.97, tier: 'everyday' },
  { id: 'E024', code: '0354',      name: '¾" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 19,   heightMm: 12, costPerM: 1.80, tier: 'everyday' },
  { id: 'E025', code: '0354/B',    name: '20mm Black Stain Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 20,   heightMm: 12, costPerM: 1.97, tier: 'everyday' },
  { id: 'E026', code: '0081',      name: '1" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 25.4, heightMm: 14, costPerM: 3.94, tier: 'everyday' },
  { id: 'E027', code: '000J/304',  name: '30mm Black Cushion',        colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 30,   heightMm: 14, costPerM: 2.13, tier: 'everyday' },

  // ── BLACK — Specialty (5) ──
  { id: 'E028', code: '000J/2035', name: '20mm Flat Ramin Black',     colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 20,   heightMm: 12, costPerM: 2.03, tier: 'everyday' },
  { id: 'E029', code: '000J/241',  name: '20mm Matt Black Lacquer',   colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 20,   heightMm: 12, costPerM: 2.49, tier: 'everyday' },
  { id: 'E030', code: '000J/242',  name: '13.5mm Matt Black Lacquer', colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 13.5, heightMm: 10, costPerM: 1.90, tier: 'everyday' },
  { id: 'E031', code: '000W/846',  name: '19mm Black / Gold Lip',     colour: 'black', finish: 'Specialty',  profile: 'Reverse', widthMm: 19,   heightMm: 12, costPerM: 3.45, tier: 'everyday' },
  { id: 'E032', code: '000K/0406', name: '41mm Reverse Polished Black', colour: 'black', finish: 'Specialty', profile: 'Reverse', widthMm: 41, heightMm: 16, costPerM: 3.94, tier: 'everyday' },

  // ── BLACK — Wide/Statement (3) ──
  { id: 'E033', code: '0075/B',    name: '½" Black Stain Cushion',    colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.31, tier: 'everyday' },
  { id: 'E034', code: '0076',      name: '½" Stained Black Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.31, tier: 'everyday' },
  { id: 'E035', code: '0349/17',   name: '56mm Black Statement',      colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 56,   heightMm: 20, costPerM: 14.27, tier: 'everyday' },
  { id: 'E036', code: '000S/447/3',name: '64mm Gold/Black Outer',     colour: 'black', finish: 'Specialty',  profile: 'Reverse', widthMm: 64,   heightMm: 20, costPerM: 10.11, tier: 'everyday' },
  { id: 'E037', code: 'M0093/B',   name: '¾" Stained Black Flat',     colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 19,   heightMm: 16, costPerM: 1.90, tier: 'everyday' },

  // ── WHITE — Matt (8) ──
  { id: 'E038', code: 'ECON/0016', name: '14mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 13, costPerM: 1.12, tier: 'everyday' },
  { id: 'E039', code: 'ECON/0015', name: '19mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 19, heightMm: 13, costPerM: 1.25, tier: 'everyday' },
  { id: 'E040', code: 'ECON/0011', name: '21mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 21, heightMm: 23, costPerM: 1.90, tier: 'everyday' },
  { id: 'E041', code: 'ECON/0014', name: '24mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 24, heightMm: 13, costPerM: 1.51, tier: 'everyday' },
  { id: 'E042', code: 'ECON/0010', name: '28mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 28, heightMm: 20, costPerM: 2.03, tier: 'everyday' },
  { id: 'E043', code: 'ECON/0013', name: '29mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 29, heightMm: 13, costPerM: 1.80, tier: 'everyday' },
  { id: 'E044', code: 'ECON/0009', name: '38mm Matt White (deep)',    colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.61, tier: 'everyday' },
  { id: 'E045', code: 'ECON/0012', name: '39mm Matt White (slim)',    colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 39, heightMm: 13, costPerM: 2.30, tier: 'everyday' },

  // ── WHITE — Stained / Obeche (4) ──
  { id: 'E046', code: 'ECON/0033', name: '15mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E047', code: 'ECON/0024', name: '20mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.51, tier: 'everyday' },
  { id: 'E048', code: 'ECON/0019', name: '35mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 1.90, tier: 'everyday' },
  { id: 'E049', code: 'ECON/0035', name: '38mm Stained White',        colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },

  // ── WHITE — Open Grain (4) ──
  { id: 'E050', code: 'ECON/0077', name: '22mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E051', code: 'ECON/0074', name: '30mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 30, heightMm: 20, costPerM: 2.43, tier: 'everyday' },
  { id: 'E052', code: 'ECON/0071', name: '40mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 40, heightMm: 20, costPerM: 2.89, tier: 'everyday' },
  { id: 'E053', code: 'ECON/0068', name: '55mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 55, heightMm: 20, costPerM: 4.00, tier: 'everyday' },

  // ── WHITE — Compo & Rebate (4) ──
  { id: 'E054', code: 'ECON/0048', name: '25mm Flat Compo White',     colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 25, heightMm: 56, costPerM: 4.46, tier: 'everyday' },
  { id: 'E055', code: 'ECON/0050', name: '14mm Flat Compo White',     colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 25, costPerM: 1.80, tier: 'everyday' },
  { id: 'E056', code: 'ECON/0064', name: '20mm Deep Rebate White',    colour: 'white', finish: 'Matt',       profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, tier: 'everyday' },
  { id: 'E057', code: 'ECON/0087', name: '22mm Smooth White',         colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.84, tier: 'everyday' },

  // ── GREY — Light Grey (4) ──
  { id: 'E058', code: 'ECON/0046', name: '15mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E059', code: 'ECON/0045', name: '20mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, tier: 'everyday' },
  { id: 'E060', code: 'ECON/0044', name: '35mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E061', code: 'ECON/0043', name: '38mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.67, tier: 'everyday' },

  // ── GREY — Taupe (4) ──
  { id: 'E062', code: 'ECON/0058', name: '15mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E063', code: 'ECON/0057', name: '20mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, tier: 'everyday' },
  { id: 'E064', code: 'ECON/0056', name: '35mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E065', code: 'ECON/0055', name: '38mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.35, tier: 'everyday' },

  // ── GREY — Washed Light Grey (4) ──
  { id: 'E066', code: 'ECON/0062', name: '15mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E067', code: 'ECON/0061', name: '20mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, tier: 'everyday' },
  { id: 'E068', code: 'ECON/0060', name: '35mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E069', code: 'ECON/0059', name: '38mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },

  // ── GREY — Open Grain (2) ──
  { id: 'E070', code: 'ECON/0080', name: '22mm Grey Open Grain',      colour: 'grey', finish: 'Open Grain',  profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E071', code: 'ECON/0081', name: '22mm Light Grey Open Grain',colour: 'grey', finish: 'Open Grain',  profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },

  // ── DARK WOOD — Brown / Dark Grey (12) ──
  { id: 'E072', code: 'ECON/0032', name: '15mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E073', code: 'ECON/0023', name: '20mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 20, heightMm: 15, costPerM: 1.51, tier: 'everyday' },
  { id: 'E074', code: 'ECON/0018', name: '35mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E075', code: 'ECON/0038', name: '38mm Stained Brown',        colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },
  { id: 'E076', code: 'ECON/0054', name: '15mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E077', code: 'ECON/0053', name: '20mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.57, tier: 'everyday' },
  { id: 'E078', code: 'ECON/0052', name: '35mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E079', code: 'ECON/0051', name: '38mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },
  { id: 'E080', code: 'ECON/0082', name: '22mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E081', code: 'ECON/0075', name: '30mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 30, heightMm: 20, costPerM: 2.43, tier: 'everyday' },
  { id: 'E082', code: 'ECON/0072', name: '40mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 40, heightMm: 20, costPerM: 2.89, tier: 'everyday' },
  { id: 'E083', code: 'ECON/0069', name: '55mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 55, heightMm: 20, costPerM: 4.00, tier: 'everyday' },

  // ── NATURAL WOOD — Oak (11) ──
  { id: 'E084', code: 'ECON/0031', name: '15mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E085', code: 'ECON/0030', name: '15mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E086', code: 'ECON/0025', name: '20mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.51, tier: 'everyday' },
  { id: 'E087', code: 'ECON/0026', name: '20mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.51, tier: 'everyday' },
  { id: 'E088', code: 'ECON/0020', name: '35mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E089', code: 'ECON/0021', name: '35mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E090', code: 'ECON/0037', name: '38mm Stained Light Oak',    colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },
  { id: 'E091', code: 'ECON/0036', name: '38mm Stained Medium Oak',   colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },
  { id: 'E092', code: 'ECON/0066', name: '20mm Oak Deep Rebate',      colour: 'natural-wood', finish: 'Light Oak', profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, tier: 'everyday' },
  { id: 'E093', code: 'ECON/0078', name: '22mm Oak Open Grain',       colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E094', code: 'ECON/0079', name: '22mm Light Oak Open Grain', colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },

  // ── CREAM (4) ──
  { id: 'E095', code: 'ECON/0042', name: '15mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, tier: 'everyday' },
  { id: 'E096', code: 'ECON/0041', name: '20mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, tier: 'everyday' },
  { id: 'E097', code: 'ECON/0040', name: '35mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E098', code: 'ECON/0039', name: '38mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, tier: 'everyday' },

  // ── COLOUR (4) ──
  { id: 'E099', code: 'ECON/0063', name: '35mm Green Painted',        colour: 'colour', finish: 'Painted',   profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday' },
  { id: 'E100', code: 'ECON/0083', name: '22mm Blue Open Grain',      colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E101', code: 'ECON/0084', name: '22mm Red Open Grain',       colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },
  { id: 'E102', code: 'ECON/0085', name: '22mm Green Open Grain',     colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday' },

  // ── OTHER (1) ──
  { id: 'E103', code: 'M0093',     name: '¾" Flat Picture Moulding',  colour: 'natural-wood', finish: 'Raw', profile: 'Flat',    widthMm: 19, heightMm: 16, costPerM: 1.64, tier: 'everyday' },


  // ═══════════════════════════════════════════════════════════════════════════
  // PREMIUM & SPECIALTY COLLECTION — Existing 54 frames (de-duplicated)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Classic Wood (8) ──
  { id: 'P001', code: '000J/0082', name: 'Light Oak Flat',            colour: 'natural-wood', finish: 'Stained', profile: 'Flat',   widthMm: 20, heightMm: 12, costPerM: 1.44, tier: 'premium' },
  { id: 'P002', code: '000J/0095', name: 'Medium Oak',                colour: 'natural-wood', finish: 'Stained', profile: 'Flat',   widthMm: 35, heightMm: 14, costPerM: 4.20, tier: 'premium' },
  { id: 'P003', code: '000J/0097', name: 'Dark Walnut',               colour: 'dark-wood', finish: 'Stained',    profile: 'Flat',   widthMm: 35, heightMm: 14, costPerM: 4.20, tier: 'premium' },
  { id: 'P004', code: '0001/T',    name: 'Two Tone Oak Gold',         colour: 'natural-wood', finish: 'Stained', profile: 'Raised', widthMm: 29, heightMm: 14, costPerM: 2.95, tier: 'premium' },
  { id: 'P005', code: '000K/0890', name: 'Cherry Scoop',              colour: 'dark-wood', finish: 'Polish',     profile: 'Scoop',  widthMm: 64, heightMm: 20, costPerM: 7.00, tier: 'premium' },
  { id: 'P006', code: '444343000', name: 'Curl Walnut Veneer',        colour: 'dark-wood', finish: 'Veneer',     profile: 'Flat',   widthMm: 30, heightMm: 14, costPerM: 4.92, tier: 'premium' },
  { id: 'P007', code: '000J/13',   name: 'Plain Pine Slim',           colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 15, heightMm: 10, costPerM: 1.41, tier: 'premium' },
  { id: 'P008', code: 'DAN/21',    name: 'Rough Hewn Pine',           colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 33, heightMm: 16, costPerM: 1.74, tier: 'premium' },

  // ── Modern Flat (6 — deduplicated: 000J/241, 000J/242 already in everyday) ──
  { id: 'P009', code: '000J/0086', name: 'Flat Ebony',                colour: 'black', finish: 'Stained',        profile: 'Flat',   widthMm: 20, heightMm: 12, costPerM: 1.44, tier: 'premium' },
  { id: 'P010', code: 'COSM/0027', name: 'Black Gloss Flat',          colour: 'black', finish: 'Gloss',          profile: 'Flat',   widthMm: 21, heightMm: 12, costPerM: 2.43, tier: 'premium' },
  { id: 'P011', code: 'LUNA/0002', name: 'White Deep Rebate',         colour: 'white', finish: 'Painted',        profile: 'Flat',   widthMm: 13, heightMm: 22, costPerM: 3.28, tier: 'premium' },
  { id: 'P012', code: 'LUNA/0006', name: 'Dark Grey Flat',            colour: 'grey',  finish: 'Painted',        profile: 'Flat',   widthMm: 13, heightMm: 14, costPerM: 1.71, tier: 'premium' },
  { id: 'P013', code: 'WRAP/20',   name: 'Beech Angled Edge',         colour: 'natural-wood', finish: 'Lacquer', profile: 'Flat',   widthMm: 35, heightMm: 14, costPerM: 1.77, tier: 'premium' },
  { id: 'P014', code: '000J/1064', name: 'Wide Flat Rounded',         colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 64, heightMm: 16, costPerM: 3.35, tier: 'premium' },
  { id: 'P015', code: '000J/10',   name: 'Raw Pine Wide',             colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 44, heightMm: 16, costPerM: 1.74, tier: 'premium' },

  // ── Ornate & Swept (7) ──
  { id: 'P016', code: 'DECO/0003', name: 'Ornate Gold Embossed',      colour: 'gold',   finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, tier: 'premium' },
  { id: 'P017', code: 'DECO/0001', name: 'Ornate White Embossed',     colour: 'white',  finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, tier: 'premium' },
  { id: 'P018', code: 'DECO/0004', name: 'Ornate Silver Embossed',    colour: 'silver', finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, tier: 'premium' },
  { id: 'P019', code: '000K/0678', name: 'Grand Gold Ornate',         colour: 'gold',   finish: 'Gilt',      profile: 'Ornate', widthMm: 72, heightMm: 28, costPerM: 18.37, tier: 'premium' },
  { id: 'P020', code: 'ROYAL/0001',name: 'Royal Gold Scoop',          colour: 'gold',   finish: 'Embossed',  profile: 'Scoop',  widthMm: 65, heightMm: 24, costPerM: 14.76, tier: 'premium' },
  { id: 'P021', code: 'ROYAL/0002',name: 'Royal Silver Scoop',        colour: 'silver', finish: 'Embossed',  profile: 'Scoop',  widthMm: 65, heightMm: 24, costPerM: 14.76, tier: 'premium' },
  { id: 'P022', code: 'LOUI/0001', name: 'Gold Embossed Lip',         colour: 'gold',   finish: 'Embossed',  profile: 'Raised', widthMm: 26, heightMm: 14, costPerM: 5.41,  tier: 'premium' },

  // ── Gold & Silver (8) ──
  { id: 'P023', code: '5404/6008', name: 'Flat Gold',                 colour: 'gold',   finish: 'Gilt',      profile: 'Flat',   widthMm: 23, heightMm: 12, costPerM: 2.95, tier: 'premium' },
  { id: 'P024', code: '5401/7018', name: 'Brushed Silver Ovaloe',     colour: 'silver', finish: 'Brushed',   profile: 'Ovaloe', widthMm: 25, heightMm: 14, costPerM: 6.23, tier: 'premium' },
  { id: 'P025', code: '5403/6018', name: 'Brushed Gold Ovaloe',       colour: 'gold',   finish: 'Brushed',   profile: 'Ovaloe', widthMm: 50, heightMm: 18, costPerM: 9.02, tier: 'premium' },
  { id: 'P026', code: '000K/0843', name: 'Silver L-Shape',            colour: 'silver', finish: 'Leaf',      profile: 'L-Shape',widthMm: 38, heightMm: 20, costPerM: 6.89, tier: 'premium' },
  { id: 'P027', code: '000K/0844', name: 'Gold L-Shape',              colour: 'gold',   finish: 'Leaf',      profile: 'L-Shape',widthMm: 38, heightMm: 20, costPerM: 7.87, tier: 'premium' },
  { id: 'P028', code: 'DAB/4',     name: 'Silver Leaf Ovaloe',        colour: 'silver', finish: 'Leaf',      profile: 'Ovaloe', widthMm: 66, heightMm: 22, costPerM: 7.38, tier: 'premium' },
  { id: 'P029', code: '0135/0001', name: 'Scratched Gold Raised',     colour: 'gold',   finish: 'Antiqued',  profile: 'Raised', widthMm: 35, heightMm: 16, costPerM: 6.56, tier: 'premium' },
  { id: 'P030', code: '0135/0002', name: 'Scratched Silver Raised',   colour: 'silver', finish: 'Antiqued',  profile: 'Raised', widthMm: 35, heightMm: 16, costPerM: 6.56, tier: 'premium' },

  // ── Distressed & Rustic (7) ──
  { id: 'P031', code: '0321/1265', name: 'Gold Distressed Red',       colour: 'gold',   finish: 'Distressed',profile: 'Panel',  widthMm: 22, heightMm: 14, costPerM: 6.23, tier: 'premium' },
  { id: 'P032', code: '0321/1268', name: 'Silver Blue Distressed',    colour: 'silver', finish: 'Distressed',profile: 'Panel',  widthMm: 22, heightMm: 14, costPerM: 6.23, tier: 'premium' },
  { id: 'P033', code: 'DAVINCI/0005',name:'Dove Scoop Distressed',    colour: 'grey',   finish: 'Distressed',profile: 'Scoop',  widthMm: 30, heightMm: 16, costPerM: 5.74, tier: 'premium' },
  { id: 'P034', code: 'SALZ/0001', name: 'Black Spoon Distressed',    colour: 'black',  finish: 'Distressed',profile: 'Spoon',  widthMm: 22, heightMm: 12, costPerM: 5.09, tier: 'premium' },
  { id: 'P035', code: 'SALZ/0003', name: 'White Spoon Distressed',    colour: 'white',  finish: 'Distressed',profile: 'Spoon',  widthMm: 22, heightMm: 12, costPerM: 5.09, tier: 'premium' },
  { id: 'P036', code: 'PALE/0002', name: 'Silver Box Distressed',     colour: 'silver', finish: 'Distressed',profile: 'Flat',   widthMm: 50, heightMm: 22, costPerM: 9.19, tier: 'premium' },
  { id: 'P037', code: 'YORK/0005', name: 'Black Wash Scoop',          colour: 'black',  finish: 'Wash',      profile: 'Scoop',  widthMm: 26, heightMm: 14, costPerM: 2.82, tier: 'premium' },

  // ── Painted & Colour (7) ──
  { id: 'P038', code: 'DISP/0003', name: 'Painted White Wide',        colour: 'white',  finish: 'Painted',   profile: 'Flat',   widthMm: 82, heightMm: 22, costPerM: 6.23, tier: 'premium' },
  { id: 'P039', code: 'DISP/0002', name: 'Painted Black Wide',        colour: 'black',  finish: 'Painted',   profile: 'Flat',   widthMm: 82, heightMm: 22, costPerM: 6.23, tier: 'premium' },
  { id: 'P040', code: '2935/3303', name: 'Sloped Green',              colour: 'colour', finish: 'Painted',   profile: 'Sloped', widthMm: 16, heightMm: 10, costPerM: 4.99, tier: 'premium' },
  { id: 'P041', code: '2935/3301', name: 'Sloped Charcoal',           colour: 'grey',   finish: 'Painted',   profile: 'Sloped', widthMm: 16, heightMm: 10, costPerM: 4.99, tier: 'premium' },
  { id: 'P042', code: 'COSM/0024', name: 'Blue Gloss Chamford',       colour: 'colour', finish: 'Gloss',     profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, tier: 'premium' },
  { id: 'P043', code: 'COSM/0025', name: 'Grey Gloss Chamford',       colour: 'grey',   finish: 'Gloss',     profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, tier: 'premium' },
  { id: 'P044', code: 'COSM/0026', name: 'White Gloss Chamford',      colour: 'white',  finish: 'Gloss',     profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, tier: 'premium' },

  // ── Cushion & Scoop (5 — deduplicated: 000J/304 already in everyday) ──
  { id: 'P045', code: '528568000', name: 'White Lacquer Cushion',     colour: 'white',  finish: 'Lacquer',   profile: 'Cushion',widthMm: 13, heightMm: 10, costPerM: 2.17, tier: 'premium' },
  { id: 'P046', code: '000K/0342', name: 'Oak Cushion',               colour: 'natural-wood', finish: 'Stained', profile: 'Cushion', widthMm: 40, heightMm: 16, costPerM: 3.15, tier: 'premium' },
  { id: 'P047', code: '000K/0558', name: 'Silver Scoop Wide',         colour: 'silver', finish: 'Leaf',      profile: 'Scoop',  widthMm: 80, heightMm: 24, costPerM: 11.32, tier: 'premium' },
  { id: 'P048', code: '000K/0758', name: 'Natural Obeche Scoop',      colour: 'natural-wood', finish: 'Raw', profile: 'Scoop',  widthMm: 48, heightMm: 18, costPerM: 4.59, tier: 'premium' },
  { id: 'P049', code: 'YORK/0001', name: 'Light Brown Wash Scoop',    colour: 'dark-wood', finish: 'Wash',   profile: 'Scoop',  widthMm: 26, heightMm: 14, costPerM: 2.82, tier: 'premium' },

  // ── Box & Tray (5 — deduplicated: 000K/0477 vs 0477B, kept one) ──
  { id: 'P050', code: '000K/0477', name: 'Black Box Frame',           colour: 'black',  finish: 'Painted',   profile: 'Box',    widthMm: 30, heightMm: 30, costPerM: 4.10, tier: 'premium' },
  { id: 'P051', code: 'DISP/0001', name: 'Unfinished Pine Box',       colour: 'natural-wood', finish: 'Raw', profile: 'Box',    widthMm: 45, heightMm: 30, costPerM: 1.74, tier: 'premium' },
  { id: 'P052', code: 'LUNA/0001', name: 'Black Deep Rebate',         colour: 'black',  finish: 'Painted',   profile: 'Deep Rebate', widthMm: 13, heightMm: 22, costPerM: 3.28, tier: 'premium' },
  { id: 'P053', code: 'LUNA/0004', name: 'Light Grey Deep Rebate',    colour: 'grey',   finish: 'Painted',   profile: 'Deep Rebate', widthMm: 13, heightMm: 22, costPerM: 3.28, tier: 'premium' },
  { id: 'P054', code: 'LUNA/0008', name: 'Taupe Deep Rebate',         colour: 'grey',   finish: 'Painted',   profile: 'Deep Rebate', widthMm: 13, heightMm: 22, costPerM: 3.28, tier: 'premium' },

  // ── Canvas & Floater (4) ──
  { id: 'P055', code: 'REMB/0009', name: 'Black Stain Floater',       colour: 'black',  finish: 'Stained',   profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 11.32, tier: 'premium' },
  { id: 'P056', code: 'REMB/0011', name: 'Brown Stain Floater',       colour: 'dark-wood', finish: 'Stained',profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 9.84, tier: 'premium' },
  { id: 'P057', code: 'REMB/0013', name: 'White Gloss Floater',       colour: 'white',  finish: 'Gloss',     profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 14.44, tier: 'premium' },
  { id: 'P058', code: 'REMB/0014', name: 'Natural Floater',           colour: 'natural-wood', finish: 'Raw', profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 9.84, tier: 'premium' },
];


// ── PRICING ENGINE ───────────────────────────────────────────────────────────

export function calcFramePerimeter(w_cm, h_cm) {
  return ((w_cm + h_cm) * 2) / 100; // metres
}

export function calcGlassArea(w_cm, h_cm) {
  return (w_cm * h_cm) / SQCM_PER_SQFT; // sq ft
}

export function calcPrintPrice(printType, sizeId) {
  if (printType === 'none') return 0;
  const prices = PRINT_PRICES[printType];
  return prices?.[sizeId] ?? null;
}

export function calcFramePrice(frame, w_cm, h_cm) {
  const perimM = calcFramePerimeter(w_cm, h_cm);
  return perimM * frame.costPerM * FRAME_MARKUP;
}

export function calcMountPrice(mountTypeId, w_cm, h_cm, mountWidthMm = 50) {
  const mt = MOUNT_TYPES.find(m => m.id === mountTypeId);
  if (!mt || mt.multiplier === 0) return 0;
  const borderCm = mountWidthMm / 10;
  const outerArea = (w_cm + 2 * borderCm) * (h_cm + 2 * borderCm);
  const mountAreaSqFt = (outerArea - w_cm * h_cm) / SQCM_PER_SQFT;
  return (mountAreaSqFt * MOUNT_BASE_RATE_PER_SQFT * mt.multiplier) + mt.surcharge;
}

export function calcGlassPrice(glassId, w_cm, h_cm) {
  const glass = GLASS_OPTIONS.find(g => g.id === glassId);
  if (!glass || glass.ratePerSqFt === 0) return 0;
  const areaSqFt = calcGlassArea(w_cm, h_cm);
  return areaSqFt * glass.ratePerSqFt;
}

export function calcTotal(selections) {
  const { printType, sizeId, frame, mountTypeId, glassId } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  if (!size || !frame) return null;

  const printPrice   = calcPrintPrice(printType, sizeId) || 0;
  const framePrice   = calcFramePrice(frame, size.w_cm, size.h_cm);
  const mountPrice   = calcMountPrice(mountTypeId, size.w_cm, size.h_cm);
  const glassPrice   = calcGlassPrice(glassId, size.w_cm, size.h_cm);
  const handlingPrice = HANDLING_FEE;

  const subtotal = printPrice + framePrice + mountPrice + glassPrice + handlingPrice;
  const vat      = subtotal * VAT_RATE;
  const total    = subtotal + vat;

  return {
    printPrice:   round2(printPrice),
    framePrice:   round2(framePrice),
    mountPrice:   round2(mountPrice),
    glassPrice:   round2(glassPrice),
    handlingPrice: round2(handlingPrice),
    subtotal:     round2(subtotal),
    vat:          round2(vat),
    total:        round2(total),
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}


// ── HELPER: Get finish groups for a colour ───────────────────────────────────

export function getFinishesForColour(colourId, tier = 'all') {
  const frames = FRAME_CATALOGUE.filter(f => {
    const colourMatch = f.colour === colourId;
    const tierMatch = tier === 'all' || f.tier === tier;
    return colourMatch && tierMatch;
  });

  const finishMap = {};
  frames.forEach(f => {
    if (!finishMap[f.finish]) {
      finishMap[f.finish] = { id: f.finish, label: f.finish, frames: [] };
    }
    finishMap[f.finish].frames.push(f);
  });

  return Object.values(finishMap).map(fg => ({
    ...fg,
    frames: fg.frames.sort((a, b) => a.widthMm - b.widthMm),
    count: fg.frames.length,
  }));
}


// ── HELPER: Recommend frame width based on artwork size ──────────────────────

export function recommendWidth(w_cm, h_cm) {
  const maxDim = Math.max(w_cm, h_cm);
  if (maxDim <= 25) return { min: 14, ideal: 19, max: 24 };
  if (maxDim <= 42) return { min: 19, ideal: 24, max: 30 };
  if (maxDim <= 60) return { min: 24, ideal: 30, max: 40 };
  if (maxDim <= 85) return { min: 30, ideal: 38, max: 55 };
  return { min: 35, ideal: 40, max: 65 };
}
