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

      // Noise-tolerant threshold: pixels with R, G, B all > 230 are considered white/light-grey background
      const isWhite = (idx) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        // Transparent pixels or very bright background pixels
        return a < 15 || (r > 230 && g > 230 && b > 230);
      };

      // To find the vertical moulding bar of L-shaped corner samples, we scan columns
      // using only the top 30% of the image (completely bypassing bottom horizontal bars/floors).
      const scanHeight = Math.max(20, Math.floor(H * 0.30));

      // 2. Scan columns from Left to Right (in top region) to find left crop bound
      let cropLeft = 0;
      for (let x = 0; x < W; x++) {
        let allWhite = true;
        for (let y = 0; y < scanHeight; y++) {
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

      // 3. Scan columns from Right to Left (in top region) to find right crop bound
      let cropRight = W;
      for (let x = W - 1; x >= cropLeft; x--) {
        let allWhite = true;
        for (let y = 0; y < scanHeight; y++) {
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

      // 4. Scan rows from Top to Bottom to find where the moulding actually starts (cropTop)
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

      // 5. Scan rows from Bottom to Top to find where the moulding ends (cropBottom)
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

      // Calculate physical moulding height in the image
      const mouldingH = cropBottom - cropTop;

      // 6. Crop ONLY the top 15% of the physical moulding height.
      // This isolates the pure face texture (e.g., gold veneer) and completely excludes 
      // the cut profile section (beige wood cross-section) located at the bottom of the moulding sample.
      const segmentHeight = Math.max(15, Math.floor(mouldingH * 0.15));
      const finalW = cropRight - cropLeft;
      const finalH = segmentHeight;

      // If cropping result is valid and represents a meaningful crop
      if (finalW > 0 && finalH > 0 && finalW < W) {
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
        // Fallback to original if no crop bounds found
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
