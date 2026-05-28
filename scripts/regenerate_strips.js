const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const srcDir = 'configurator/public/mouldings';
const outDir = 'configurator/public/mouldings/strips';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  for (const file of files) {
    if (file.includes('_strip')) continue;
    const name = path.parse(file).name;
    const srcPath = path.join(srcDir, file);
    
    try {
      let img = sharp(srcPath);
      const metadata = await img.metadata();
      
      if (metadata.hasAlpha) {
        img = img.trim({ threshold: 40 });
      } else {
        img = img.trim({
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          threshold: 40
        });
      }
      
      // Get the trimmed image as a PNG buffer
      const encodedBuffer = await img.png().toBuffer();
      const trimmedMeta = await sharp(encodedBuffer).metadata();
      
      const width = trimmedMeta.width;
      const height = trimmedMeta.height;
      
      let cropLeft = 2;
      let cropTop = 0;
      let cropWidth = width;
      let cropHeight = height;
      
      // If the stick is somehow horizontal (width > height), the inner lip might be at the top or bottom.
      // But the original script cropped from the left. Let's assume most are vertical.
      if (width > height) {
         // horizontal stick. Inner lip is usually top or bottom.
         // Wait, original processMouldings.js scanned X-axis from Y=height-2.
         // If it's horizontal, it just cropped the left edge, not the lip.
         // We will just do a standard trim, and maybe no 2px safety crop, or just 2px from top/bottom?
         // Let's just crop 2px from all sides if horizontal, to be safe.
         cropLeft = 2;
         cropTop = 2;
         cropWidth = Math.max(1, width - 4);
         cropHeight = Math.max(1, height - 4);
      } else {
         cropWidth = Math.max(1, width - 2);
      }
      
      const baseImgBuffer = await sharp(encodedBuffer)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .png()
        .toBuffer();
        
      if (width > height) {
        // If it's a horizontal stick (e.g. ECON_0012)
        // _strip.png (Top/Bottom) should be horizontal. So save directly.
        await sharp(baseImgBuffer).toFile(path.join(outDir, `${name}_strip.png`));
        // _strip_v.png (Left/Right) should be vertical. So rotate 90.
        await sharp(baseImgBuffer).rotate(90).toFile(path.join(outDir, `${name}_strip_v.png`));
      } else {
        // Normal vertical stick
        // _strip_v.png (Left/Right) should be vertical. Save directly.
        await sharp(baseImgBuffer).toFile(path.join(outDir, `${name}_strip_v.png`));
        // _strip.png (Top/Bottom) should be horizontal. Rotate 270.
        await sharp(baseImgBuffer).rotate(270).toFile(path.join(outDir, `${name}_strip.png`));
      }
      
      console.log(`Processed ${name}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

run();
