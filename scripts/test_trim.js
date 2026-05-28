const sharp = require('sharp');

async function testTrim() {
  const imgPath = 'C:/Users/44755/Desktop/earls works/Everyday — Missing image field AND no file on disk (8 frames)/ECON_0055.jpg';
  try {
    const info = await sharp(imgPath)
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        threshold: 30 // Allow some variance for shadows/noise
      })
      .toFile('test_trimmed.jpg');
    console.log(info);
  } catch (e) {
    console.error(e);
  }
}
testTrim();
