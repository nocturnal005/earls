const sharp = require('sharp');

async function scanOriginal() {
  const imgPath = 'C:/Users/44755/Desktop/earls works/Everyday — Missing image field AND no file on disk (8 frames)/ECON_0055.jpg';
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  
  let topWhite = 0;
  for (let y = 0; y < h; y++) {
    let allWhite = true;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230) {} else { allWhite = false; break; }
    }
    if (allWhite) topWhite++; else break;
  }
  
  let bottomWhite = 0;
  for (let y = h - 1; y >= 0; y--) {
    let allWhite = true;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230) {} else { allWhite = false; break; }
    }
    if (allWhite) bottomWhite++; else break;
  }

  let leftWhite = 0;
  for (let x = 0; x < w; x++) {
    let allWhite = true;
    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230) {} else { allWhite = false; break; }
    }
    if (allWhite) leftWhite++; else break;
  }

  let rightWhite = 0;
  for (let x = w - 1; x >= 0; x--) {
    let allWhite = true;
    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 230 && data[idx+1] > 230 && data[idx+2] > 230) {} else { allWhite = false; break; }
    }
    if (allWhite) rightWhite++; else break;
  }
  
  console.log(`Original White lines: Top: ${topWhite}, Bottom: ${bottomWhite}, Left: ${leftWhite}, Right: ${rightWhite}`);
}
scanOriginal();
