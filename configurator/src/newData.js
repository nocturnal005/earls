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
  { id: 'custom',   label: 'Custom',   mm: null },
];

export const VGROOVE_COLOURS = [
  { id: 'vg-black',     label: 'Black',     hex: '#1A1A1A' },
  { id: 'vg-white',     label: 'White',     hex: '#FFFFFF' },
  { id: 'vg-off-white', label: 'Off White', hex: '#F5F0E1' },
];

export const MOUNT_COLOUR_GROUPS = [
  { id: 'whites',  label: 'Whites' },
  { id: 'creams',  label: 'Creams & Ivories' },
  { id: 'pinks',   label: 'Pinks & Reds' },
  { id: 'blues',   label: 'Blues' },
  { id: 'greens',  label: 'Greens' },
  { id: 'greys',   label: 'Greys' },
  { id: 'browns',  label: 'Browns & Murano' },
  { id: 'blacks',  label: 'Blacks & Metallic' },
];

export const MOUNT_COLOURS = [
  // Whites
  { id: 'bright-white',            label: 'Bright White',            hex: '#FFFFFF', group: 'whites', code: 'MB/017',    finish: 'smooth' },
  { id: 'ice-white',               label: 'Ice White',               hex: '#F7F9FA', group: 'whites', code: 'MB/DR8091', finish: 'smooth' },
  { id: 'snow-white',              label: 'Snow White',              hex: '#F8F8F8', group: 'whites', code: 'MB/3354',   finish: 'smooth' },
  { id: 'polar-white-ingres',      label: 'Polar White Ingres',      hex: '#F4F2ED', group: 'whites', code: 'MB/DR3700', finish: 'ingres' },
  { id: 'soft-white-ingres',       label: 'Soft White Ingres',       hex: '#F0EBE3', group: 'whites', code: 'MB/DR3767', finish: 'ingres' },
  { id: 'tint-1',                  label: 'Tint 1',                  hex: '#F0EDEA', group: 'whites', code: 'MB/DR8101', finish: 'smooth' },
  { id: 'tint-3-texture',          label: 'Tint 3 Texture',          hex: '#E8E0D4', group: 'whites', code: 'MB/DR8103', finish: 'texture' },
  { id: 'tint-4-ingres',           label: 'Tint 4 Ingres',           hex: '#E5DDD0', group: 'whites', code: 'MB/DR8104', finish: 'ingres' },
  { id: 'tint-5',                  label: 'Tint 5',                  hex: '#E0D8CC', group: 'whites', code: 'MB/DR8105', finish: 'smooth' },

  // Creams & Ivories
  { id: 'antique-ivory-texture',   label: 'Antique Ivory Texture',   hex: '#EDE5D0', group: 'creams', code: 'MB/DR8601', finish: 'texture' },
  { id: 'antique-white',           label: 'Antique White',           hex: '#F0EAE0', group: 'creams', code: 'MB/DR3369', finish: 'smooth' },
  { id: 'antique-white-texture',   label: 'Antique White Texture',   hex: '#EEE8DC', group: 'creams', code: 'MB/DR3701', finish: 'texture' },
  { id: 'champagne',               label: 'Champagne',               hex: '#F0E6CE', group: 'creams', code: 'MB/DR3711', finish: 'smooth' },
  { id: 'jasmine-texture',         label: 'Jasmine Texture',         hex: '#F5EDD8', group: 'creams', code: 'MB/DR3623', finish: 'texture' },
  { id: 'catkin',                   label: 'Catkin',                  hex: '#D4C8A0', group: 'creams', code: 'MB/013',    finish: 'smooth' },
  { id: 'parchment',               label: 'Parchment',               hex: '#E0D4B8', group: 'creams', code: 'MB/DR8045', finish: 'smooth' },
  { id: 'primrose',                label: 'Primrose',                hex: '#F5E87A', group: 'creams', code: 'MB/024',    finish: 'smooth' },
  { id: 'sahara',                  label: 'Sahara',                  hex: '#D8C070', group: 'creams', code: 'MB/DR8087', finish: 'smooth' },
  { id: 'sandstone',               label: 'Sandstone',               hex: '#C8B898', group: 'creams', code: 'MB/DR8046', finish: 'smooth' },
  { id: 'stone',                   label: 'Stone',                   hex: '#AEA390', group: 'creams', code: 'MB/DR8056', finish: 'smooth' },
  { id: 'stone-grey',              label: 'Stone Grey',              hex: '#989088', group: 'creams', code: 'MB/DR3737', finish: 'smooth' },

  // Pinks & Reds
  { id: 'dawn-pink',               label: 'Dawn Pink',               hex: '#E0B0A8', group: 'pinks', code: 'MB/018',    finish: 'smooth' },
  { id: 'sunset-pink',             label: 'Sunset Pink',             hex: '#E8A0A0', group: 'pinks', code: 'MB/DR8059', finish: 'smooth' },
  { id: 'pompadour',               label: 'Pompadour',               hex: '#C86080', group: 'pinks', code: 'MB/DR8041', finish: 'smooth' },
  { id: 'crimson',                  label: 'Crimson',                 hex: '#A01020', group: 'pinks', code: 'MB/016',    finish: 'smooth' },
  { id: 'poppy-red',               label: 'Poppy Red',               hex: '#C82020', group: 'pinks', code: 'MB/DR3723', finish: 'smooth' },
  { id: 'pillar-box-red',          label: 'Pillar Box Red',          hex: '#CC0000', group: 'pinks', code: 'MB/DR8066', finish: 'smooth' },
  { id: 'scarlet',                  label: 'Scarlet',                 hex: '#D02030', group: 'pinks', code: 'MB/DR3748', finish: 'smooth' },
  { id: 'maroon',                   label: 'Maroon',                  hex: '#5C1020', group: 'pinks', code: 'MB/DR3731', finish: 'smooth' },
  { id: 'terracotta',              label: 'Terracotta',              hex: '#B85030', group: 'pinks', code: 'MB/DR8085', finish: 'smooth' },

  // Blues
  { id: 'delft-blue',              label: 'Delft Blue',              hex: '#4068A0', group: 'blues', code: 'MB/DR8074', finish: 'smooth' },
  { id: 'horizon-blue',            label: 'Horizon Blue',            hex: '#6090B8', group: 'blues', code: 'MB/DR8028', finish: 'smooth' },
  { id: 'hussar-blue',             label: 'Hussar Blue',             hex: '#1C3060', group: 'blues', code: 'MB/DR3729', finish: 'smooth' },
  { id: 'saxe-blue',               label: 'Saxe Blue',               hex: '#5880A0', group: 'blues', code: 'MB/DR8047', finish: 'smooth' },
  { id: 'wedgewood',               label: 'Wedgewood',               hex: '#5A7DA0', group: 'blues', code: 'MB/DR8083', finish: 'smooth' },

  // Greens
  { id: 'avocado',                  label: 'Avocado',                 hex: '#6B7030', group: 'greens', code: 'MB/002',    finish: 'smooth' },
  { id: 'bottle-green',            label: 'Bottle Green',            hex: '#1E4D2B', group: 'greens', code: 'MB/006',    finish: 'smooth' },
  { id: 'holly-green',             label: 'Holly Green',             hex: '#2A5A30', group: 'greens', code: 'MB/DR8027', finish: 'smooth' },
  { id: 'jade',                     label: 'Jade',                    hex: '#408060', group: 'greens', code: 'MB/DR8035', finish: 'smooth' },
  { id: 'russian-green',           label: 'Russian Green',           hex: '#284028', group: 'greens', code: 'MB/DR3743', finish: 'smooth' },

  // Greys
  { id: 'ash-grey',                label: 'Ash Grey',                hex: '#B0A898', group: 'greys', code: 'MB/001',    finish: 'smooth' },
  { id: 'dawn-grey',               label: 'Dawn Grey',               hex: '#C0B8AE', group: 'greys', code: 'MB/DR8073', finish: 'smooth' },
  { id: 'dark-grey',               label: 'Dark Grey',               hex: '#585858', group: 'greys', code: 'MB/8072',   finish: 'smooth' },
  { id: 'dove-grey',               label: 'Dove Grey',               hex: '#B8B0A8', group: 'greys', code: 'MB/022',    finish: 'smooth' },
  { id: 'mid-grey',                label: 'Mid Grey',                hex: '#808080', group: 'greys', code: 'MB/8034',   finish: 'smooth' },
  { id: 'misty-grey',              label: 'Misty Grey',              hex: '#A0A0A0', group: 'greys', code: 'MB/DR8036', finish: 'smooth' },

  // Browns & Murano
  { id: 'coffee',                   label: 'Coffee',                  hex: '#6B4E2F', group: 'browns', code: 'MB/014',    finish: 'smooth' },
  { id: 'sepia',                   label: 'Sepia',                   hex: '#5C3D20', group: 'browns', code: 'MB/DR8050', finish: 'smooth' },
  { id: 'seal',                    label: 'Seal',                    hex: '#4A3828', group: 'browns', code: 'MB/DR3749', finish: 'smooth' },
  { id: 'plum',                    label: 'Plum',                    hex: '#5A2848', group: 'browns', code: 'MB/DR8067', finish: 'smooth' },
  { id: 'chocolate-murano',        label: 'Chocolate Murano',        hex: '#3C2415', group: 'browns', code: 'MB/DR5028', finish: 'murano' },
  { id: 'midnight-murano',         label: 'Midnight Murano',         hex: '#1A1A30', group: 'browns', code: 'MB/DR5034', finish: 'murano' },

  // Blacks & Metallic
  { id: 'deep-black',              label: 'Deep Black',              hex: '#1A1A1A', group: 'blacks', code: 'MB/010',    finish: 'smooth' },
  { id: 'charcoal-black',          label: 'Charcoal Black',          hex: '#2A2A2A', group: 'blacks', code: 'MB/DR3712', finish: 'smooth' },
  { id: 'gold-metallic',           label: 'Gold Metallic',           hex: '#C9A84C', group: 'blacks', code: 'MB/DR8032', finish: 'metallic' },
  { id: 'silver-metallic',         label: 'Silver Metallic',         hex: '#B8C0C8', group: 'blacks', code: 'MB/DR8033', finish: 'metallic' },
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
  { id: 'E001', code: 'ECON/0008', name: '14mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 13, costPerM: 1.12, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0008.jpg', textureMap: 'mouldings/strips/ECON_0008', faceHex: '#151518' },
  { id: 'E002', code: 'ECON/0007', name: '19mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 19, heightMm: 13, costPerM: 1.25, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0007.jpg', textureMap: 'mouldings/strips/ECON_0007', faceHex: '#1d1c1f' },
  { id: 'E003', code: 'ECON/0003', name: '21mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 21, heightMm: 23, costPerM: 1.90, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0003.jpg', textureMap: 'mouldings/strips/ECON_0003', faceHex: '#1e1e21' },
  { id: 'E004', code: 'ECON/0006', name: '24mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 24, heightMm: 13, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0006.jpg', textureMap: 'mouldings/strips/ECON_0006', faceHex: '#171719' },
  { id: 'E005', code: 'ECON/0002', name: '28mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 28, heightMm: 20, costPerM: 2.03, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0002.jpg', textureMap: 'mouldings/strips/ECON_0002', faceHex: '#141417' },
  { id: 'E006', code: 'ECON/0005', name: '29mm Matt Black',           colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 29, heightMm: 13, costPerM: 1.80, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0005.png', textureMap: 'mouldings/strips/ECON_0005', faceHex: '#131316' },
  { id: 'E007', code: 'ECON/0001', name: '38mm Matt Black (deep)',    colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.61, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0001.jpg', textureMap: 'mouldings/strips/ECON_0001', faceHex: '#131316' },
  { id: 'E008', code: 'ECON/0004', name: '39mm Matt Black (slim)',    colour: 'black', finish: 'Matt',       profile: 'Flat',    widthMm: 39, heightMm: 13, costPerM: 2.30, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0004.png', textureMap: 'mouldings/strips/ECON_0004', faceHex: '#131315' },

  // ── BLACK — Stained / Obeche (6) ──
  { id: 'E009', code: 'ECON/0029', name: '15mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0029.jpg', textureMap: 'mouldings/strips/ECON_0029', faceHex: '#1f2024' },
  { id: 'E010', code: 'ECON/0022', name: '20mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0022.jpg', textureMap: 'mouldings/strips/ECON_0022', faceHex: '#1e1e1e' },
  { id: 'E011', code: 'ECON/0017', name: '35mm Obeche Black',         colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 1.90, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0017.jpg', textureMap: 'mouldings/strips/ECON_0017', faceHex: '#161619' },
  { id: 'E012', code: 'ECON/0034', name: '38mm Stained Black',        colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0034.jpg', textureMap: 'mouldings/strips/ECON_0034', faceHex: '#19191a' },
  { id: 'E013', code: 'ECON/0047', name: '25mm Flat Compo Black',     colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 25, heightMm: 56, costPerM: 4.46, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0047.jpg', textureMap: 'mouldings/strips/ECON_0047', faceHex: '#131014' },
  { id: 'E014', code: 'ECON/0049', name: '14mm Flat Compo Black',     colour: 'black', finish: 'Stained',    profile: 'Flat',    widthMm: 14, heightMm: 25, costPerM: 1.80, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0049.jpg', textureMap: 'mouldings/strips/ECON_0049', faceHex: '#0d0c0c' },

  // ── BLACK — Open Grain (5) ──
  { id: 'E015', code: 'ECON/0076', name: '22mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0076.png', textureMap: 'mouldings/strips/ECON_0076', faceHex: '#120f11' },
  { id: 'E016', code: 'ECON/0073', name: '30mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 30, heightMm: 20, costPerM: 2.43, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0073.png', textureMap: 'mouldings/strips/ECON_0073', faceHex: '#302c2e' },
  { id: 'E017', code: 'ECON/0070', name: '40mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 40, heightMm: 20, costPerM: 2.89, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0070.png', textureMap: 'mouldings/strips/ECON_0070', faceHex: '#151518' },
  { id: 'E018', code: 'ECON/0067', name: '55mm Open Grain Black',     colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 55, heightMm: 20, costPerM: 4.00, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0067.png', textureMap: 'mouldings/strips/ECON_0067', faceHex: '#18191d' },
  { id: 'E019', code: 'ECON/0086', name: '22mm Smooth Black',         colour: 'black', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.84, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0086.png', textureMap: 'mouldings/strips/ECON_0086', faceHex: '#34302e' },

  // ── BLACK — Deep Rebate (1) ──
  { id: 'E020', code: 'ECON/0065', name: '20mm Deep Rebate Black',    colour: 'black', finish: 'Matt',       profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0065.jpg', textureMap: 'mouldings/strips/ECON_0065', faceHex: '#262628' },

  // ── BLACK — Cushion (7) ──
  { id: 'E021', code: '0075',      name: '½" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.18, tier: 'everyday', uiThumbnail: 'mouldings/0075.jpg', textureMap: 'mouldings/strips/0075', faceHex: '#373636' },
  { id: 'E022', code: '0080',      name: '⅜" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 9.5,  heightMm: 8,  costPerM: 1.31, tier: 'everyday', uiThumbnail: 'mouldings/0080.jpg', textureMap: 'mouldings/strips/0080', faceHex: '#464344' },
  { id: 'E023', code: '0080/B',    name: '⅜" Black Stained Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 9.5,  heightMm: 8,  costPerM: 1.97, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/0080_B.jpg', textureMap: 'mouldings/strips/0080_B', faceHex: '#444343' },
  { id: 'E024', code: '0354',      name: '¾" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 19,   heightMm: 12, costPerM: 1.80, tier: 'everyday', uiThumbnail: 'mouldings/0354.jpg', textureMap: 'mouldings/strips/0354', faceHex: '#172a34' },
  { id: 'E025', code: '0354/B',    name: '20mm Black Stain Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 20,   heightMm: 12, costPerM: 1.97, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/0354_B.jpg', textureMap: 'mouldings/strips/0354_B', faceHex: '#1c303d' },
  { id: 'E026', code: '0081',      name: '1" Black Cushion',          colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 25.4, heightMm: 14, costPerM: 3.94, tier: 'everyday', uiThumbnail: 'mouldings/0081.jpg', textureMap: 'mouldings/strips/0081', faceHex: '#15252d' },
  { id: 'E027', code: '000J/304',  name: '30mm Black Cushion',        colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 30,   heightMm: 14, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/000J_304.jpg', textureMap: 'mouldings/strips/000J_304', faceHex: '#132228' },

  // ── BLACK — Specialty (5) ──
  { id: 'E028', code: '000J/2035', name: '20mm Flat Ramin Black',     colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 20,   heightMm: 12, costPerM: 2.03, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/000J_2035.jpg', textureMap: 'mouldings/strips/000J_2035', faceHex: '#101e23' },
  { id: 'E029', code: '000J/241',  name: '20mm Matt Black Lacquer',   colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 20,   heightMm: 12, costPerM: 2.49, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/000J_241.jpg', textureMap: 'mouldings/strips/000J_241', faceHex: '#27262d' },
  { id: 'E030', code: '000J/242',  name: '13.5mm Matt Black Lacquer', colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 13.5, heightMm: 10, costPerM: 1.90, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/000J_242.jpg', textureMap: 'mouldings/strips/000J_242', faceHex: '#2b2b32' },

  // ── BLACK — Wide/Statement (3) ──
  { id: 'E033', code: '0075/B',    name: '½" Black Stain Cushion',    colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.31, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/0075_B.jpg', textureMap: 'mouldings/strips/0075_B', faceHex: '#3f404a' },
  { id: 'E034', code: '0076',      name: '½" Stained Black Cushion',  colour: 'black', finish: 'Cushion',    profile: 'Cushion', widthMm: 12.7, heightMm: 10, costPerM: 1.31, tier: 'everyday', uiThumbnail: 'mouldings/0076.jpg', textureMap: 'mouldings/strips/0076', faceHex: '#40414a' },
  { id: 'E035', code: '0349/17',   name: '56mm Black Statement',      colour: 'black', finish: 'Specialty',  profile: 'Flat',    widthMm: 56,   heightMm: 20, costPerM: 14.27, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/0349_17.jpg', textureMap: 'mouldings/strips/0349_17', faceHex: '#222225' },
  { id: 'E036', code: '000S/447/3',name: '64mm Gold/Black Outer',     colour: 'black', finish: 'Specialty',  profile: 'Reverse', widthMm: 64,   heightMm: 20, costPerM: 10.11, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/000S_447_3.jpg', textureMap: 'mouldings/strips/000S_447_3', faceHex: '#141213' },

  // ── WHITE — Matt (8) ──
  { id: 'E038', code: 'ECON/0016', name: '14mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 13, costPerM: 1.12, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0016.jpg', textureMap: 'mouldings/strips/ECON_0016', faceHex: '#f5f6fa' },
  { id: 'E039', code: 'ECON/0015', name: '19mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 19, heightMm: 13, costPerM: 1.25, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0015.jpg', textureMap: 'mouldings/strips/ECON_0015', faceHex: '#e0e3e8' },
  { id: 'E040', code: 'ECON/0011', name: '21mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 21, heightMm: 23, costPerM: 1.90, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0011.jpg', textureMap: 'mouldings/strips/ECON_0011', faceHex: '#f7f7f9' },
  { id: 'E041', code: 'ECON/0014', name: '24mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 24, heightMm: 13, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0014.jpg', textureMap: 'mouldings/strips/ECON_0014', faceHex: '#f0eff5' },
  { id: 'E042', code: 'ECON/0010', name: '28mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 28, heightMm: 20, costPerM: 2.03, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0010.jpg', textureMap: 'mouldings/strips/ECON_0010', faceHex: '#f2f2f3' },
  { id: 'E043', code: 'ECON/0013', name: '29mm Matt White',           colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 29, heightMm: 13, costPerM: 1.80, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0013.jpg', textureMap: 'mouldings/strips/ECON_0013', faceHex: '#f2f2f7' },
  { id: 'E044', code: 'ECON/0009', name: '38mm Matt White (deep)',    colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.61, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0009.jpg', textureMap: 'mouldings/strips/ECON_0009', faceHex: '#f2f2f5' },
  { id: 'E045', code: 'ECON/0012', name: '39mm Matt White (slim)',    colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 39, heightMm: 13, costPerM: 2.30, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0012.png', textureMap: 'mouldings/strips/ECON_0012', faceHex: '#f5f6fb' },

  // ── WHITE — Stained / Obeche (4) ──
  { id: 'E046', code: 'ECON/0033', name: '15mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0033.jpg', textureMap: 'mouldings/strips/ECON_0033', faceHex: '#dee1e5' },
  { id: 'E047', code: 'ECON/0024', name: '20mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0024.jpg', textureMap: 'mouldings/strips/ECON_0024', faceHex: '#dedbda' },
  { id: 'E048', code: 'ECON/0019', name: '35mm Obeche White',         colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 1.90, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0019.png', textureMap: 'mouldings/strips/ECON_0019', faceHex: '#fafcff' },
  { id: 'E049', code: 'ECON/0035', name: '38mm Stained White',        colour: 'white', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0035.jpg', textureMap: 'mouldings/strips/ECON_0035', faceHex: '#e0e0e0' },

  // ── WHITE — Open Grain (4) ──
  { id: 'E050', code: 'ECON/0077', name: '22mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0077.png', textureMap: 'mouldings/strips/ECON_0077', faceHex: '#e6ddd2' },
  { id: 'E051', code: 'ECON/0074', name: '30mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 30, heightMm: 20, costPerM: 2.43, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0074.png', textureMap: 'mouldings/strips/ECON_0074', faceHex: '#f9f8f8' },
  { id: 'E052', code: 'ECON/0071', name: '40mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 40, heightMm: 20, costPerM: 2.89, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0071.png', textureMap: 'mouldings/strips/ECON_0071', faceHex: '#f2f1f0' },
  { id: 'E053', code: 'ECON/0068', name: '55mm Open Grain White',     colour: 'white', finish: 'Open Grain', profile: 'Flat',    widthMm: 55, heightMm: 20, costPerM: 4.00, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0068.png', textureMap: 'mouldings/strips/ECON_0068', faceHex: '#f0eeed' },

  // ── WHITE — Compo & Rebate (4) ──
  { id: 'E054', code: 'ECON/0048', name: '25mm Flat Compo White',     colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 25, heightMm: 56, costPerM: 4.46, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0048.jpg', textureMap: 'mouldings/strips/ECON_0048', faceHex: '#fbfbfa' },
  { id: 'E055', code: 'ECON/0050', name: '14mm Flat Compo White',     colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 14, heightMm: 25, costPerM: 1.80, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0050.jpg', textureMap: 'mouldings/strips/ECON_0050', faceHex: '#f8f8f6' },
  { id: 'E056', code: 'ECON/0064', name: '20mm Deep Rebate White',    colour: 'white', finish: 'Matt',       profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0064.jpg', textureMap: 'mouldings/strips/ECON_0064', faceHex: '#f4f4f4' },
  { id: 'E057', code: 'ECON/0087', name: '22mm Smooth White',         colour: 'white', finish: 'Matt',       profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.84, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0087.png', textureMap: 'mouldings/strips/ECON_0087', faceHex: '#fcfafa' },

  // ── GREY — Light Grey (4) ──
  { id: 'E058', code: 'ECON/0046', name: '15mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0046.png', textureMap: 'mouldings/strips/ECON_0046', faceHex: '#58595d' },
  { id: 'E059', code: 'ECON/0045', name: '20mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0045.png', textureMap: 'mouldings/strips/ECON_0045', faceHex: '#545559' },
  { id: 'E060', code: 'ECON/0044', name: '35mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0044.png', textureMap: 'mouldings/strips/ECON_0044', faceHex: '#545559' },
  { id: 'E061', code: 'ECON/0043', name: '38mm Light Grey',           colour: 'grey', finish: 'Light Grey',  profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.67, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0043.png', textureMap: 'mouldings/strips/ECON_0043', faceHex: '#545459' },

  // ── GREY — Taupe (4) ──
  { id: 'E062', code: 'ECON/0058', name: '15mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0058.jpg', textureMap: 'mouldings/strips/ECON_0058', faceHex: '#b69a85' },
  { id: 'E063', code: 'ECON/0057', name: '20mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0057.jpg', textureMap: 'mouldings/strips/ECON_0057', faceHex: '#b29781' },
  { id: 'E064', code: 'ECON/0056', name: '35mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0056.jpg', textureMap: 'mouldings/strips/ECON_0056', faceHex: '#b0947f' },
  { id: 'E065', code: 'ECON/0055', name: '38mm Taupe',                colour: 'grey', finish: 'Taupe',       profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.35, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0055.jpg', textureMap: 'mouldings/strips/ECON_0055', faceHex: '#b0947f' },

  // ── GREY — Washed Light Grey (4) ──
  { id: 'E066', code: 'ECON/0062', name: '15mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0062.jpg', textureMap: 'mouldings/strips/ECON_0062', faceHex: '#a99f92' },
  { id: 'E067', code: 'ECON/0061', name: '20mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0061.jpg', textureMap: 'mouldings/strips/ECON_0061', faceHex: '#aaa193' },
  { id: 'E068', code: 'ECON/0060', name: '35mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0060.jpg', textureMap: 'mouldings/strips/ECON_0060', faceHex: '#aca194' },
  { id: 'E069', code: 'ECON/0059', name: '38mm Washed Grey',          colour: 'grey', finish: 'Washed Grey', profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0059.jpg', textureMap: 'mouldings/strips/ECON_0059', faceHex: '#a99c91' },

  // ── GREY — Open Grain (2) ──
  { id: 'E070', code: 'ECON/0080', name: '22mm Grey Open Grain',      colour: 'grey', finish: 'Open Grain',  profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0080.png', textureMap: 'mouldings/strips/ECON_0080', faceHex: '#8a8580' },
  { id: 'E071', code: 'ECON/0081', name: '22mm Light Grey Open Grain',colour: 'grey', finish: 'Open Grain',  profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0081.png', textureMap: 'mouldings/strips/ECON_0081', faceHex: '#969290' },

  // ── DARK WOOD — Brown / Dark Grey (12) ──
  { id: 'E072', code: 'ECON/0032', name: '15mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0032.jpg', textureMap: 'mouldings/strips/ECON_0032', faceHex: '#3e3128' },
  { id: 'E073', code: 'ECON/0023', name: '20mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 20, heightMm: 15, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0023.jpg', textureMap: 'mouldings/strips/ECON_0023', faceHex: '#422e27' },
  { id: 'E074', code: 'ECON/0018', name: '35mm Obeche Brown',         colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0018.png', textureMap: 'mouldings/strips/ECON_0018', faceHex: '#48312d' },
  { id: 'E075', code: 'ECON/0038', name: '38mm Stained Brown',        colour: 'dark-wood', finish: 'Stained', profile: 'Flat',   widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0038.jpg', textureMap: 'mouldings/strips/ECON_0038', faceHex: '#291c12' },
  { id: 'E076', code: 'ECON/0054', name: '15mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0054.jpg', textureMap: 'mouldings/strips/ECON_0054', faceHex: '#605d58' },
  { id: 'E077', code: 'ECON/0053', name: '20mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.57, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0053.jpg', textureMap: 'mouldings/strips/ECON_0053', faceHex: '#5b5954' },
  { id: 'E078', code: 'ECON/0052', name: '35mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0052.jpg', textureMap: 'mouldings/strips/ECON_0052', faceHex: '#5c5b56' },
  { id: 'E079', code: 'ECON/0051', name: '38mm Dark Grey Flat',       colour: 'dark-wood', finish: 'Dark Grey', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0051.jpg', textureMap: 'mouldings/strips/ECON_0051', faceHex: '#55534e' },
  { id: 'E080', code: 'ECON/0082', name: '22mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0082.png', textureMap: 'mouldings/strips/ECON_0082', faceHex: '#a68468' },
  { id: 'E081', code: 'ECON/0075', name: '30mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 30, heightMm: 20, costPerM: 2.43, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0075.png', textureMap: 'mouldings/strips/ECON_0075', faceHex: '#483025' },
  { id: 'E082', code: 'ECON/0072', name: '40mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 40, heightMm: 20, costPerM: 2.89, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0072.png', textureMap: 'mouldings/strips/ECON_0072', faceHex: '#792d12' },
  { id: 'E083', code: 'ECON/0069', name: '55mm Brown Open Grain',     colour: 'dark-wood', finish: 'Open Grain', profile: 'Flat', widthMm: 55, heightMm: 20, costPerM: 4.00, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0069.png', textureMap: 'mouldings/strips/ECON_0069', faceHex: '#824429' },

  // ── NATURAL WOOD — Oak (11) ──
  { id: 'E084', code: 'ECON/0031', name: '15mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0031.jpg', textureMap: 'mouldings/strips/ECON_0031', faceHex: '#bf915c' },
  { id: 'E085', code: 'ECON/0030', name: '15mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0030.jpg', textureMap: 'mouldings/strips/ECON_0030', faceHex: '#9d5228' },
  { id: 'E086', code: 'ECON/0025', name: '20mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0025.jpg', textureMap: 'mouldings/strips/ECON_0025', faceHex: '#be8b52' },
  { id: 'E087', code: 'ECON/0026', name: '20mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 20, heightMm: 15, costPerM: 1.51, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0026.jpg', textureMap: 'mouldings/strips/ECON_0026', faceHex: '#975229' },
  { id: 'E088', code: 'ECON/0020', name: '35mm Light Oak',            colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0020.png', textureMap: 'mouldings/strips/ECON_0020', faceHex: '#d6a464' },
  { id: 'E089', code: 'ECON/0021', name: '35mm Medium Oak',           colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0021.jpg', textureMap: 'mouldings/strips/ECON_0021', faceHex: '#b66221' },
  { id: 'E090', code: 'ECON/0037', name: '38mm Stained Light Oak',    colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0037.jpg', textureMap: 'mouldings/strips/ECON_0037', faceHex: '#bd9057' },
  { id: 'E091', code: 'ECON/0036', name: '38mm Stained Medium Oak',   colour: 'natural-wood', finish: 'Medium Oak', profile: 'Flat', widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0036.jpg', textureMap: 'mouldings/strips/ECON_0036', faceHex: '#a66535' },
  { id: 'E092', code: 'ECON/0066', name: '20mm Oak Deep Rebate',      colour: 'natural-wood', finish: 'Light Oak', profile: 'Deep Rebate', widthMm: 20, heightMm: 33, costPerM: 2.30, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0066.png', textureMap: 'mouldings/strips/ECON_0066', faceHex: '#dac5a8' },
  { id: 'E093', code: 'ECON/0078', name: '22mm Oak Open Grain',       colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0078.png', textureMap: 'mouldings/strips/ECON_0078', faceHex: '#d39958' },
  { id: 'E094', code: 'ECON/0079', name: '22mm Light Oak Open Grain', colour: 'natural-wood', finish: 'Light Oak', profile: 'Flat', widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0079.png', textureMap: 'mouldings/strips/ECON_0079', faceHex: '#d5a364' },

  // ── CREAM (4) ──
  { id: 'E095', code: 'ECON/0042', name: '15mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 15, heightMm: 13, costPerM: 1.15, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0042.png', textureMap: 'mouldings/strips/ECON_0042', faceHex: '#cabca4' },
  { id: 'E096', code: 'ECON/0041', name: '20mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 20, heightMm: 15, costPerM: 1.57, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0041.png', textureMap: 'mouldings/strips/ECON_0041', faceHex: '#c4b69e' },
  { id: 'E097', code: 'ECON/0040', name: '35mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0040.png', textureMap: 'mouldings/strips/ECON_0040', faceHex: '#cdbfa2' },
  { id: 'E098', code: 'ECON/0039', name: '38mm Stained Cream',        colour: 'cream', finish: 'Stained',    profile: 'Flat',    widthMm: 38, heightMm: 30, costPerM: 3.81, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0039.png', textureMap: 'mouldings/strips/ECON_0039', faceHex: '#d4c5a8' },

  // ── COLOUR (4) ──
  { id: 'E099', code: 'ECON/0063', name: '35mm Green Painted',        colour: 'colour', finish: 'Painted',   profile: 'Flat',    widthMm: 35, heightMm: 15, costPerM: 2.13, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0063.png', textureMap: 'mouldings/strips/ECON_0063', faceHex: '#454b27' },
  { id: 'E100', code: 'ECON/0083', name: '22mm Blue Open Grain',      colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0083.png', textureMap: 'mouldings/strips/ECON_0083', faceHex: '#324668' },
  { id: 'E101', code: 'ECON/0084', name: '22mm Red Open Grain',       colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0084.png', textureMap: 'mouldings/strips/ECON_0084', faceHex: '#ce6f5e' },
  { id: 'E102', code: 'ECON/0085', name: '22mm Green Open Grain',     colour: 'colour', finish: 'Open Grain',profile: 'Flat',    widthMm: 22, heightMm: 22, costPerM: 1.71, hasPhoto: true, tier: 'everyday', uiThumbnail: 'mouldings/ECON_0085.png', textureMap: 'mouldings/strips/ECON_0085', faceHex: '#567563' },

  // ── OTHER (1) ──
  { id: 'E103', code: 'M0093',     name: '¾" Flat Picture Moulding',  colour: 'natural-wood', finish: 'Raw', profile: 'Flat',    widthMm: 19, heightMm: 16, costPerM: 1.64, tier: 'everyday', uiThumbnail: 'mouldings/M0093.jpg', textureMap: 'mouldings/strips/M0093', faceHex: '#d5b693' },


  // ═══════════════════════════════════════════════════════════════════════════
  // PREMIUM & SPECIALTY COLLECTION — Existing 54 frames (de-duplicated)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Classic Wood (8) ──
  { id: 'P001', code: '000J/0082', name: 'Light Oak Flat',            colour: 'natural-wood', finish: 'Stained', profile: 'Flat',   widthMm: 20, heightMm: 12, costPerM: 1.44, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000J_0082.png', textureMap: 'mouldings/strips/000J_0082', faceHex: '#f7cfa1'},
  { id: 'P002', code: '000J/0095', name: 'Medium Oak',                colour: 'natural-wood', finish: 'Stained', profile: 'Flat',   widthMm: 35, heightMm: 14, costPerM: 4.20, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000J_0095.jpg', textureMap: 'mouldings/strips/000J_0095', faceHex: '#c5a279'},
  { id: 'P004', code: '0001/T',    name: 'Two Tone Oak Gold',         colour: 'natural-wood', finish: 'Stained', profile: 'Raised', widthMm: 29, heightMm: 14, costPerM: 2.95, tier: 'premium' , uiThumbnail: 'mouldings/0001_T.jpg', textureMap: 'mouldings/strips/0001_T', faceHex: '#815f43'},
  { id: 'P005', code: '000S/926',  name: 'Reverse Silver Leaf',        colour: 'silver', finish: 'Leaf',          profile: 'Scoop',  widthMm: 64, heightMm: 20, costPerM: 7.00, tier: 'premium', uiThumbnail: 'mouldings/000S_926.jpg', textureMap: 'mouldings/strips/000S_926', faceHex: '#b2ae8b' },
  { id: 'P006', code: '444343000', name: 'Curl Walnut Veneer',        colour: 'dark-wood', finish: 'Veneer',     profile: 'Flat',   widthMm: 30, heightMm: 14, costPerM: 4.92, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/444343000.jpg', textureMap: 'mouldings/strips/444343000', faceHex: '#9fb9c0'},
  { id: 'P007', code: '000J/13',   name: 'Plain Pine Slim',           colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 15, heightMm: 10, costPerM: 1.41, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000J_13.png', textureMap: 'mouldings/strips/000J_13', faceHex: '#f7cfa1'},
  { id: 'P008', code: 'DAN/21',    name: 'Rough Hewn Pine',           colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 33, heightMm: 16, costPerM: 1.74, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DAN_21.jpg', textureMap: 'mouldings/strips/DAN_21', faceHex: '#b68b57'},

  // ── Modern Flat (6 — deduplicated: 000J/241, 000J/242 already in everyday) ──
  { id: 'P009', code: '000J/0086', name: 'Flat Ebony',                colour: 'black', finish: 'Stained',        profile: 'Flat',   widthMm: 20, heightMm: 12, costPerM: 1.44, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000J_0086.png', textureMap: 'mouldings/strips/000J_0086', faceHex: '#1c1815'},
  { id: 'P010', code: 'COSM/0027', name: 'Black Gloss Flat',          colour: 'black', finish: 'Gloss',          profile: 'Flat',   widthMm: 21, heightMm: 12, costPerM: 2.43, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/COSM_0027.jpg', textureMap: 'mouldings/strips/COSM_0027', faceHex: '#1a1a1e'},
  { id: 'P011', code: 'LUNA/0002', name: 'White Deep Rebate',         colour: 'white', finish: 'Painted',        profile: 'Flat',   widthMm: 13, heightMm: 22, costPerM: 3.28, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/LUNA_0002.jpg', textureMap: 'mouldings/strips/LUNA_0002', faceHex: '#f2efe8'},
  { id: 'P012', code: 'LUNA/0005', name: 'Dark Grey Flat',            colour: 'grey',  finish: 'Painted',        profile: 'Flat',   widthMm: 13, heightMm: 14, costPerM: 1.71, tier: 'premium', uiThumbnail: 'mouldings/LUNA_0005.jpg', textureMap: 'mouldings/strips/LUNA_0005', faceHex: '#a88e7a' },
  { id: 'P013', code: 'WRAP/19',   name: 'Beech Angled Edge',         colour: 'natural-wood', finish: 'Lacquer', profile: 'Flat',   widthMm: 35, heightMm: 14, costPerM: 1.77, tier: 'premium', uiThumbnail: 'mouldings/WRAP_19.jpg', textureMap: 'mouldings/strips/WRAP_19', faceHex: '#d5b788' },
  { id: 'P015', code: '000J/10',   name: 'Raw Pine Wide',             colour: 'natural-wood', finish: 'Raw',     profile: 'Flat',   widthMm: 44, heightMm: 16, costPerM: 1.74, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000J_10.png', textureMap: 'mouldings/strips/000J_10', faceHex: '#b3b2ae'},

  // ── Ornate & Swept (7) ──
  { id: 'P016', code: 'DECO/0003', name: 'Ornate Gold Embossed',      colour: 'gold',   finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DECO_0003.jpg', textureMap: 'mouldings/strips/DECO_0003', faceHex: '#d9af5e'},
  { id: 'P017', code: 'DECO/0001', name: 'Ornate White Embossed',     colour: 'white',  finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DECO_0001.jpg', textureMap: 'mouldings/strips/DECO_0001', faceHex: '#e8ddd0'},
  { id: 'P018', code: 'DECO/0004', name: 'Ornate Silver Embossed',    colour: 'silver', finish: 'Gilt',      profile: 'Ornate', widthMm: 62, heightMm: 22, costPerM: 13.06, tier: 'premium' , uiThumbnail: 'mouldings/DECO_0004.jpg', textureMap: 'mouldings/strips/DECO_0004', faceHex: '#83796d'},
  { id: 'P019', code: '000K/0678', name: 'Grand Gold Ornate',         colour: 'gold',   finish: 'Gilt',      profile: 'Ornate', widthMm: 72, heightMm: 28, costPerM: 18.37, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000K_0678.jpg', textureMap: 'mouldings/strips/000K_0678', faceHex: '#e6cc85'},
  { id: 'P020', code: 'ROYAL/0001',name: 'Royal Gold Scoop',          colour: 'gold',   finish: 'Embossed',  profile: 'Scoop',  widthMm: 65, heightMm: 24, costPerM: 14.76, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/ROYAL_0001.png', textureMap: 'mouldings/strips/ROYAL_0001', faceHex: '#9a7a3e'},
  { id: 'P021', code: 'ROYAL/0002',name: 'Royal Silver Scoop',        colour: 'silver', finish: 'Embossed',  profile: 'Scoop',  widthMm: 65, heightMm: 24, costPerM: 14.76, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/ROYAL_0002.jpg', textureMap: 'mouldings/strips/ROYAL_0002', faceHex: '#bbd0cf'},
  { id: 'P022', code: 'GENO/0002', name: 'Silver with Silver Lip',    colour: 'silver', finish: 'Embossed',  profile: 'Raised', widthMm: 26, heightMm: 14, costPerM: 5.41,  tier: 'premium', uiThumbnail: 'mouldings/GENO_0002.jpg', textureMap: 'mouldings/strips/GENO_0002', faceHex: '#d8c4ae' },

  // ── Gold & Silver (8) ──
  { id: 'P023', code: '5404/6008', name: 'Flat Gold',                 colour: 'gold',   finish: 'Gilt',      profile: 'Flat',   widthMm: 23, heightMm: 12, costPerM: 2.95, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/5404_6008.png', textureMap: 'mouldings/strips/5404_6008', faceHex: '#e5bb8e'},
  { id: 'P024', code: '5401/7018', name: 'Brushed Silver Ovaloe',     colour: 'silver', finish: 'Brushed',   profile: 'Ovaloe', widthMm: 25, heightMm: 14, costPerM: 6.23, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/5401_7018.jpg', textureMap: 'mouldings/strips/5401_7018', faceHex: '#9eb8bf'},
  { id: 'P025', code: '5401/6018', name: 'Brushed Gold Ovaloe',       colour: 'gold',   finish: 'Brushed',   profile: 'Ovaloe', widthMm: 50, heightMm: 18, costPerM: 9.02, tier: 'premium', uiThumbnail: 'mouldings/5401_6018.jpg', textureMap: 'mouldings/strips/5401_6018', faceHex: '#efd087' },
  { id: 'P026', code: 'ROYAL/0018',name: 'Silver Leaf',               colour: 'silver', finish: 'Leaf',      profile: 'L-Shape',widthMm: 38, heightMm: 20, costPerM: 6.89, tier: 'premium', uiThumbnail: 'mouldings/ROYAL_0018.png', textureMap: 'mouldings/strips/ROYAL_0018', faceHex: '#cfb397' },
  { id: 'P027', code: '000S/21',   name: 'Antique Wood Gold Line',    colour: 'gold',   finish: 'Leaf',      profile: 'L-Shape',widthMm: 38, heightMm: 20, costPerM: 7.87, tier: 'premium', uiThumbnail: 'mouldings/000S_21.jpg', textureMap: 'mouldings/strips/000S_21', faceHex: '#8b7340' },
  { id: 'P028', code: '5403/7018', name: 'Brushed Silver Ovaloe',     colour: 'silver', finish: 'Brushed',   profile: 'Ovaloe', widthMm: 66, heightMm: 22, costPerM: 7.38, tier: 'premium', uiThumbnail: 'mouldings/5403_7018.jpg', textureMap: 'mouldings/strips/5403_7018', faceHex: '#bab795' },
  { id: 'P029', code: '0135/0001', name: 'Scratched Gold Raised',     colour: 'gold',   finish: 'Antiqued',  profile: 'Raised', widthMm: 35, heightMm: 16, costPerM: 6.56, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/0135_0001.png', textureMap: 'mouldings/strips/0135_0001', faceHex: '#7a6545'},
  { id: 'P030', code: '0135/0002', name: 'Scratched Silver Raised',   colour: 'silver', finish: 'Antiqued',  profile: 'Raised', widthMm: 35, heightMm: 16, costPerM: 6.56, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/0135_0002.png', textureMap: 'mouldings/strips/0135_0002', faceHex: '#7a7575'},

  // ── Distressed & Rustic (7) ──
  { id: 'P031', code: '0321/1265', name: 'Gold Distressed Red',       colour: 'gold',   finish: 'Distressed',profile: 'Panel',  widthMm: 22, heightMm: 14, costPerM: 6.23, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/0321_1265.png', textureMap: 'mouldings/strips/0321_1265', faceHex: '#e5bb8e'},
  { id: 'P032', code: '0321/1268', name: 'Silver Blue Distressed',    colour: 'silver', finish: 'Distressed',profile: 'Panel',  widthMm: 22, heightMm: 14, costPerM: 6.23, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/0321_1268.jpg', textureMap: 'mouldings/strips/0321_1268', faceHex: '#b7855f'},
  { id: 'P033', code: 'DAVINCI/0005',name:'Dove Scoop Distressed',    colour: 'grey',   finish: 'Distressed',profile: 'Scoop',  widthMm: 30, heightMm: 16, costPerM: 5.74, tier: 'premium' , uiThumbnail: 'mouldings/DAVINCI_0005.jpg', textureMap: 'mouldings/strips/DAVINCI_0005', faceHex: '#d3af7f'},
  { id: 'P034', code: '860A/2/S',  name: 'Silver Distressed Leaf',    colour: 'silver', finish: 'Distressed',profile: 'Spoon',  widthMm: 22, heightMm: 12, costPerM: 5.09, tier: 'premium', uiThumbnail: 'mouldings/860A_2_S.jpg', textureMap: 'mouldings/strips/860A_2_S', faceHex: '#88817c' },
  { id: 'P035', code: '860A/3/S',  name: 'Distressed Silver Leaf',    colour: 'silver', finish: 'Distressed',profile: 'Spoon',  widthMm: 22, heightMm: 12, costPerM: 5.09, tier: 'premium', uiThumbnail: 'mouldings/860A_3_S.jpg', textureMap: 'mouldings/strips/860A_3_S', faceHex: '#ada293' },
  { id: 'P036', code: 'PALE/0002', name: 'Silver Box Distressed',     colour: 'silver', finish: 'Distressed',profile: 'Flat',   widthMm: 50, heightMm: 22, costPerM: 9.19, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/PALE_0002.png', textureMap: 'mouldings/strips/PALE_0002', faceHex: '#9a9590'},
  { id: 'P037', code: 'YORK/0005', name: 'Black Wash Scoop',          colour: 'black',  finish: 'Wash',      profile: 'Scoop',  widthMm: 26, heightMm: 14, costPerM: 2.82, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/YORK_0005.jpg', textureMap: 'mouldings/strips/YORK_0005', faceHex: '#101e23'},

  // ── Painted & Colour (7) ──
  { id: 'P038', code: 'DISP/0003', name: 'Painted White Wide',        colour: 'white',  finish: 'Painted',   profile: 'Flat',   widthMm: 82, heightMm: 22, costPerM: 6.23, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DISP_0003.jpg', textureMap: 'mouldings/strips/DISP_0003', faceHex: '#f0ede5'},
  { id: 'P039', code: 'DISP/0002', name: 'Painted Black Wide',        colour: 'black',  finish: 'Painted',   profile: 'Flat',   widthMm: 82, heightMm: 22, costPerM: 6.23, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DISP_0002.jpg', textureMap: 'mouldings/strips/DISP_0002', faceHex: '#1c1c20'},
  { id: 'P040', code: '2935/3303', name: 'Sloped Green',              colour: 'colour', finish: 'Painted',   profile: 'Sloped', widthMm: 16, heightMm: 10, costPerM: 4.99, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/2935_3303.jpg', textureMap: 'mouldings/strips/2935_3303', faceHex: '#5a7a50'},
  { id: 'P041', code: '2935/3301', name: 'Sloped Charcoal',           colour: 'grey',   finish: 'Painted',   profile: 'Sloped', widthMm: 16, heightMm: 10, costPerM: 4.99, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/2935_3301.jpg', textureMap: 'mouldings/strips/2935_3301', faceHex: '#4a4a4e'},
  { id: 'P042', code: 'BRISTOL/09',name: 'Brushed Gold',              colour: 'gold',   finish: 'Brushed',   profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, tier: 'premium', uiThumbnail: 'mouldings/BRISTOL_09.jpg', textureMap: 'mouldings/strips/BRISTOL_09', faceHex: '#d8bba1' },
  { id: 'P043', code: 'COSM/0025', name: 'Grey Gloss Chamford',       colour: 'grey',   finish: 'Gloss',     profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/COSM_0025.jpg', textureMap: 'mouldings/strips/COSM_0025', faceHex: '#9eb8bf'},
  { id: 'P044', code: 'BRISTOL/0007',name:'Brushed Gold',             colour: 'gold',   finish: 'Brushed',   profile: 'Chamford',widthMm:30, heightMm: 14, costPerM: 3.28, tier: 'premium', uiThumbnail: 'mouldings/BRISTOL_0007.png', textureMap: 'mouldings/strips/BRISTOL_0007', faceHex: '#9c835f' },

  // ── Cushion & Scoop (5 — deduplicated: 000J/304 already in everyday) ──
  { id: 'P045', code: 'GRAF/0002', name: 'Pewter Graphite Ovaloe',    colour: 'grey',   finish: 'Brushed',   profile: 'Ovaloe', widthMm: 13, heightMm: 10, costPerM: 2.17, tier: 'premium', uiThumbnail: 'mouldings/GRAF_0002.jpg', textureMap: 'mouldings/strips/GRAF_0002', faceHex: '#4e6561' },
  { id: 'P047', code: 'CAPR/0010', name: 'Silver Scoop',              colour: 'silver', finish: 'Leaf',      profile: 'Scoop',  widthMm: 80, heightMm: 24, costPerM: 11.32, tier: 'premium', uiThumbnail: 'mouldings/CAPR_0010.png', textureMap: 'mouldings/strips/CAPR_0010', faceHex: '#c3ac9b' },
  { id: 'P048', code: '000K/0758', name: 'Natural Obeche Scoop',      colour: 'natural-wood', finish: 'Raw', profile: 'Scoop',  widthMm: 48, heightMm: 18, costPerM: 4.59, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000K_0758.png', textureMap: 'mouldings/strips/000K_0758', faceHex: '#a35623'},
  { id: 'P049', code: 'YORK/0001', name: 'Light Brown Wash Scoop',    colour: 'dark-wood', finish: 'Wash',   profile: 'Scoop',  widthMm: 26, heightMm: 14, costPerM: 2.82, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/YORK_0001.png', textureMap: 'mouldings/strips/YORK_0001', faceHex: '#f7cfa1'},

  // ── Box & Tray (5 — deduplicated: 000K/0477 vs 0477B, kept one) ──
  { id: 'P050', code: '000K/0477', name: 'Black Box Frame',           colour: 'black',  finish: 'Painted',   profile: 'Box',    widthMm: 30, heightMm: 30, costPerM: 4.10, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/000K_0477.jpg', textureMap: 'mouldings/strips/000K_0477', faceHex: '#1e1e22'},
  { id: 'P051', code: 'DISP/0001', name: 'Unfinished Pine Box',       colour: 'natural-wood', finish: 'Raw', profile: 'Box',    widthMm: 45, heightMm: 30, costPerM: 1.74, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/DISP_0001.png', textureMap: 'mouldings/strips/DISP_0001', faceHex: '#b3b2ae'},
  { id: 'P052', code: 'LUNA/0001', name: 'Black Deep Rebate',         colour: 'black',  finish: 'Painted',   profile: 'Deep Rebate', widthMm: 13, heightMm: 22, costPerM: 3.28, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/LUNA_0001.jpg', textureMap: 'mouldings/strips/LUNA_0001', faceHex: '#1e1a18'},

  // ── Canvas & Floater (4) ──
  { id: 'P055', code: 'REMB/0009', name: 'Black Stain Floater',       colour: 'black',  finish: 'Stained',   profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 11.32, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/REMB_0009.png', textureMap: 'mouldings/strips/REMB_0009', faceHex: '#3a2a1e'},
  { id: 'P057', code: 'REMB/0013', name: 'White Gloss Floater',       colour: 'white',  finish: 'Gloss',     profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 14.44, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/REMB_0013.jpg', textureMap: 'mouldings/strips/REMB_0013', faceHex: '#d7caa4'},
  { id: 'P058', code: 'REMB/0014', name: 'Natural Floater',           colour: 'natural-wood', finish: 'Raw', profile: 'Floater',widthMm: 84, heightMm: 35, costPerM: 9.84, hasPhoto: true, tier: 'premium' , uiThumbnail: 'mouldings/REMB_0014.png', textureMap: 'mouldings/strips/REMB_0014', faceHex: '#e5bb8e'},
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

export function calcFramePrice(frame, w_cm, h_cm, mountTypeId = 'none', mountWidthMm = 50) {
  // Frame moulding goes around the full assembly — artwork + mount borders
  let frameW = w_cm, frameH = h_cm;
  if (mountTypeId !== 'none') {
    const borderCm = mountWidthMm / 10;
    frameW = w_cm + 2 * borderCm;
    frameH = h_cm + 2 * borderCm;
  }
  const perimM = ((frameW + frameH) * 2) / 100;
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

export function calcGlassPrice(glassId, w_cm, h_cm, mountTypeId = 'none', mountWidthMm = 50) {
  const glass = GLASS_OPTIONS.find(g => g.id === glassId);
  if (!glass || glass.ratePerSqFt === 0) return 0;
  // Glass covers the full frame opening — artwork + mount borders when present
  let glassW = w_cm, glassH = h_cm;
  if (mountTypeId !== 'none') {
    const borderCm = mountWidthMm / 10;
    glassW = w_cm + 2 * borderCm;
    glassH = h_cm + 2 * borderCm;
  }
  const areaSqFt = (glassW * glassH) / SQCM_PER_SQFT;
  return areaSqFt * glass.ratePerSqFt;
}

export function calcTotal(selections) {
  const { printType, sizeId, frame, mountTypeId, mountWidthMm = 50, glassId } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  if (!size || !frame) return null;

  const printPrice   = calcPrintPrice(printType, sizeId) || 0;
  const framePrice   = calcFramePrice(frame, size.w_cm, size.h_cm, mountTypeId, mountWidthMm);
  const mountPrice   = calcMountPrice(mountTypeId, size.w_cm, size.h_cm, mountWidthMm);
  const glassPrice   = calcGlassPrice(glassId, size.w_cm, size.h_cm, mountTypeId, mountWidthMm);
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
