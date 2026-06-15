// Prepares a customer's uploaded photo for the configurator.
//
// IMPORTANT: the ORIGINAL file is kept untouched and used as the print-quality
// source sent to the framer. We only build a lightweight, EXIF-corrected,
// downscaled copy for on-screen preview + html2canvas capture — so a 12MP phone
// photo doesn't jank the preview or bloat the basket, while print quality is
// never degraded.

const MAX_BYTES = 30 * 1024 * 1024;   // reject absurdly large uploads (30 MB)
const MAX_PREVIEW_PX = 2000;          // longest edge of the on-screen preview

export async function prepareUpload(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, HEIC, etc.).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('That image is over 30 MB — please upload a smaller file.');
  }

  let previewUrl;
  try {
    previewUrl = await buildPreview(file);
  } catch {
    // If anything goes wrong, fall back to the original (heavier, but works).
    previewUrl = URL.createObjectURL(file);
  }

  return { previewUrl, originalFile: file };
}

async function buildPreview(file) {
  const bitmap = await decode(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_PREVIEW_PX / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  if (bitmap.close) bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.9);
}

// createImageBitmap with imageOrientation applies EXIF rotation (phone photos
// upright); falls back to a plain <img> where unsupported.
async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      try { return await createImageBitmap(file); } catch { /* fall through */ }
    }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
    img.src = url;
  });
}
