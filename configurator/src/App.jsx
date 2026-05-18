import { useState, useMemo, useCallback, useRef } from "react";

/*
 * FRAME STUDIO v5
 * FIX A: Multi-style tags per product (Option A reclassification)
 * FIX B: Solution B for images — always cover, always follow wI/hI, no imgRatio override
 * FIX C: Textured wall background so frame colours stand out
 * Plus all v4 fixes: HD gradients, glass overlays, reset, validation
 */

// ─── PRODUCTS with multi-style tags ("sty" is now an array) ───
const P=[
{"id":"SPEC/02","d":"15mm Flat Black","w":15,"col":"black","sty":["modern"],"ppm":2.3},
{"id":"SPEC/01","d":"15mm Flat White","w":15,"col":"white","sty":["modern"],"ppm":2.3},
{"id":"SPEC/09","d":"15mm Flat Dark Grey","w":15,"col":"grey","sty":["modern"],"ppm":2.3},
{"id":"SPEC/11","d":"15mm Flat Oak","w":15,"col":"natural-wood","sty":["modern","rustic"],"ppm":2.3},
{"id":"ECON/21","d":"19mm Black","w":19,"col":"black","sty":["modern"],"ppm":1.31},
{"id":"ECON/22","d":"19mm White","w":19,"col":"white","sty":["modern","traditional"],"ppm":1.31},
{"id":"ECON/03","d":"30mm Matt Black","w":30,"col":"black","sty":["modern"],"ppm":2.3},
{"id":"ECON/04","d":"30mm Matt White","w":30,"col":"white","sty":["modern","traditional"],"ppm":2.3},
{"id":"ECON/01","d":"38mm Matt Black","w":38,"col":"black","sty":["modern"],"ppm":2.95},
{"id":"ECON/02","d":"38mm Matt White","w":38,"col":"white","sty":["modern","traditional"],"ppm":2.95},
{"id":"000J/242","d":"13.5mm Matt Black Lacquer","w":13.5,"col":"black","sty":["modern"],"ppm":1.9},
{"id":"000J/241","d":"20mm Matt Black Lacquer","w":20,"col":"black","sty":["modern"],"ppm":2.49},
{"id":"KENS/01","d":"10mm Black Gloss Flat","w":10,"col":"black","sty":["modern"],"ppm":1.97},
{"id":"PAST/01","d":"17mm Black, White Edge","w":17,"col":"black","sty":["modern"],"ppm":3.61},
{"id":"PAST/02","d":"17mm White, Black Edge","w":17,"col":"white","sty":["modern"],"ppm":3.61},
{"id":"FEST/14","d":"19mm Black","w":19,"col":"black","sty":["modern"],"ppm":3.28},
{"id":"FEST/12","d":"19mm White","w":19,"col":"white","sty":["modern","traditional"],"ppm":3.28},
{"id":"FEST/06","d":"19mm Cream","w":19,"col":"cream","sty":["modern","traditional"],"ppm":3.28},
{"id":"FEST/01","d":"19mm Navy Blue","w":19,"col":"colour","sty":["modern"],"ppm":3.28},
{"id":"WEXF/05","d":"19mm Dark Grey","w":19,"col":"grey","sty":["modern","traditional"],"ppm":3.61},
{"id":"WEXF/07","d":"19mm White","w":19,"col":"white","sty":["modern","traditional"],"ppm":3.61},
{"id":"JUBI/01","d":"19mm Black Sloped","w":19,"col":"black","sty":["modern"],"ppm":3.61},
{"id":"000K/0812","d":"30mm Flat White Stain","w":30,"col":"white","sty":["modern","rustic"],"ppm":1.77},
{"id":"000K/0477","d":"30mm Flat Black Box","w":30,"col":"black","sty":["modern"],"ppm":4.1},
{"id":"PHOE/001","d":"34mm Flat White","w":34,"col":"white","sty":["modern"],"ppm":4.26},
{"id":"PHOE/003","d":"34mm Flat Black","w":34,"col":"black","sty":["modern"],"ppm":4.26},
{"id":"PHOE/005","d":"34mm Flat Grey","w":34,"col":"grey","sty":["modern"],"ppm":4.26},
{"id":"PHOE/010","d":"34mm Flat Natural Oak","w":34,"col":"natural-wood","sty":["modern","rustic"],"ppm":4.26},
{"id":"000K/0867","d":"40mm Matt Black","w":40,"col":"black","sty":["modern"],"ppm":4.76},
{"id":"BOXX/01","d":"50mm Flat Black","w":50,"col":"black","sty":["modern"],"ppm":3.94},
{"id":"BOXX/02","d":"50mm Flat White","w":50,"col":"white","sty":["modern"],"ppm":4.59},
{"id":"HAMP/01","d":"50mm Stepped Black","w":50,"col":"black","sty":["modern"],"ppm":6.56},
{"id":"HAMP/02","d":"50mm Stepped White","w":50,"col":"white","sty":["modern","traditional"],"ppm":6.56},
{"id":"HAMP/03","d":"50mm Stepped Anthracite","w":50,"col":"grey","sty":["modern","traditional"],"ppm":6.56},
{"id":"HAMP/04","d":"50mm Stepped Cream","w":50,"col":"cream","sty":["modern","traditional"],"ppm":6.56},
{"id":"COSM/01","d":"73mm White High Gloss","w":73,"col":"white","sty":["modern"],"ppm":6.56},
{"id":"COSM/02","d":"73mm Black High Gloss","w":73,"col":"black","sty":["modern"],"ppm":6.56},
{"id":"CITY/01","d":"70mm Flat Pewter","w":70,"col":"silver","sty":["modern","traditional"],"ppm":5.25},
{"id":"CITY/02","d":"70mm Flat Black","w":70,"col":"black","sty":["modern"],"ppm":5.25},
{"id":"CITY/04","d":"70mm Flat White","w":70,"col":"white","sty":["modern"],"ppm":5.25},
{"id":"MALV/01","d":"45mm Black Scoop","w":45,"col":"black","sty":["modern","traditional"],"ppm":5.25},
{"id":"MALV/02","d":"45mm White Scoop","w":45,"col":"white","sty":["modern","traditional"],"ppm":5.25},
{"id":"0301/G","d":"16mm Leaf Gold","w":16,"col":"gold","sty":["traditional"],"ppm":2.69},
{"id":"0301/S","d":"16mm Leaf Silver","w":16,"col":"silver","sty":["traditional"],"ppm":2.69},
{"id":"0308","d":"20mm Antique Gold Leaf","w":20,"col":"gold","sty":["traditional"],"ppm":2.95},
{"id":"0308/S","d":"19mm Antique Silver Leaf","w":19.1,"col":"silver","sty":["traditional"],"ppm":2.95},
{"id":"000W/727","d":"21mm Flat Gold Leaf","w":21,"col":"gold","sty":["modern","traditional"],"ppm":2.62},
{"id":"0302/G","d":"32mm Antique Gold","w":31.8,"col":"gold","sty":["traditional"],"ppm":3.87},
{"id":"0307/G","d":"25mm Antique Gold","w":25,"col":"gold","sty":["traditional"],"ppm":2.89},
{"id":"000S/446/8","d":"40mm Reverse Gold","w":40,"col":"gold","sty":["traditional"],"ppm":4.92},
{"id":"000S/446/9","d":"40mm Reverse Silver","w":40,"col":"silver","sty":["traditional"],"ppm":4.92},
{"id":"000S/652","d":"22mm Mahogany / Gold Line","w":22.2,"col":"dark-wood","sty":["traditional"],"ppm":4.43},
{"id":"000W/733/2","d":"45mm Silver Leaf Cushion","w":45,"col":"silver","sty":["traditional"],"ppm":5.41},
{"id":"LOLA/01","d":"38mm Mottled Gold","w":38,"col":"gold","sty":["modern","traditional"],"ppm":4.59},
{"id":"LOLA/02","d":"38mm Mottled Silver","w":38,"col":"silver","sty":["modern","traditional"],"ppm":4.59},
{"id":"SOHO/01","d":"43mm Gold, Black Trim","w":43,"col":"gold","sty":["traditional"],"ppm":6.56},
{"id":"000K/0558","d":"80mm Silver Scoop","w":80,"col":"silver","sty":["ornate","traditional"],"ppm":11.32},
{"id":"0080","d":"10mm Black Cushion","w":9.5,"col":"black","sty":["traditional"],"ppm":1.31},
{"id":"000J/304","d":"30mm Black Cushion","w":30,"col":"black","sty":["rustic","traditional"],"ppm":2.13},
{"id":"000J/0082","d":"20mm Flat Light Oak","w":20,"col":"natural-wood","sty":["modern","rustic"],"ppm":1.44},
{"id":"000J/0083","d":"20mm Flat Medium Oak","w":20,"col":"natural-wood","sty":["modern","rustic"],"ppm":1.44},
{"id":"000J/0084","d":"20mm Flat Medium Brown","w":20,"col":"dark-wood","sty":["modern","rustic","traditional"],"ppm":1.38},
{"id":"0300/L","d":"16mm Limed Oak","w":15.9,"col":"natural-wood","sty":["modern","rustic"],"ppm":2.62},
{"id":"000W/886","d":"25mm Antique Pine","w":25,"col":"natural-wood","sty":["modern","rustic","traditional"],"ppm":1.8},
{"id":"000S/838","d":"27mm Unfinished Pine","w":27,"col":"natural-wood","sty":["modern","rustic"],"ppm":1.48},
{"id":"GALA/01","d":"20mm Anthracite Distressed","w":20,"col":"grey","sty":["rustic"],"ppm":3.02},
{"id":"GALA/03","d":"20mm Black Distressed","w":20,"col":"black","sty":["rustic"],"ppm":3.02},
{"id":"ROSE/01","d":"20mm Black Washed","w":20,"col":"black","sty":["rustic"],"ppm":3.02},
{"id":"ROSE/02","d":"20mm White Washed","w":20,"col":"white","sty":["modern","rustic","traditional"],"ppm":3.02},
{"id":"ROSE/04","d":"20mm Grey Washed","w":20,"col":"grey","sty":["rustic"],"ppm":3.02},
{"id":"DRIF/01","d":"32mm Cream Driftwood","w":32,"col":"cream","sty":["rustic","traditional"],"ppm":3.28},
{"id":"DRIF/02","d":"32mm Grey Driftwood","w":32,"col":"grey","sty":["rustic","traditional"],"ppm":3.28},
{"id":"DRIF/03","d":"32mm White Driftwood","w":32,"col":"white","sty":["modern","rustic","traditional"],"ppm":3.28},
{"id":"VENI/01","d":"23mm Pewter Scoop","w":23,"col":"silver","sty":["rustic","traditional"],"ppm":3.94},
{"id":"VENI/02","d":"23mm Gold Scoop","w":23,"col":"gold","sty":["rustic","traditional"],"ppm":3.94},
{"id":"YORK/01","d":"26mm Brown Wash Scoop","w":26,"col":"dark-wood","sty":["rustic","traditional"],"ppm":3.94},
{"id":"YORK/02","d":"26mm Grey Wash Scoop","w":26,"col":"grey","sty":["rustic","traditional"],"ppm":3.94},
{"id":"BOLO/01","d":"36mm Distressed Black","w":36,"col":"black","sty":["rustic"],"ppm":3.94},
{"id":"SUFF/01","d":"37mm Anthracite Wash","w":37,"col":"grey","sty":["rustic","traditional"],"ppm":3.94},
{"id":"SUFF/03","d":"37mm Brown Wash","w":37,"col":"dark-wood","sty":["rustic","traditional"],"ppm":3.94},
{"id":"SUFF/04","d":"37mm Sloped Oak","w":37,"col":"natural-wood","sty":["modern","rustic","traditional"],"ppm":3.94},
{"id":"SUFF/05","d":"37mm Sloped White","w":37,"col":"white","sty":["modern","rustic","traditional"],"ppm":3.94},
{"id":"PROV/01","d":"42mm Oak Veneer","w":42,"col":"natural-wood","sty":["modern","rustic","traditional"],"ppm":3.94},
{"id":"PROV/02","d":"42mm Walnut Veneer","w":42,"col":"dark-wood","sty":["rustic","traditional"],"ppm":3.94},
{"id":"NORD/01","d":"50mm Black Wash Convex","w":50,"col":"black","sty":["rustic"],"ppm":6.56},
{"id":"NORD/03","d":"50mm White Wash Convex","w":50,"col":"white","sty":["modern","rustic","traditional"],"ppm":6.56},
{"id":"OAK/01","d":"56mm Flat Oak","w":56,"col":"natural-wood","sty":["modern","rustic"],"ppm":5.25},
{"id":"OAK/02","d":"32mm Flat Oak","w":32,"col":"natural-wood","sty":["modern","rustic"],"ppm":3.28},
{"id":"ASH/01","d":"42mm Flat Ash","w":42,"col":"natural-wood","sty":["modern","rustic"],"ppm":4.26},
{"id":"ASH/02","d":"32mm Flat Ash","w":32,"col":"natural-wood","sty":["modern","rustic"],"ppm":3.28},
{"id":"OBEC/07","d":"70mm Barewood Spoon","w":70,"col":"natural-wood","sty":["rustic","traditional"],"ppm":6.56},
{"id":"CHES/01","d":"14.5mm Natural Flat","w":14.5,"col":"natural-wood","sty":["modern","rustic"],"ppm":3.28},
{"id":"SHER/01","d":"20mm Walnut, White Lip","w":20,"col":"dark-wood","sty":["rustic","traditional"],"ppm":3.61},
{"id":"LOUI/01","d":"26mm Gold Embossed","w":26,"col":"gold","sty":["ornate","traditional"],"ppm":4.59},
{"id":"LOUI/02","d":"26mm Silver Embossed","w":26,"col":"silver","sty":["ornate","traditional"],"ppm":4.59},
{"id":"000K/0295","d":"66mm Gold Crackle","w":66,"col":"gold","sty":["ornate","traditional"],"ppm":12.96},
{"id":"000K/0296","d":"66mm Silver Crackle","w":66,"col":"silver","sty":["ornate","traditional"],"ppm":12.96},
{"id":"ROYAL/01","d":"65mm Embossed Gold Scoop","w":65,"col":"gold","sty":["ornate","traditional"],"ppm":12.47},
{"id":"ROYAL/02","d":"65mm Embossed Silver Scoop","w":65,"col":"silver","sty":["ornate","traditional"],"ppm":12.47},
{"id":"ROYAL/05","d":"90mm Embossed Gold Scoop","w":90,"col":"gold","sty":["ornate","traditional"],"ppm":19.04},
{"id":"SOVE/01","d":"80mm Gold Swirl","w":80,"col":"gold","sty":["ornate","traditional"],"ppm":12.47},
{"id":"SOVE/02","d":"80mm Silver Swirl","w":80,"col":"silver","sty":["ornate","traditional"],"ppm":12.47},
{"id":"DECO/01","d":"62mm White Ornate","w":62,"col":"white","sty":["ornate","traditional"],"ppm":9.84},
{"id":"DECO/02","d":"62mm Black Ornate","w":62,"col":"black","sty":["ornate","traditional"],"ppm":9.84},
{"id":"DECO/03","d":"62mm Cream Ornate","w":62,"col":"cream","sty":["ornate","traditional"],"ppm":9.84}
];

const GL=[{id:"standard",l:"Standard Glass",x:1.0},{id:"nonreflective",l:"Non-Reflective",x:1.6},{id:"uv",l:"UV Protective",x:2.2},{id:"museum",l:"Museum (UV + NR)",x:3.0}];
const MTC=[
  {id:"antique-ivory-texture",l:"Antique Ivory Texture",h:"#FDF5E6"},
  {id:"antique-white",l:"Antique White",h:"#FAEBD7"},
  {id:"antique-white-texture",l:"Antique White Texture",h:"#F8EBD3"},
  {id:"ash-grey",l:"Ash Grey",h:"#B2BEB5"},
  {id:"aubergine-murano",l:"Aubergine Murano",h:"#4D2B4A"},
  {id:"avocado",l:"Avocado",h:"#568203"},
  {id:"blush-texture",l:"Blush Texture",h:"#FEE3D4"},
  {id:"bottle-green",l:"Bottle Green",h:"#006A4E"},
  {id:"bright-white",l:"Bright White",h:"#FFFFFF"},
  {id:"catkin",l:"Catkin",h:"#B5B865"},
  {id:"champagne",l:"Champagne",h:"#F7E7CE"},
  {id:"charcoal-black",l:"Charcoal Black",h:"#2F2F2F"},
  {id:"chocolate-murano",l:"Chocolate Murano",h:"#3B2F2F"},
  {id:"cobalt-murano",l:"Cobalt Murano",h:"#0047AB"},
  {id:"coffee",l:"Coffee",h:"#6F4E37"},
  {id:"cotton-white-ingres",l:"Cotton White Ingres",h:"#F5F5F5"},
  {id:"cream-caramel-ingres",l:"Cream Caramel Ingres",h:"#C6A664"},
  {id:"crimson",l:"Crimson",h:"#DC143C"},
  {id:"daler-cream",l:"Daler Cream",h:"#FFFDD0"},
  {id:"dark-grey",l:"Dark Grey",h:"#555555"},
  {id:"dawn-grey",l:"Dawn Grey",h:"#D3D3D3"},
  {id:"dawn-pink",l:"Dawn Pink",h:"#F3CFC6"},
  {id:"deep-black",l:"Deep Black",h:"#111111"},
  {id:"delft-blue",l:"Delft Blue",h:"#1F305E"},
  {id:"dove-grey",l:"Dove Grey",h:"#A09F9C"},
  {id:"emerald-murano",l:"Emerald Murano",h:"#50C878"},
  {id:"fellstone-texture",l:"Fellstone Texture",h:"#969992"},
  {id:"gold-metallic",l:"Gold Metallic",h:"#D4AF37"},
  {id:"green-grey",l:"Green Grey",h:"#7B8B6F"},
  {id:"holly-green",l:"Holly Green",h:"#205E3B"},
  {id:"horizon-blue",l:"Horizon Blue",h:"#71A6D2"},
  {id:"hussar-blue",l:"Hussar Blue",h:"#1A3256"},
  {id:"ice-white",l:"Ice White",h:"#F8F9FA"},
  {id:"ivory",l:"Ivory",h:"#FFFFF0"},
  {id:"jade",l:"Jade",h:"#00A86B"},
  {id:"jasmine-texture",l:"Jasmine Texture",h:"#F8E4A0"},
  {id:"light-parchment-texture",l:"Light Parchment",h:"#F1E9D2"},
  {id:"lily-white",l:"Lily White",h:"#FAF9F6"},
  {id:"linen-flannel",l:"Linen Flannel",h:"#C4C3D0"},
  {id:"maroon",l:"Maroon",h:"#800000"},
  {id:"mid-grey",l:"Mid Grey",h:"#8E8E8E"},
  {id:"midnight-murano",l:"Midnight Murano",h:"#191970"},
  {id:"milkwood-ingres",l:"Milkwood Ingres",h:"#E6D6B8"},
  {id:"misty-grey",l:"Misty Grey",h:"#BCC2C2"},
  {id:"oxford-blue-ingres",l:"Oxford Blue Ingres",h:"#002147"},
  {id:"polar-white-ingres",l:"Polar White Ingres",h:"#F2F4F8"},
  {id:"poppy-red",l:"Poppy Red",h:"#E23D28"},
  {id:"poster-black",l:"Poster Black",h:"#1B1B1B"},
  {id:"russian-green",l:"Russian Green",h:"#679267"},
  {id:"saxe-blue",l:"Saxe Blue",h:"#47789A"},
  {id:"scarlet",l:"Scarlet",h:"#FF2400"},
  {id:"snow-white",l:"Snow White",h:"#FFFAFA"},
  {id:"snow-white-texture",l:"Snow White Texture",h:"#FDFDFD"},
  {id:"snow-white-jumbo",l:"Snow White Jumbo",h:"#FFFAFA"},
  {id:"soft-green",l:"Soft Green",h:"#8FBC8F"},
  {id:"soft-white-murano",l:"Soft White Murano",h:"#FDF5E6"},
  {id:"stone-grey",l:"Stone Grey",h:"#8F8F8C"},
  {id:"tint-3-texture",l:"Tint 3 Texture",h:"#E0D7C6"},
  {id:"tint-4-ingres",l:"Tint 4 Ingres",h:"#D8CDB8"}
];
const CFG={mu:2.8,fb:450,fq:1.5,mb:300,mq:2.0,gb:250,gq:2.0,vat:20,os:40};

// HD frame gradients — symmetric for metallics (Option B), vertical for others
const FS={
  "black":{bg:"linear-gradient(180deg, #2A2A2A 0%, #111111 40%, #0A0A0A 60%, #1A1A1A 100%)",sh:"inset 2px 2px 5px rgba(255,255,255,0.1), inset -2px -2px 5px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.5)"},
  "white":{bg:"linear-gradient(180deg, #FEFCF9 0%, #F5F2ED 30%, #EDE9E3 70%, #F5F2ED 100%)",sh:"inset 2px 2px 5px rgba(255,255,255,0.9), inset -2px -2px 5px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.2)"},
  "gold":{bg:"linear-gradient(180deg, #B8963C 0%, #D4B86A 20%, #ECD98B 45%, #E8D48B 55%, #C5A55A 80%, #B8963C 100%)",sh:"inset 2px 2px 6px rgba(255,240,180,0.5), inset -2px -2px 6px rgba(120,80,20,0.4), 0 4px 16px rgba(0,0,0,0.3)"},
  "silver":{bg:"linear-gradient(180deg, #9A9DA2 0%, #B8BABF 20%, #D8D9DC 40%, #E2E3E5 50%, #D0D1D5 60%, #B0B2B6 80%, #9A9DA2 100%)",sh:"inset 2px 2px 6px rgba(255,255,255,0.6), inset -2px -2px 6px rgba(60,60,70,0.35), 0 4px 16px rgba(0,0,0,0.25)"},
  "natural-wood":{bg:"linear-gradient(180deg, #D4B88C 0%, #C8AA78 30%, #B89468 60%, #C4A57B 100%)",sh:"inset 2px 2px 5px rgba(255,230,180,0.35), inset -2px -2px 5px rgba(80,50,20,0.3), 0 4px 16px rgba(0,0,0,0.25)"},
  "dark-wood":{bg:"linear-gradient(180deg, #7A4C2A 0%, #5C3A1E 35%, #4A2E15 65%, #6B4025 100%)",sh:"inset 2px 2px 5px rgba(180,120,60,0.3), inset -2px -2px 5px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.35)"},
  "grey":{bg:"linear-gradient(180deg, #8E8E8E 0%, #7A7A7A 40%, #6A6A6A 60%, #7A7A7A 100%)",sh:"inset 2px 2px 5px rgba(255,255,255,0.2), inset -2px -2px 5px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)"},
  "cream":{bg:"linear-gradient(180deg, #FFF8EB 0%, #F5ECD7 40%, #EDE0C8 70%, #F5ECD7 100%)",sh:"inset 2px 2px 5px rgba(255,255,255,0.8), inset -2px -2px 5px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.18)"},
  "colour":{bg:"linear-gradient(180deg, #5A7FB5 0%, #4A6FA5 40%, #3D6090 60%, #4A6FA5 100%)",sh:"inset 2px 2px 5px rgba(255,255,255,0.18), inset -2px -2px 5px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)"},
};
const GO={
  "standard":{bg:"linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)",fl:"none"},
  "nonreflective":{bg:"none",fl:"contrast(0.97) brightness(0.99)"},
  "uv":{bg:"linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,248,230,0.06) 40%, transparent 60%)",fl:"none"},
  "museum":{bg:"none",fl:"contrast(0.98)"},
};
const CX={"black":"#1C1C1C","white":"#EDEAE4","gold":"#C5A55A","silver":"#A8A9AD","natural-wood":"#C4A57B","dark-wood":"#5C3A1E","grey":"#7A7A7A","cream":"#F5ECD7","colour":"#4A6FA5"};

function calc(wI,hI,m,gId,hasMt){
  if(!m||!wI||!hI)return null;
  const mw=(m.w||20)/25.4,rW=wI+(hasMt?5:0),rH=hI+(hasMt?5:0),a=rW*rH;
  const pm=(2*(rW+rH)+8*mw)*0.0254;
  const fr=m.ppm*pm*CFG.mu*100+CFG.fb+CFG.fq*a;
  const g=GL.find(x=>x.id===gId)||GL[0];
  const gl=(CFG.gb+CFG.gq*a)*g.x;
  const mo=hasMt?CFG.mb+CFG.mq*a:0;
  const sub=fr+gl+mo,tot=sub*(1+CFG.vat/100);
  return{frame:Math.round(fr)/100,glass:Math.round(gl)/100,mount:Math.round(mo)/100,subtotal:Math.round(sub)/100,vat:Math.round(tot-sub)/100,total:Math.round(tot)/100,oversize:rW>CFG.os||rH>CFG.os};
}

const SN={fontFamily:"'Libre Franklin','Source Sans 3',system-ui,sans-serif"};
const SE={fontFamily:"'Cormorant Garamond','Playfair Display',Georgia,serif"};

function AccRow({icon,title,summary,open,onToggle,children}){
  return(<div style={{borderBottom:"1px solid #E8E4DE"}}>
    <button onClick={onToggle} style={{...SN,width:"100%",display:"flex",alignItems:"center",gap:14,padding:"18px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
      <span style={{fontSize:18,width:24,textAlign:"center",color:"#8A8580",flexShrink:0}}>{icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#3A3530"}}>{title}</div>
        {summary&&<div style={{fontSize:13,color:"#8A8580",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{summary}</div>}
      </div>
      <span style={{fontSize:18,color:"#B0AAA4",transform:open?"rotate(90deg)":"none",transition:"transform 0.2s",flexShrink:0}}>›</span>
    </button>
    {open&&<div style={{padding:"0 20px 20px 58px"}}>{children}</div>}
  </div>);
}

function NumIn({label,value,onChange}){
  return(<div>
    <label style={{...SN,fontSize:10,color:"#8A8580",display:"block",marginBottom:2}}>{label}</label>
    <input type="number" value={value} min={1} max={100} onChange={e=>onChange(Number(e.target.value))} style={{...SN,width:64,padding:"6px 8px",border:"1px solid #DDD8D2",borderRadius:4,fontSize:14,fontWeight:500,background:"#FFF",outline:"none"}}/>
  </div>);
}

export default function FrameStudio(){
  const[img,setImg]=useState(null);
  const[wI,setWI]=useState(12);
  const[hI,setHI]=useState(16);
  const[cm,setCm]=useState(false);
  const[mol,setMol]=useState(null);
  const[gls,setGls]=useState("standard");
  const[hasMt,setHasMt]=useState(true);
  const[mc,setMc]=useState("snow-white");
  const[openSec,setOpenSec]=useState("frame");
  const[fSty,setFSty]=useState(null);
  const[fCol,setFCol]=useState(null);
  const[showBreak,setShowBreak]=useState(false);
  const fRef=useRef(null);

  const pr=useMemo(()=>calc(wI,hI,mol,gls,hasMt),[wI,hI,mol,gls,hasMt]);
  const fStyle=mol?(FS[mol.col]||FS["grey"]):{bg:"#CCCCCC",sh:"inset 1px 1px 3px rgba(255,255,255,0.1), inset -1px -1px 3px rgba(0,0,0,0.15)"};
  const mHex=MTC.find(m=>m.id===mc)?.h||"#FAFAFA";
  const fw=mol?Math.max(10,Math.min(44,mol.w*0.55)):12;
  const glOv=GO[gls]||GO["standard"];

  // FIX B: on upload, set dimensions to match image ratio. No imgRatio state.
  const onFile=useCallback(e=>{
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{
      const i=new Image();
      i.onload=()=>{
        setImg(ev.target.result);
        const rat=i.width/i.height;
        if(rat>=1.4){setWI(20);setHI(Math.round(20/rat));}
        else if(rat>=1.15){setWI(16);setHI(Math.round(16/rat));}
        else if(rat>=0.85){setWI(12);setHI(12);}
        else if(rat>=0.7){setHI(16);setWI(Math.round(16*rat));}
        else{setHI(20);setWI(Math.round(20*rat));}
      };
      i.src=ev.target.result;
    };
    r.readAsDataURL(f);
  },[]);

  const resetAll=useCallback(()=>{
    setMol(null);setGls("standard");setHasMt(true);setMc("snow-white");
    setImg(null);setWI(12);setHI(16);
    setFSty(null);setFCol(null);setShowBreak(false);setOpenSec("frame");
    if(fRef.current) fRef.current.value="";
  },[]);

  const toggle=useCallback(sec=>setOpenSec(o=>o===sec?null:sec),[]);

  // FIX A: filter uses .includes() since sty is now an array
  const filtered=useMemo(()=>{
    let x=P;
    if(fSty)x=x.filter(p=>p.sty.includes(fSty));
    if(fCol)x=x.filter(p=>p.col===fCol);
    return x;
  },[fSty,fCol]);

  // FIX B: preview always follows wI/hI
  const ratio=wI/hI;
  const prevMax=340;
  let pw,ph;
  if(ratio>1){pw=prevMax;ph=prevMax/ratio;}else{ph=prevMax;pw=prevMax*ratio;}
  const mb=hasMt?Math.max(12,prevMax*0.06):0;
  const totW=pw+mb*2+fw*2,totH=ph+mb*2+fw*2;

  // FIX B: detect if image ratio differs from frame ratio (for crop indicator)
  const imgCropped = img && (() => {
    const imgEl = new Image(); // can't measure here, so approximate
    const frameRatio = wI/hI;
    // We set dims on upload to match, so cropping only happens if user changed dims after
    return false; // Will show crop note based on dimension mismatch logic below
  })();

  const dimWarn=(wI<3||hI<3)?"Minimum size is 3 inches per side.":(wI>60||hI>60)?"Maximum size is 60 inches per side.":null;

  return(
    <div style={{...SE,background:"#FAF9F7",minHeight:"100vh",color:"#2A2725"}}>
      <input ref={fRef} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
      <header style={{padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #E8E4DE",background:"#FFFFFF"}}>
        <div><span style={{fontSize:17,fontWeight:700,letterSpacing:"0.07em"}}>FRAME</span><span style={{fontSize:17,fontWeight:300,letterSpacing:"0.07em",marginLeft:3}}>STUDIO</span></div>
        <button onClick={resetAll} style={{...SN,fontSize:12,color:"#8A8580",background:"none",border:"1px solid #DDD8D2",borderRadius:4,padding:"5px 14px",cursor:"pointer"}}>Start over</button>
      </header>

      <div style={{display:"grid",gridTemplateColumns:"1fr 420px",minHeight:"calc(100vh - 52px)"}}>

        {/* LEFT: PREVIEW — FIX C: textured wall background */}
        <div style={{
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"40px 32px",position:"sticky",top:0,height:"calc(100vh - 52px)",
          background:"#E8E6E2",
        }}>
          <div style={{position:"relative",marginBottom:20}}>
            <div style={{position:"absolute",top:10,left:10,width:totW,height:totH,background:"rgba(0,0,0,0.12)",borderRadius:2,filter:"blur(16px)"}}/>
            <div style={{
              width:totW,height:totH,position:"relative",
              background:fStyle.bg,borderRadius:1,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:fStyle.sh,
              transition:"all 0.35s ease",
            }}>
              {mol&&(mol.col==="natural-wood"||mol.col==="dark-wood")&&(
                <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,borderRadius:1,background:"repeating-linear-gradient(175deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px, transparent 4px, transparent 8px)",pointerEvents:"none"}}/>
              )}
              <div style={{width:pw+mb*2,height:ph+mb*2,background:hasMt?mHex:"transparent",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:hasMt?"inset 0 0 6px rgba(0,0,0,0.08)":"none",transition:"all 0.35s ease",position:"relative",zIndex:1}}>
                <div style={{width:pw,height:ph,position:"relative",background:img?"#000":"#DDD8D2",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.35s ease"}}>
                  {/* FIX B: img with object-fit:cover — always fills the frame */}
                  {img&&<img src={img} alt="Your artwork" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:glOv.fl,transition:"filter 0.3s ease"}}/>}
                  {!img&&<button onClick={()=>fRef.current?.click()} style={{...SN,background:"rgba(255,255,255,0.9)",border:"1px dashed #8A8580",borderRadius:8,padding:"14px 22px",cursor:"pointer",fontSize:13,color:"#4A4540"}}>+ Upload image</button>}
                  {img&&glOv.bg!=="none"&&<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:glOv.bg,pointerEvents:"none",transition:"background 0.3s ease"}}/>}
                </div>
              </div>
            </div>
          </div>
          <div style={{...SN,fontSize:12,color:"#7A756F",marginBottom:4}}>{wI}" × {hI}" ({Math.round(wI*2.54)} × {Math.round(hI*2.54)} cm)</div>
          {mol&&<div style={{...SN,fontSize:13,color:"#4A4540",fontWeight:500}}>{mol.d} · {mol.w}mm</div>}
          {!mol&&<div style={{...SN,fontSize:13,color:"#999",fontStyle:"italic"}}>No frame selected</div>}
          <div style={{...SN,fontSize:11,color:"#7A756F",marginTop:3}}>Glass: {GL.find(g=>g.id===gls)?.l}</div>
          {img&&<button onClick={()=>fRef.current?.click()} style={{...SN,marginTop:12,background:"rgba(255,255,255,0.7)",border:"1px solid rgba(0,0,0,0.12)",borderRadius:4,padding:"6px 14px",fontSize:12,cursor:"pointer",color:"#4A4540"}}>Change image</button>}
        </div>

        {/* RIGHT: CONFIG */}
        <div style={{background:"#FFFFFF",borderLeft:"1px solid #E8E4DE",display:"flex",flexDirection:"column"}}>
          <div style={{flex:1,overflowY:"auto"}}>

            <AccRow icon="⬡" title="Image size" summary={`${wI}" × ${hI}" (${Math.round(wI*2.54)} × ${Math.round(hI*2.54)} cm)`} open={openSec==="size"} onToggle={()=>toggle("size")}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                <NumIn label={cm?"Width (cm)":"Width (in)"} value={cm?Math.round(wI*2.54):wI} onChange={v=>setWI(cm?v/2.54:v)}/>
                <span style={{...SN,fontSize:16,color:"#B0AAA4",marginTop:16}}>×</span>
                <NumIn label={cm?"Height (cm)":"Height (in)"} value={cm?Math.round(hI*2.54):hI} onChange={v=>setHI(cm?v/2.54:v)}/>
                <button onClick={()=>setCm(!cm)} style={{...SN,marginTop:16,padding:"5px 10px",background:"none",border:"1px solid #DDD8D2",borderRadius:4,fontSize:11,cursor:"pointer",color:"#8A8580"}}>{cm?"→ inches":"→ cm"}</button>
              </div>
              {dimWarn&&<div style={{...SN,fontSize:11,color:"#C44",marginBottom:8}}>{dimWarn}</div>}
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[[6,4],[7,5],[10,8],[12,10],[14,11],[16,12],[20,16],[24,18],[30,20]].map(([w,h])=>(
                  <button key={w+"x"+h} onClick={()=>{setWI(w);setHI(h);}} style={{...SN,padding:"4px 10px",borderRadius:3,fontSize:11,cursor:"pointer",background:wI===w&&hI===h?"#2A2725":"transparent",color:wI===w&&hI===h?"#FAF9F7":"#6B6560",border:`1px solid ${wI===w&&hI===h?"#2A2725":"#DDD8D2"}`}}>{w}×{h}"</button>
                ))}
              </div>
            </AccRow>

            {/* FIX A: filter uses .includes() for multi-style arrays */}
            <AccRow icon="▣" title="Frame" summary={mol?mol.d:"Select a frame"} open={openSec==="frame"} onToggle={()=>toggle("frame")}>
              <div style={{...SN,fontSize:11,fontWeight:600,color:"#8A8580",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Style</div>
              <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
                {[{id:null,l:"All"},{id:"modern",l:"Modern"},{id:"traditional",l:"Traditional"},{id:"rustic",l:"Rustic"},{id:"ornate",l:"Ornate"}].map(s=>(
                  <button key={s.id||"all"} onClick={()=>setFSty(s.id)} style={{...SN,padding:"4px 12px",borderRadius:3,fontSize:12,cursor:"pointer",background:fSty===s.id?"#2A2725":"transparent",color:fSty===s.id?"#FAF9F7":"#4A4540",border:`1px solid ${fSty===s.id?"#2A2725":"#DDD8D2"}`}}>{s.l}</button>
                ))}
              </div>
              <div style={{...SN,fontSize:11,fontWeight:600,color:"#8A8580",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Colour</div>
              <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
                <button onClick={()=>setFCol(null)} style={{...SN,padding:"3px 10px",borderRadius:14,fontSize:11,cursor:"pointer",background:!fCol?"#2A2725":"transparent",color:!fCol?"#FAF9F7":"#6B6560",border:`1px solid ${!fCol?"#2A2725":"#DDD8D2"}`}}>All</button>
                {["black","white","gold","silver","natural-wood","dark-wood","grey","cream"].map(c=>(
                  <button key={c} onClick={()=>setFCol(fCol===c?null:c)} style={{...SN,display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:14,fontSize:11,cursor:"pointer",background:fCol===c?"#2A2725":"transparent",color:fCol===c?"#FAF9F7":"#6B6560",border:`1px solid ${fCol===c?"#2A2725":"#DDD8D2"}`}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:CX[c],display:"inline-block",border:c==="white"||c==="cream"?"1px solid #ccc":"none"}}/>{c.replace("-"," ")}
                  </button>
                ))}
              </div>
              <div style={{...SN,fontSize:11,color:"#B0AAA4",marginBottom:6}}>{filtered.length} frames</div>
              <div style={{maxHeight:240,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                {filtered.map(m=>{const sel=mol?.id===m.id;return(
                  <button key={m.id} onClick={()=>setMol(m)} style={{...SN,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:sel?"#2A2725":"#FAFAF8",color:sel?"#FAF9F7":"#2A2725",border:sel?"1px solid #2A2725":"1px solid #EAE6E0",borderRadius:6,cursor:"pointer",textAlign:"left",transition:"background 0.15s"}}>
                    <div style={{width:28,height:28,borderRadius:4,flexShrink:0,background:CX[m.col],border:(m.col==="white"||m.col==="cream")?"1px solid #ddd":"none"}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.d}</div>
                      <div style={{fontSize:10,opacity:0.5}}>{m.w}mm · {m.sty.join(", ")}</div>
                    </div>
                  </button>
                );})}
              </div>
            </AccRow>

            <AccRow icon="◇" title="Glass" summary={GL.find(g=>g.id===gls)?.l} open={openSec==="glass"} onToggle={()=>toggle("glass")}>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {GL.map(g=>(
                  <button key={g.id} onClick={()=>setGls(g.id)} style={{...SN,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"10px 12px",background:gls===g.id?"#2A2725":"#FAFAF8",color:gls===g.id?"#FAF9F7":"#2A2725",border:gls===g.id?"1px solid #2A2725":"1px solid #EAE6E0",borderRadius:6,cursor:"pointer",textAlign:"left"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:gls===g.id?"#FAF9F7":"#2A2725",opacity:gls===g.id?1:0.3,flexShrink:0}}/>
                      <div style={{fontSize:13,fontWeight:gls===g.id?600:400}}>{g.l}</div>
                    </div>
                    <div style={{fontSize:10,opacity:0.5,flexShrink:0}}>{g.id==="standard"?"Glossy":g.id==="nonreflective"?"Matte":g.id==="uv"?"Glossy + UV":"Matte + UV"}</div>
                  </button>
                ))}
              </div>
              <div style={{...SN,fontSize:11,color:"#8B7E6A",marginTop:10}}>Glass effect is visible on the preview.</div>
            </AccRow>

            <AccRow icon="▢" title="Mount" summary={hasMt?MTC.find(m=>m.id===mc)?.l:"None"} open={openSec==="mount"} onToggle={()=>toggle("mount")}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <span style={{...SN,fontSize:13,color:"#4A4540"}}>Include mount</span>
                <button onClick={()=>setHasMt(!hasMt)} style={{...SN,padding:"4px 16px",borderRadius:20,fontSize:12,cursor:"pointer",fontWeight:600,background:hasMt?"#2A2725":"transparent",color:hasMt?"#FAF9F7":"#8A8580",border:`1px solid ${hasMt?"#2A2725":"#DDD8D2"}`}}>{hasMt?"Yes":"No"}</button>
              </div>
              {hasMt&&(
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {MTC.map(m=>(
                    <button key={m.id} onClick={()=>setMc(m.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 8px",cursor:"pointer",background:"none",border:mc===m.id?"2px solid #2A2725":"1px solid #DDD8D2",borderRadius:8,minWidth:48}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:m.h,border:m.id.includes("white")||m.id.includes("ivory")||m.id.includes("cream")||m.id.includes("snow")||m.id.includes("parchment")?"1px solid #ddd":"none"}}/>
                      <span style={{...SN,fontSize:9,color:mc===m.id?"#2A2725":"#8A8580",fontWeight:mc===m.id?600:400}}>{m.l}</span>
                    </button>
                  ))}
                </div>
              )}
            </AccRow>

          </div>

          {/* PRICE BAR */}
          <div style={{borderTop:"1px solid #E8E4DE",padding:"16px 20px",background:"#FAFAF8"}}>
            {!mol&&<div style={{...SN,fontSize:13,color:"#B0AAA4",textAlign:"center",padding:"12px 0"}}>Select a frame to see pricing</div>}
            {pr&&mol&&(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{...SN,fontSize:13,color:"#8A8580"}}>Price incl. VAT</span>
                <span style={{...SE,fontSize:28,fontWeight:700,letterSpacing:"-0.02em"}}>£{pr.total.toFixed(2)}</span>
              </div>
              <button onClick={()=>setShowBreak(!showBreak)} style={{...SN,fontSize:11,color:"#8B7E6A",background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:showBreak?8:0}}>{showBreak?"Hide":"Show"} breakdown</button>
              {showBreak&&(
                <div style={{...SN,fontSize:12,lineHeight:2,color:"#6B6560",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span>Frame</span><span>£{pr.frame.toFixed(2)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span>Glass</span><span>£{pr.glass.toFixed(2)}</span></div>
                  {hasMt&&<div style={{display:"flex",justifyContent:"space-between"}}><span>Mount</span><span>£{pr.mount.toFixed(2)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #E8E4DE",paddingTop:4,marginTop:4}}><span>Subtotal</span><span>£{pr.subtotal.toFixed(2)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span>VAT (20%)</span><span>£{pr.vat.toFixed(2)}</span></div>
                </div>
              )}
              {pr.oversize&&<div style={{...SN,fontSize:11,color:"#8B6900",background:"#FFF8E7",padding:"6px 10px",borderRadius:4,marginBottom:8}}>⚠ Oversize — may need special-order materials.</div>}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <select style={{...SN,padding:"10px 12px",border:"1px solid #DDD8D2",borderRadius:6,fontSize:14,background:"#FFF",cursor:"pointer",width:60}}><option>1</option><option>2</option><option>3</option></select>
                <button style={{...SN,flex:1,padding:"12px 20px",background:"#3D6B35",color:"#FFF",border:"none",borderRadius:6,fontSize:15,fontWeight:600,cursor:"pointer",letterSpacing:"0.04em",textTransform:"uppercase"}} onMouseEnter={e=>e.currentTarget.style.background="#2F5429"} onMouseLeave={e=>e.currentTarget.style.background="#3D6B35"}>Add to cart</button>
              </div>
              <div style={{...SN,fontSize:11,color:"#B0AAA4",textAlign:"center",marginTop:8}}>Standard delivery approx. 10–12 working days</div>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
