const { Jimp, intToRGBA } = require('jimp');
const fs = require('fs');
const path = require('path');

const premiumDir = 'C:\\Users\\44755\\Desktop\\earls works\\Premium — Missing image field AND no file on disk (18 frames)';
const everydayDir = 'C:\\Users\\44755\\Desktop\\earls works\\Everyday — Missing image field AND no file on disk (8 frames)';
const outputDir = 'C:\\Users\\44755\\Desktop\\earls\\configurator\\public\\mouldings';

// Helper to determine if a pixel is "white/transparent" background
// We check if r, g, b are all very high (e.g., > 240)
function isBackground(rgba) {
  const { r, g, b, a } = rgba;
  if (a < 10) return true; // Transparent
  if (r > 240 && g > 240 && b > 240) return true; // White
  return false;
}

// Find the X coordinate where the cross-section ends
// We scan the bottom row (y = height - 1) from x = 0.
// While it's white, we are in the rabbet cut-out.
// When it stops being white, we've hit the inner lip of the frame.
function findCropStartX(image) {
  const y = image.bitmap.height - 2; // Check near the bottom edge
  
  for (let x = 0; x < image.bitmap.width; x++) {
    const hex = image.getPixelColor(x, y);
    const rgba = intToRGBA(hex);
    
    if (!isBackground(rgba)) {
      return x;
    }
  }
  
  return 0; // Fallback
}

// Extract the target code filename from the messy filename
function extractCode(filename) {
  // Most files end with _CODE.jpg or _CODE_XX.jpg. Let's just find the part before the extension that matches our DB
  // Actually, wait! All images in the database are named `[CODE].jpg` where `[CODE]` matches exactly the end of the filename!
  // E.g. "Silver Scoop with silver edge _CAPR_0010.jpg" -> "CAPR_0010.jpg"
  // Let's use a regex that captures everything after the last space, underscore, or just takes the whole thing if it's already a code.
  
  // Clean up: remove the extension
  let base = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  
  // Find the last chunk of uppercase letters/numbers separated by underscores
  const match = base.match(/[A-Z0-9]+(?:_[A-Z0-9]+)*(?:_S)?$/i);
  if (match) {
    return match[0] + path.extname(filename).toLowerCase();
  }
  
  // Fallback: just return the filename itself (it might already be perfect like "ECON_0055.jpg")
  return filename;
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const inputPath = path.join(dir, file);
    let targetFilename = extractCode(file);
    
    // Some special edge cases for the filenames seen in the list
    if (file === "Antique Wood with Gold Line _000S_21.jpg") targetFilename = "000S_21.jpg";
    if (file === "Brushed gold BRISTOL_09.jpg") targetFilename = "BRISTOL_09.jpg";
    if (file === "Brushed gold _BRISTOL_0007.jpg") targetFilename = "BRISTOL_0007.jpg";
    if (file === "Ovaloe Brushed Gold_ 5401_6018.jpg") targetFilename = "5401_6018.jpg";
    if (file === "Ovaloe Brushed Silver _5403_7018.jpg") targetFilename = "5403_7018.jpg";
    if (file === "distressed silver leaf_860A_3_S.jpg") targetFilename = "860A_3_S.jpg";
    if (file === "reverse silver leaf_000S_926.jpg") targetFilename = "000S_926.jpg";
    
    // Ensure we always save as jpg
    targetFilename = targetFilename.replace(/\.png$/i, '.jpg');

    const outputPath = path.join(outputDir, targetFilename);

    console.log(`Processing ${file} -> ${targetFilename}...`);

    try {
      const image = await Jimp.read(inputPath);
      
      const startX = findCropStartX(image);
      const cropWidth = image.bitmap.width - startX;
      
      if (startX > 0 && startX < image.bitmap.width * 0.5) {
         console.log(`  Cropping out cross-section at X=${startX}`);
         image.crop(startX, 0, cropWidth, image.bitmap.height);
      } else {
         console.log(`  Could not reliably detect cross-section (StartX=${startX}). Leaving intact.`);
      }
      
      // Rotate 90 degrees counter-clockwise (270 degrees clockwise)
      image.rotate(270);
      
      await image.write(outputPath);
      console.log(`  Saved to ${outputPath}`);
    } catch (err) {
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }
}

async function run() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  await processDirectory(premiumDir);
  await processDirectory(everydayDir);
  console.log("Done!");
}

run();
