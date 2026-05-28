const sharp = require('sharp');
async function run() {
  const img = sharp('C:/Users/44755/.gemini/antigravity/brain/b6cbf895-28e8-4464-aca7-503380855ab1/scratch/econ75_100.png').resize(4, 4);
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < 4; y++) {
    let row = '';
    for (let x = 0; x < 4; x++) {
      const idx = (y * 4 + x) * 3;
      row += `[${data[idx]},${data[idx+1]},${data[idx+2]}] `;
    }
    console.log(row);
  }
}
run();
