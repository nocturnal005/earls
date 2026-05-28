const sharp = require('sharp');

async function scanLines() {
  const imgPath = 'configurator/public/mouldings/strips/ECON_0055_strip.png';
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  
  let topWhiteLines = 0;
  for (let y = 0; y < h; y++) {
    let allWhite = true;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx+3] === 0 || (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230)) {
         // white or transparent
      } else {
         allWhite = false;
         break;
      }
    }
    if (allWhite) topWhiteLines++;
    else break;
  }
  
  let bottomWhiteLines = 0;
  for (let y = h - 1; y >= 0; y--) {
    let allWhite = true;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx+3] === 0 || (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230)) {
         // white or transparent
      } else {
         allWhite = false;
         break;
      }
    }
    if (allWhite) bottomWhiteLines++;
    else break;
  }
  
  console.log(`Top white lines: ${topWhiteLines}, Bottom white lines: ${bottomWhiteLines}`);
}
scanLines();
