const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const stripsDir = path.join(__dirname, '../configurator/public/mouldings/strips');

async function run() {
  const files = fs.readdirSync(stripsDir);
  for (const file of files) {
    if (!file.endsWith('.png')) continue;

    const filePath = path.join(stripsDir, file);
    try {
      const metadata = await sharp(filePath).metadata();
      const isVertical = file.includes('_strip_v');
      
      // We want to shave 2 pixels off the inner edge
      // _strip.png (horizontal): inner edge is BOTTOM (so we crop bottom 2px, height becomes height-2)
      // _strip_v.png (vertical): inner edge is RIGHT (so we crop right 2px, width becomes width-2)
      
      const tmpPath = filePath + '.tmp.png';

      if (isVertical) {
        if (metadata.width > 2) {
          await sharp(filePath)
            .extract({ left: 0, top: 0, width: metadata.width - 2, height: metadata.height })
            .toFile(tmpPath);
          fs.renameSync(tmpPath, filePath);
          console.log(`Cropped 2px from RIGHT of ${file}`);
        }
      } else {
        if (metadata.height > 2) {
          await sharp(filePath)
            .extract({ left: 0, top: 0, width: metadata.width, height: metadata.height - 2 })
            .toFile(tmpPath);
          fs.renameSync(tmpPath, filePath);
          console.log(`Cropped 2px from BOTTOM of ${file}`);
        }
      }
    } catch (e) {
      console.error(`Error on ${file}: ${e.message}`);
    }
  }
  console.log('All strips cropped!');
}

run();
