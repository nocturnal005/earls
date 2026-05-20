// Utility to dynamically crop white margins from frame moulding images using HTML5 Canvas
const cropCache = new Map();

export function cropFrameImage(imageUrl) {
  if (cropCache.has(imageUrl)) {
    return Promise.resolve(cropCache.get(imageUrl));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const W = img.width;
      const H = img.height;

      // 1. Draw image to temp canvas
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, W, H);
      } catch (e) {
        // Fallback if cross-origin security blocks read
        console.warn('Canvas pixel read blocked by CORS. Using original image.');
        resolve(imageUrl);
        return;
      }

      const data = imgData.data;

      // Threshold: pixels with R, G, B all > 245 are considered white background
      const isWhite = (idx) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        // Transparent pixels or very bright off-white pixels
        return a < 15 || (r > 245 && g > 245 && b > 245);
      };

      // 2. Scan columns from Left to Right to find left crop bound
      let cropLeft = 0;
      for (let x = 0; x < W; x++) {
        let allWhite = true;
        for (let y = 0; y < H; y++) {
          const idx = (y * W + x) * 4;
          if (!isWhite(idx)) {
            allWhite = false;
            break;
          }
        }
        if (!allWhite) {
          cropLeft = x;
          break;
        }
      }

      // 3. Scan columns from Right to Left to find right crop bound
      let cropRight = W;
      for (let x = W - 1; x >= cropLeft; x--) {
        let allWhite = true;
        for (let y = 0; y < H; y++) {
          const idx = (y * W + x) * 4;
          if (!isWhite(idx)) {
            allWhite = false;
            break;
          }
        }
        if (!allWhite) {
          cropRight = x + 1;
          break;
        }
      }

      // 4. Scan rows from Top to Bottom to find top crop bound
      let cropTop = 0;
      for (let y = 0; y < H; y++) {
        let allWhite = true;
        for (let x = cropLeft; x < cropRight; x++) {
          const idx = (y * W + x) * 4;
          if (!isWhite(idx)) {
            allWhite = false;
            break;
          }
        }
        if (!allWhite) {
          cropTop = y;
          break;
        }
      }

      // 5. Scan rows from Bottom to Top to find bottom crop bound
      let cropBottom = H;
      for (let y = H - 1; y >= cropTop; y--) {
        let allWhite = true;
        for (let x = cropLeft; x < cropRight; x++) {
          const idx = (y * W + x) * 4;
          if (!isWhite(idx)) {
            allWhite = false;
            break;
          }
        }
        if (!allWhite) {
          cropBottom = y + 1;
          break;
        }
      }

      const finalW = cropRight - cropLeft;
      const finalH = cropBottom - cropTop;

      // If cropping result is valid and changed
      if (finalW > 0 && finalH > 0 && (finalW < W || finalH < H)) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = finalW;
        cropCanvas.height = finalH;
        const cropCtx = cropCanvas.getContext('2d');
        
        cropCtx.drawImage(
          canvas,
          cropLeft, cropTop, finalW, finalH,
          0, 0, finalW, finalH
        );

        const croppedUrl = cropCanvas.toDataURL('image/png');
        cropCache.set(imageUrl, croppedUrl);
        resolve(croppedUrl);
      } else {
        // Fallback to original if no crop borders found
        cropCache.set(imageUrl, imageUrl);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      console.error('Failed to load frame image for cropping:', imageUrl);
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
}
