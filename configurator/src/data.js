// Mock data for the configurator

export const FRAME_PROFILES = [
  { id: 'pop-art', name: 'Pop Art 3mm', width: 3, price: 0, image: 'images/profiles/pop-art.png' },
  { id: 'classic', name: 'Classic 20mm', width: 20, price: 15, image: 'images/profiles/classic.png' },
  { id: 'slim', name: 'Slim 10mm', width: 10, price: 8, image: 'images/profiles/slim.png' },
  { id: 'gallery', name: 'Gallery 15mm', width: 15, price: 12, image: 'images/profiles/gallery.png' },
];

export const FRAME_COLOURS = [
  { id: 'neon-red', name: 'Neon Red', hex: '#E3001B' },
  { id: 'classic-black', name: 'Classic Black', hex: '#1A1A1A' },
  { id: 'natural-white', name: 'Natural White', hex: '#F5F5F0' },
  { id: 'walnut-brown', name: 'Walnut Brown', hex: '#6B3A2A' },
  { id: 'midnight-blue', name: 'Midnight Blue', hex: '#1C2B4A' },
];

/* ─── DJ Simmons Frame Catalogue — 70 mouldings, 10 categories ─── */
export const FRAME_CATEGORIES = [
  { id: 'classic-wood',       name: 'Classic Wood',       image: 'images/frames/classic-wood.png',       count: 8 },
  { id: 'modern-flat',        name: 'Modern Flat',        image: 'images/frames/modern-flat.png',        count: 10 },
  { id: 'ornate-swept',       name: 'Ornate & Swept',     image: 'images/frames/ornate-swept.png',       count: 7 },
  { id: 'gold-silver',        name: 'Gold & Silver',      image: 'images/frames/gold-silver.png',        count: 8 },
  { id: 'distressed-rustic',  name: 'Distressed & Rustic',image: 'images/frames/distressed-rustic.png',  count: 7 },
  { id: 'painted-colour',     name: 'Painted & Colour',   image: 'images/frames/painted-colour.png',     count: 7 },
  { id: 'cushion-scoop',      name: 'Cushion & Scoop',    image: 'images/frames/cushion-scoop.png',      count: 7 },
  { id: 'box-tray',           name: 'Box & Tray',         image: 'images/frames/box-tray.png',           count: 5 },
  { id: 'canvas-floater',     name: 'Canvas & Floater',   image: 'images/frames/canvas-floater.png',     count: 4 },
  { id: 'slips-fillets',      name: 'Slips & Fillets',    image: 'images/frames/slips-fillets.png',      count: 7 },
];

export const FRAME_CATALOGUE = [
  // Classic Wood (8)
  { id: 1,  code:'000J/0082', name:'Light Oak Flat',          category:'classic-wood',      colour:'Brown',   hex:'#C4A265', finish:'Stain',      profile:'Flat',    widthMm:20,  depthMm:12, retailPerM:4.32 },
  { id: 2,  code:'000J/0095', name:'Medium Oak',              category:'classic-wood',      colour:'Brown',   hex:'#A0804A', finish:'Stain',      profile:'Flat',    widthMm:35,  depthMm:14, retailPerM:12.60 },
  { id: 3,  code:'000J/0097', name:'Dark Walnut',             category:'classic-wood',      colour:'Brown',   hex:'#5C3D2E', finish:'Stain',      profile:'Flat',    widthMm:35,  depthMm:14, retailPerM:12.60 },
  { id: 4,  code:'0001/T',    name:'Two Tone Oak Gold',       category:'classic-wood',      colour:'Brown',   hex:'#8B7340', finish:'Stain',      profile:'Raised',  widthMm:29,  depthMm:14, retailPerM:8.85 },
  { id: 5,  code:'000K/0890', name:'Cherry Scoop',            category:'classic-wood',      colour:'Brown',   hex:'#7B3B2D', finish:'Polish',     profile:'Flat',    widthMm:64,  depthMm:20, retailPerM:21.00 },
  { id: 6,  code:'444343000', name:'Curl Walnut Veneer',      category:'classic-wood',      colour:'Brown',   hex:'#6B4226', finish:'Veneer',     profile:'Flat',    widthMm:30,  depthMm:14, retailPerM:14.76 },
  { id: 7,  code:'000J/13',   name:'Plain Pine Slim',         category:'classic-wood',      colour:'Natural', hex:'#D4B882', finish:'Raw',        profile:'Flat',    widthMm:15,  depthMm:10, retailPerM:4.23 },
  { id: 8,  code:'DAN/21',    name:'Rough Hewn Pine',         category:'classic-wood',      colour:'Natural', hex:'#C8A96E', finish:'Raw',        profile:'Flat',    widthMm:33,  depthMm:16, retailPerM:5.22 },
  // Modern Flat (10)
  { id: 9,  code:'000J/0086', name:'Flat Ebony',              category:'modern-flat',       colour:'Black',   hex:'#1A1A1A', finish:'Stain',      profile:'Flat',    widthMm:20,  depthMm:12, retailPerM:4.32 },
  { id: 10, code:'000J/241',  name:'Matt Black Lacquer',      category:'modern-flat',       colour:'Black',   hex:'#222222', finish:'Lacquer',    profile:'Flat',    widthMm:20,  depthMm:12, retailPerM:7.47 },
  { id: 11, code:'000J/242',  name:'Slim Matt Black',         category:'modern-flat',       colour:'Black',   hex:'#1C1C1C', finish:'Lacquer',    profile:'Flat',    widthMm:14,  depthMm:10, retailPerM:5.70 },
  { id: 12, code:'COSM/0027', name:'Black Gloss Flat',        category:'modern-flat',       colour:'Black',   hex:'#0D0D0D', finish:'Gloss',      profile:'Flat',    widthMm:21,  depthMm:12, retailPerM:7.29 },
  { id: 13, code:'LUNA/0002', name:'White Deep Rebate',       category:'modern-flat',       colour:'White',   hex:'#F5F5F0', finish:'Paint',      profile:'Flat',    widthMm:13,  depthMm:22, retailPerM:9.84 },
  { id: 14, code:'LUNA/0006', name:'Dark Grey Flat',          category:'modern-flat',       colour:'Grey',    hex:'#4A4A4A', finish:'Paint',      profile:'Flat',    widthMm:13,  depthMm:14, retailPerM:5.13 },
  { id: 15, code:'000K/0477', name:'Wide Black Box',          category:'modern-flat',       colour:'Black',   hex:'#181818', finish:'Paint',      profile:'Flat',    widthMm:30,  depthMm:30, retailPerM:12.30 },
  { id: 16, code:'WRAP/20',   name:'Beech Angled Edge',       category:'modern-flat',       colour:'Natural', hex:'#C8B078', finish:'Lacquer',    profile:'Flat',    widthMm:35,  depthMm:14, retailPerM:5.31 },
  { id: 17, code:'000J/1064', name:'Wide Flat Rounded',       category:'modern-flat',       colour:'Natural', hex:'#BFA870', finish:'Raw',        profile:'Flat',    widthMm:64,  depthMm:16, retailPerM:10.05 },
  { id: 18, code:'000J/10',   name:'Raw Pine Wide',           category:'modern-flat',       colour:'Natural', hex:'#D2B97A', finish:'Raw',        profile:'Flat',    widthMm:44,  depthMm:16, retailPerM:5.22 },
  // Ornate & Swept (7)
  { id: 19, code:'DECO/0003', name:'Ornate Gold Embossed',    category:'ornate-swept',      colour:'Gold',    hex:'#C5A240', finish:'Gilt',       profile:'Ornate',  widthMm:62,  depthMm:22, retailPerM:39.18 },
  { id: 20, code:'DECO/0001', name:'Ornate White Embossed',   category:'ornate-swept',      colour:'White',   hex:'#EDE8DE', finish:'Paint',      profile:'Ornate',  widthMm:62,  depthMm:22, retailPerM:39.18 },
  { id: 21, code:'DECO/0004', name:'Ornate Silver Embossed',  category:'ornate-swept',      colour:'Silver',  hex:'#B0B0B0', finish:'Gilt',       profile:'Ornate',  widthMm:62,  depthMm:22, retailPerM:39.18 },
  { id: 22, code:'000K/0678', name:'Grand Gold Ornate',       category:'ornate-swept',      colour:'Gold',    hex:'#D4A840', finish:'Gilt',       profile:'Ornate',  widthMm:72,  depthMm:28, retailPerM:55.11 },
  { id: 23, code:'ROYAL/0001',name:'Royal Gold Scoop',        category:'ornate-swept',      colour:'Gold',    hex:'#BF9B30', finish:'Embossed',   profile:'Scoop',   widthMm:65,  depthMm:24, retailPerM:44.28 },
  { id: 24, code:'ROYAL/0002',name:'Royal Silver Scoop',      category:'ornate-swept',      colour:'Silver',  hex:'#A8A8A8', finish:'Embossed',   profile:'Scoop',   widthMm:65,  depthMm:24, retailPerM:44.28 },
  { id: 25, code:'LOUI/0001', name:'Gold Embossed Lip',       category:'ornate-swept',      colour:'Gold',    hex:'#C9A84C', finish:'Embossed',   profile:'Raised',  widthMm:26,  depthMm:14, retailPerM:16.23 },
  // Gold & Silver (8)
  { id: 26, code:'5404/6008', name:'Flat Gold',               category:'gold-silver',       colour:'Gold',    hex:'#C8A84E', finish:'Gilt',       profile:'Flat',    widthMm:23,  depthMm:12, retailPerM:8.85 },
  { id: 27, code:'5401/7018', name:'Brushed Silver Ovaloe',   category:'gold-silver',       colour:'Silver',  hex:'#9A9A9A', finish:'Brushed',    profile:'Ovaloe',  widthMm:25,  depthMm:14, retailPerM:18.69 },
  { id: 28, code:'5403/6018', name:'Brushed Gold Ovaloe',     category:'gold-silver',       colour:'Gold',    hex:'#B89838', finish:'Brushed',    profile:'Ovaloe',  widthMm:50,  depthMm:18, retailPerM:27.06 },
  { id: 29, code:'000K/0843', name:'Silver L-Shape',          category:'gold-silver',       colour:'Silver',  hex:'#B8B8B8', finish:'Leaf',       profile:'L-Shape', widthMm:38,  depthMm:20, retailPerM:20.67 },
  { id: 30, code:'000K/0844', name:'Gold L-Shape',            category:'gold-silver',       colour:'Gold',    hex:'#C4A44A', finish:'Leaf',       profile:'L-Shape', widthMm:38,  depthMm:20, retailPerM:23.61 },
  { id: 31, code:'DAB/4',     name:'Silver Leaf Ovaloe',      category:'gold-silver',       colour:'Silver',  hex:'#A0A0A0', finish:'Leaf',       profile:'Ovaloe',  widthMm:66,  depthMm:22, retailPerM:22.14 },
  { id: 32, code:'0135/0001', name:'Scratched Gold Raised',   category:'gold-silver',       colour:'Gold',    hex:'#B89040', finish:'Antiqued',   profile:'Raised',  widthMm:35,  depthMm:16, retailPerM:19.68 },
  { id: 33, code:'0135/0002', name:'Scratched Silver Raised', category:'gold-silver',       colour:'Silver',  hex:'#8C8C8C', finish:'Antiqued',   profile:'Raised',  widthMm:35,  depthMm:16, retailPerM:19.68 },
  // Distressed & Rustic (7)
  { id: 34, code:'0321/1265', name:'Gold Distressed Red',     category:'distressed-rustic', colour:'Gold',    hex:'#A0783C', finish:'Distressed', profile:'Panel',   widthMm:22,  depthMm:14, retailPerM:18.69 },
  { id: 35, code:'0321/1268', name:'Silver Blue Distressed',  category:'distressed-rustic', colour:'Silver',  hex:'#8890A0', finish:'Distressed', profile:'Panel',   widthMm:22,  depthMm:14, retailPerM:18.69 },
  { id: 36, code:'DAVINCI/0005',name:'Dove Scoop Distressed', category:'distressed-rustic', colour:'Grey',    hex:'#9A9690', finish:'Distressed', profile:'Scoop',   widthMm:30,  depthMm:16, retailPerM:17.22 },
  { id: 37, code:'SALZ/0001', name:'Black Spoon Distressed',  category:'distressed-rustic', colour:'Black',   hex:'#2C2C2C', finish:'Distressed', profile:'Spoon',   widthMm:22,  depthMm:12, retailPerM:15.27 },
  { id: 38, code:'SALZ/0003', name:'White Spoon Distressed',  category:'distressed-rustic', colour:'White',   hex:'#E8E4DC', finish:'Distressed', profile:'Spoon',   widthMm:22,  depthMm:12, retailPerM:15.27 },
  { id: 39, code:'PALE/0002', name:'Silver Box Distressed',   category:'distressed-rustic', colour:'Silver',  hex:'#98989C', finish:'Distressed', profile:'Flat',    widthMm:50,  depthMm:22, retailPerM:27.57 },
  { id: 40, code:'YORK/0005', name:'Black Wash Scoop',        category:'distressed-rustic', colour:'Black',   hex:'#3A3A3A', finish:'Wash',       profile:'Scoop',   widthMm:26,  depthMm:14, retailPerM:8.46 },
  // Painted & Colour (7)
  { id: 41, code:'DISP/0003', name:'Painted White Wide',      category:'painted-colour',    colour:'White',   hex:'#F0F0F0', finish:'Paint',      profile:'Flat',    widthMm:82,  depthMm:22, retailPerM:18.69 },
  { id: 42, code:'DISP/0002', name:'Painted Black Wide',      category:'painted-colour',    colour:'Black',   hex:'#141414', finish:'Paint',      profile:'Flat',    widthMm:82,  depthMm:22, retailPerM:18.69 },
  { id: 43, code:'2935/3303', name:'Sloped Green',            category:'painted-colour',    colour:'Green',   hex:'#5A7A5C', finish:'Paint',      profile:'Sloped',  widthMm:16,  depthMm:10, retailPerM:14.97 },
  { id: 44, code:'2935/3301', name:'Sloped Charcoal',         category:'painted-colour',    colour:'Grey',    hex:'#3C3C3C', finish:'Paint',      profile:'Sloped',  widthMm:16,  depthMm:10, retailPerM:14.97 },
  { id: 45, code:'COSM/0024', name:'Blue Gloss Chamford',     category:'painted-colour',    colour:'Blue',    hex:'#2C5288', finish:'Gloss',      profile:'Chamford',widthMm:30,  depthMm:14, retailPerM:9.84 },
  { id: 46, code:'COSM/0025', name:'Grey Gloss Chamford',     category:'painted-colour',    colour:'Grey',    hex:'#6A6A6A', finish:'Gloss',      profile:'Chamford',widthMm:30,  depthMm:14, retailPerM:9.84 },
  { id: 47, code:'COSM/0026', name:'White Gloss Chamford',    category:'painted-colour',    colour:'White',   hex:'#FAFAFA', finish:'Gloss',      profile:'Chamford',widthMm:30,  depthMm:14, retailPerM:9.84 },
  // Cushion & Scoop (7)
  { id: 48, code:'000J/304',  name:'Black Cushion',           category:'cushion-scoop',     colour:'Black',   hex:'#1E1E1E', finish:'Stain',      profile:'Cushion', widthMm:30,  depthMm:14, retailPerM:6.39 },
  { id: 49, code:'528568000', name:'White Lacquer Cushion',   category:'cushion-scoop',     colour:'White',   hex:'#F8F8F4', finish:'Lacquer',    profile:'Cushion', widthMm:13,  depthMm:10, retailPerM:6.51 },
  { id: 50, code:'000K/0342', name:'Oak Cushion',             category:'cushion-scoop',     colour:'Brown',   hex:'#A88850', finish:'Stain',      profile:'Cushion', widthMm:40,  depthMm:16, retailPerM:9.45 },
  { id: 51, code:'000K/0558', name:'Silver Scoop Wide',       category:'cushion-scoop',     colour:'Silver',  hex:'#B0B0B0', finish:'Leaf',       profile:'Scoop',   widthMm:80,  depthMm:24, retailPerM:33.96 },
  { id: 52, code:'000K/0758', name:'Natural Obeche Scoop',    category:'cushion-scoop',     colour:'Natural', hex:'#C0A868', finish:'Raw',        profile:'Scoop',   widthMm:48,  depthMm:18, retailPerM:13.77 },
  { id: 53, code:'YORK/0001', name:'Light Brown Wash Scoop',  category:'cushion-scoop',     colour:'Brown',   hex:'#B09060', finish:'Wash',       profile:'Scoop',   widthMm:26,  depthMm:14, retailPerM:8.46 },
  { id: 54, code:'YORK/0003', name:'Pastel Pink Scoop',       category:'cushion-scoop',     colour:'Pink',    hex:'#D8A8A0', finish:'Wash',       profile:'Scoop',   widthMm:26,  depthMm:14, retailPerM:8.46 },
  // Box & Tray (5)
  { id: 55, code:'000K/0477B',name:'Black Box Frame',         category:'box-tray',          colour:'Black',   hex:'#181818', finish:'Paint',      profile:'Box',     widthMm:30,  depthMm:30, retailPerM:12.30 },
  { id: 56, code:'DISP/0001', name:'Unfinished Pine Box',     category:'box-tray',          colour:'Natural', hex:'#C8A870', finish:'Raw',        profile:'Box',     widthMm:45,  depthMm:30, retailPerM:5.22 },
  { id: 57, code:'LUNA/0001', name:'Black Deep Rebate',       category:'box-tray',          colour:'Black',   hex:'#1A1A1A', finish:'Paint',      profile:'Flat',    widthMm:13,  depthMm:22, retailPerM:9.84 },
  { id: 58, code:'LUNA/0004', name:'Light Grey Deep Rebate',  category:'box-tray',          colour:'Grey',    hex:'#A8A8A4', finish:'Paint',      profile:'Flat',    widthMm:13,  depthMm:22, retailPerM:9.84 },
  { id: 59, code:'LUNA/0008', name:'Taupe Deep Rebate',       category:'box-tray',          colour:'Grey',    hex:'#8A8480', finish:'Paint',      profile:'Flat',    widthMm:13,  depthMm:22, retailPerM:9.84 },
  // Canvas & Floater (4)
  { id: 60, code:'REMB/0009', name:'Black Stain Floater',     category:'canvas-floater',    colour:'Black',   hex:'#1A1A1A', finish:'Stain',      profile:'Floater', widthMm:84,  depthMm:35, retailPerM:33.96 },
  { id: 61, code:'REMB/0011', name:'Brown Stain Floater',     category:'canvas-floater',    colour:'Brown',   hex:'#6B4A2A', finish:'Stain',      profile:'Floater', widthMm:84,  depthMm:35, retailPerM:29.52 },
  { id: 62, code:'REMB/0013', name:'White Gloss Floater',     category:'canvas-floater',    colour:'White',   hex:'#F5F5F5', finish:'Gloss',      profile:'Floater', widthMm:84,  depthMm:35, retailPerM:43.32 },
  { id: 63, code:'REMB/0014', name:'Natural Floater',         category:'canvas-floater',    colour:'Natural', hex:'#BFA060', finish:'Raw',        profile:'Floater', widthMm:84,  depthMm:35, retailPerM:29.52 },
  // Slips & Fillets (7)
  { id: 64, code:'0006/G',    name:'Plain Gold Slip',         category:'slips-fillets',     colour:'Gold',    hex:'#C8A84E', finish:'Gilt',       profile:'Slip',    widthMm:13,  depthMm:6,  retailPerM:5.52 },
  { id: 65, code:'0006/S',    name:'Plain Silver Slip',       category:'slips-fillets',     colour:'Silver',  hex:'#B0B0B0', finish:'Gilt',       profile:'Slip',    widthMm:13,  depthMm:6,  retailPerM:5.52 },
  { id: 66, code:'0007/G',    name:'Wide Gold Slip',          category:'slips-fillets',     colour:'Gold',    hex:'#C8A84E', finish:'Gilt',       profile:'Slip',    widthMm:16,  depthMm:6,  retailPerM:5.52 },
  { id: 67, code:'0007/S',    name:'Wide Silver Slip',        category:'slips-fillets',     colour:'Silver',  hex:'#A8A8A8', finish:'Gilt',       profile:'Slip',    widthMm:16,  depthMm:6,  retailPerM:4.32 },
  { id: 68, code:'5017/6001', name:'Metallic Gold Fillet',    category:'slips-fillets',     colour:'Gold',    hex:'#C4A040', finish:'Foil',       profile:'Slip',    widthMm:16,  depthMm:4,  retailPerM:0.99 },
  { id: 69, code:'5017/6002', name:'Metallic Silver Fillet',  category:'slips-fillets',     colour:'Silver',  hex:'#9C9C9C', finish:'Foil',       profile:'Slip',    widthMm:16,  depthMm:4,  retailPerM:0.99 },
  { id: 70, code:'000J/0098', name:'Gold Foil Slip',          category:'slips-fillets',     colour:'Gold',    hex:'#C0A040', finish:'Foil',       profile:'Slip',    widthMm:10,  depthMm:6,  retailPerM:6.51 },
];

// SIZE_TABLES — uses the same data as the first 3 ratio categories in STANDARD_FORMATS

export const STANDARD_FORMATS = {
  '3:2': [
    { label: '30 x 20 cm', w: 30, h: 20, price: 110.95 },
    { label: '45 x 30 cm', w: 45, h: 30, price: 169.95 },
    { label: '60 x 40 cm', w: 60, h: 40, price: 252.95 },
    { label: '75 x 50 cm', w: 75, h: 50, price: 329.95 },
    { label: '90 x 60 cm', w: 90, h: 60, price: 419.95 },
    { label: '105 x 70 cm', w: 105, h: 70, price: 519.95 },
    { label: '120 x 80 cm', w: 120, h: 80, price: 619.95 },
  ],
  '4:3': [
    { label: '40 x 30 cm', w: 40, h: 30, price: 139.95 },
    { label: '60 x 45 cm', w: 60, h: 45, price: 219.95 },
    { label: '80 x 60 cm', w: 80, h: 60, price: 329.95 },
    { label: '100 x 75 cm', w: 100, h: 75, price: 449.95 },
    { label: '120 x 90 cm', w: 120, h: 90, price: 569.95 },
  ],
  'Square': [
    { label: '20 x 20 cm', w: 20, h: 20, price: 73.95 },
    { label: '30 x 30 cm', w: 30, h: 30, price: 119.95 },
    { label: '40 x 40 cm', w: 40, h: 40, price: 169.95 },
    { label: '50 x 50 cm', w: 50, h: 50, price: 219.95 },
    { label: '60 x 60 cm', w: 60, h: 60, price: 279.95 },
    { label: '70 x 70 cm', w: 70, h: 70, price: 349.95 },
    { label: '80 x 80 cm', w: 80, h: 80, price: 419.95 },
  ],
  'Classic': [
    { label: '24 x 18 cm', w: 24, h: 18, price: 85.95 },
    { label: '30 x 24 cm', w: 30, h: 24, price: 125.95 },
    { label: '35 x 28 cm', w: 35, h: 28, price: 148.95 },
    { label: '50 x 40 cm', w: 50, h: 40, price: 206.95 },
    { label: '60 x 50 cm', w: 60, h: 50, price: 260.95 },
    { label: '70 x 50 cm', w: 70, h: 50, price: 280.95 },
    { label: '90 x 70 cm', w: 90, h: 70, price: 412.95 },
    { label: '100 x 70 cm', w: 100, h: 70, price: 446.95 },
    { label: '140 x 100 cm', w: 140, h: 100, price: 765.95 },
    { label: '150 x 120 cm', w: 150, h: 120, price: 1018.95 },
  ],
  'ISO': [
    { label: 'ISO A4 (29,7 x 21 cm)', w: 29.7, h: 21, price: 109.95 },
    { label: 'ISO A3 (42 x 29,7 cm)', w: 42, h: 29.7, price: 170.95 },
    { label: 'ISO A2 (59,4 x 42 cm)', w: 59.4, h: 42, price: 223.95 },
    { label: 'ISO A1 (84,1 x 59,4 cm)', w: 84.1, h: 59.4, price: 342.95 },
    { label: 'ISO A0 (118,9 x 84,1 cm)', w: 118.9, h: 84.1, price: 589.95 },
  ],
  '16:9': [
    { label: '32 x 18 cm', w: 32, h: 18, price: 99.95 },
    { label: '48 x 27 cm', w: 48, h: 27, price: 173.95 },
    { label: '64 x 36 cm', w: 64, h: 36, price: 214.95 },
    { label: '80 x 45 cm', w: 80, h: 45, price: 282.95 },
    { label: '112 x 63 cm', w: 112, h: 63, price: 447.95 },
    { label: '128 x 72 cm', w: 128, h: 72, price: 542.95 },
    { label: '144 x 81 cm', w: 144, h: 81, price: 668.95 },
    { label: '160 x 90 cm', w: 160, h: 90, price: 785.95 },
    { label: '176 x 99 cm', w: 176, h: 99, price: 922.95 },
    { label: '208 x 117 cm', w: 208, h: 117, price: 1560.95 },
  ],
};

// SIZE_TABLES derives from STANDARD_FORMATS to avoid data duplication
export const SIZE_TABLES = {
  '3:2': STANDARD_FORMATS['3:2'],
  '4:3': STANDARD_FORMATS['4:3'],
  'Square': STANDARD_FORMATS['Square'],
};


export const MOUNTING_OPTIONS = [
  {
    "id": "wc-pure-white",
    "label": "White Core · Pure White",
    "mountType": "White Core",
    "ref": "WC-sw23",
    "hex": "#F8F8F8",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Photography, modern prints, contemporary artwork",
    "group": "Whites & Neutrals"
  },
  {
    "id": "wc-soft-white",
    "label": "White Core · Soft White",
    "mountType": "White Core",
    "ref": "WC-Aq1",
    "hex": "#F0EBE3",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Watercolours, pencil drawings, portraits",
    "group": "Whites & Neutrals"
  },
  {
    "id": "wc-ivory",
    "label": "White Core · Ivory",
    "mountType": "White Core",
    "ref": "WC-Aq2",
    "hex": "#F5EDCC",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Oil paintings, wildlife art, vintage prints",
    "group": "Whites & Neutrals"
  },
  {
    "id": "wc-buttermilk",
    "label": "White Core · Buttermilk",
    "mountType": "White Core",
    "ref": "WC-8629",
    "hex": "#F5EDD0",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Antique frames, botanical prints, maps",
    "group": "Whites & Neutrals"
  },
  {
    "id": "wc-dove",
    "label": "White Core · Dove Grey",
    "mountType": "White Core",
    "ref": "WC-8633",
    "hex": "#D0D0CC",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Monochrome photography, pencil drawings",
    "group": "Greys"
  },
  {
    "id": "wc-mid-grey",
    "label": "White Core · Mid Grey",
    "mountType": "White Core",
    "ref": "WC-8491",
    "hex": "#909090",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Contemporary photography, abstract prints",
    "group": "Greys"
  },
  {
    "id": "wc-slate",
    "label": "White Core · Slate",
    "mountType": "White Core",
    "ref": "WC-8159",
    "hex": "#708090",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Architecture photography, modern art",
    "group": "Greys"
  },
  {
    "id": "wc-charcoal",
    "label": "White Core · Charcoal",
    "mountType": "White Core",
    "ref": "WC-8010",
    "hex": "#484848",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Black & white photography, graphic prints",
    "group": "Greys"
  },
  {
    "id": "bc-soft-white",
    "label": "Black Core · Soft White",
    "mountType": "Black Core",
    "ref": "BC-01",
    "hex": "#F0EBE3",
    "fatgLevel": "Level 4",
    "addonPriceA1": 5.57,
    "popularFor": "Photography — the black bevel adds subtle depth",
    "group": "Black Core"
  },
  {
    "id": "bc-ivory",
    "label": "Black Core · Ivory",
    "mountType": "Black Core",
    "ref": "BC-02",
    "hex": "#F5EDCC",
    "fatgLevel": "Level 4",
    "addonPriceA1": 5.57,
    "popularFor": "Warm-toned artwork — striking black bevel",
    "group": "Black Core"
  },
  {
    "id": "bc-dove-grey",
    "label": "Black Core · Dove Grey",
    "mountType": "Black Core",
    "ref": "BC-05",
    "hex": "#D0D0CC",
    "fatgLevel": "Level 4",
    "addonPriceA1": 5.57,
    "popularFor": "Monochrome photography with depth",
    "group": "Black Core"
  },
  {
    "id": "bc-poster-black",
    "label": "Black Core · Poster Black",
    "mountType": "Black Core",
    "ref": "BC-08",
    "hex": "#181818",
    "fatgLevel": "Level 4",
    "addonPriceA1": 5.57,
    "popularFor": "Bold photography, graphic prints",
    "group": "Black Core"
  },
  {
    "id": "wc-sage",
    "label": "White Core · Sage",
    "mountType": "White Core",
    "ref": "WC-8034",
    "hex": "#90B088",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Botanical art, wildlife, landscape photography",
    "group": "Colour Accents"
  },
  {
    "id": "wc-oxford-blue",
    "label": "White Core · Oxford Blue",
    "mountType": "White Core",
    "ref": "WC-8054",
    "hex": "#284878",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Formal portraiture, naval art, photography",
    "group": "Colour Accents"
  },
  {
    "id": "wc-dusty-pink",
    "label": "White Core · Dusty Pink",
    "mountType": "White Core",
    "ref": "WC-8028",
    "hex": "#E8A898",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Portrait photography, botanical florals",
    "group": "Colour Accents"
  },
  {
    "id": "wc-mustard",
    "label": "White Core · Mustard",
    "mountType": "White Core",
    "ref": "WC-LJ02",
    "hex": "#C8A020",
    "fatgLevel": "Level 3",
    "addonPriceA1": 5.57,
    "popularFor": "Abstract prints, bold contemporary artwork",
    "group": "Colour Accents"
  },
  {
    "id": "con-snow-white",
    "label": "Conservation · Snow White",
    "mountType": "Conservation",
    "ref": "CON-54",
    "hex": "#F0F3F5",
    "fatgLevel": "Level 2",
    "addonPriceA1": 6.91,
    "popularFor": "Photography, contemporary fine art originals",
    "group": "Conservation"
  },
  {
    "id": "con-ivory",
    "label": "Conservation · Ivory",
    "mountType": "Conservation",
    "ref": "CON-30",
    "hex": "#F5EDCC",
    "fatgLevel": "Level 2",
    "addonPriceA1": 6.91,
    "popularFor": "Original artwork — the most popular conservation colour",
    "group": "Conservation"
  },
  {
    "id": "con-antique-white",
    "label": "Conservation · Antique White",
    "mountType": "Conservation",
    "ref": "CON-69",
    "hex": "#EDE4CF",
    "fatgLevel": "Level 2",
    "addonPriceA1": 6.91,
    "popularFor": "Oil paintings, vintage maps, heritage prints",
    "group": "Conservation"
  },
  {
    "id": "con-soft-white",
    "label": "Conservation · Soft White",
    "mountType": "Conservation",
    "ref": "CON-67",
    "hex": "#EDE8E0",
    "fatgLevel": "Level 2",
    "addonPriceA1": 6.91,
    "popularFor": "Watercolours, drawings, limited-edition prints",
    "group": "Conservation"
  },
  {
    "id": "xt-pure-white",
    "label": "Extra Thick · Pure White",
    "mountType": "Extra Thick",
    "ref": "XT-sw23",
    "hex": "#F8F8F8",
    "fatgLevel": "Level 3",
    "addonPriceA1": 9.68,
    "popularFor": "Gallery framing — deep 2.6mm sculptural bevel",
    "group": "Premium"
  },
  {
    "id": "mus-natural-white",
    "label": "Museum · Natural White",
    "mountType": "Museum",
    "ref": "MUS-01",
    "hex": "#F5F2EC",
    "fatgLevel": "Level 1",
    "addonPriceA1": 8.91,
    "popularFor": "Irreplaceable originals — 100% cotton rag",
    "group": "Premium"
  },
  {
    "id": "su-cream",
    "label": "Suede · Cream",
    "mountType": "Suede",
    "ref": "SU-01",
    "hex": "#E8DCC0",
    "fatgLevel": "Level 3",
    "addonPriceA1": 6.68,
    "popularFor": "Portrait photography, wedding commissions",
    "group": "Premium"
  },
  {
    "id": "su-charcoal",
    "label": "Suede · Charcoal",
    "mountType": "Suede",
    "ref": "SU-06",
    "hex": "#484848",
    "fatgLevel": "Level 3",
    "addonPriceA1": 6.68,
    "popularFor": "Black & white photography, dramatic commissions",
    "group": "Premium"
  }
];

export const PAPER_TYPES = [
  { id: 'fuji-glossy', name: 'Fuji Crystal Archive glossy', price: 0 },
  { id: 'baryta', name: 'Fine Art Baryta', price: 18 },
  { id: 'matt-cotton', name: 'Fine Art Matt Cotton', price: 12 },
];

export const ACRYLIC_OPTIONS = [
  { id: 'glossy-2mm', name: '2mm glossy', price: 0 },
  { id: 'anti-reflect-2mm', name: '2mm anti-reflective', price: 20 },
];

export const SAMPLE_IMAGES = [
  // Aliases for main site URL params (?sample=landscape, portrait, square)
  { id: 'landscape', label: 'Landscape', src: '/configurator/dist/samples/reworked 1.jpeg', aspect: '3:2' },
  { id: 'portrait', label: 'Portrait', src: '/configurator/dist/samples/reworked 3.jpeg', aspect: '2:3' },
  { id: 'square', label: 'Square', src: '/configurator/dist/samples/reworked 5.jpeg', aspect: 'Square' },
  // Gallery samples
  { id: 'reworked-1', label: 'Photo 1', src: '/configurator/dist/samples/reworked 1.jpeg', aspect: '3:2' },
  { id: 'reworked-2', label: 'Photo 2', src: '/configurator/dist/samples/reworked 2.jpeg', aspect: '3:2' },
  { id: 'reworked-3', label: 'Photo 3', src: '/configurator/dist/samples/reworked 3.jpeg', aspect: '3:2' },
  { id: 'reworked-4', label: 'Photo 4', src: '/configurator/dist/samples/reworked 4.jpeg', aspect: '3:2' },
  { id: 'reworked-5', label: 'Photo 5', src: '/configurator/dist/samples/reworked 5.jpeg', aspect: '3:2' },
  { id: 'reworked-6', label: 'Photo 6', src: '/configurator/dist/samples/reworked 6.jpeg', aspect: '3:2' },
  { id: 'reworked-7', label: 'Photo 7', src: '/configurator/dist/samples/reworked 7.jpeg', aspect: '3:2' },
  { id: 'reworked-8', label: 'Photo 8', src: '/configurator/dist/samples/reworked 8.jpeg', aspect: '3:2' },
  { id: 'reworked-9', label: 'Photo 9', src: '/configurator/dist/samples/reworked 9.jpeg', aspect: '3:2' },
  { id: 'reworked-10', label: 'Photo 10', src: '/configurator/dist/samples/reworked 10.jpeg', aspect: '3:2' },
];

export const ROOM_SCENES = [
  { id: 'living', name: 'Living Room', bg: '#f5f0eb' },
  { id: 'office', name: 'Office', bg: '#e8e6e3' },
  { id: 'bedroom', name: 'Bedroom', bg: '#f0ede8' },
  { id: 'gallery', name: 'Gallery', bg: '#fafafa' },
];

export const INITIAL_STATE = {
  imageLoaded: false,
  imageSrc: null,
  imageName: 'No photo selected',
  viewMode: 'room',
  activePanel: null, // null = summary view
  showUploadModal: false,
  cropMode: false,
  cropData: null, // { x, y, w, h } in percentages (0–100)
  // Size
  aspectRatio: '3:2',
  selectedSize: null,
  // Optimisation
  optimisationEnabled: true,
  optimisationValue: 70,
  optimisationView: 'side', // 'side' or 'split'
  // UltraHD
  ultraHDEnabled: false,
  // Mounting
  selectedMounting: null,
  // Frame
  selectedProfile: null,
  selectedColour: null,
  selectedCatalogueFrame: null,

  // Room
  selectedRoom: 'living',
  // 3D
  zoom3d: 1,
  rotating3d: false,
  // Orientation preference
  orientation: 'portrait',
  // State Management
  quantity: 1,
  showToast: false,
  cart: [],
  showCart: false,
  showLogin: false,
  user: null, // { name: '...', email: '...', type: 'google|microsoft|apple' }
};
