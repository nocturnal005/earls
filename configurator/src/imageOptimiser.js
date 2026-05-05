/**
 * Earl's Image Optimiser — Canvas-based pixel processing engine
 * 
 * Performs three key operations at a given intensity (0–1):
 *  1. Color richness & depth   — Adaptive saturation boost
 *  2. Brightness & color balance — Per-channel histogram stretch (auto-levels)
 *  3. Shadow detail enhancement — Selective shadow lifting
 */

/**
 * Process an image URL through the optimisation pipeline.
 * Returns a data-URL of the processed image.
 *
 * @param {string} src        — image source URL
 * @param {number} intensity  — 0 to 1 (maps to 0–100% slider)
 * @param {AbortSignal} [signal] — optional abort signal
 * @returns {Promise<string>} — data URL of optimised image
 */
export async function optimiseImage(src, intensity, signal) {
  const img = await loadImage(src, signal);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // --- 1. Auto-levels: per-channel histogram stretch ---
  autoLevels(data, intensity);

  // --- 2. Shadow detail enhancement ---
  enhanceShadows(data, intensity);

  // --- 3. Color richness & depth (saturation boost) ---
  boostSaturation(data, intensity);

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.92);
}

/* ── Load an image as a promise ── */
function loadImage(src, signal) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    if (signal) signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    img.src = src;
  });
}

/* ── 1. Auto-Levels: stretch each channel's histogram to full 0-255 range ── */
function autoLevels(data, intensity) {
  // Find per-channel min/max (ignore bottom/top 0.5% for robustness)
  const histR = new Uint32Array(256);
  const histG = new Uint32Array(256);
  const histB = new Uint32Array(256);
  const total = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    histR[data[i]]++;
    histG[data[i + 1]]++;
    histB[data[i + 2]]++;
  }

  const clip = Math.floor(total * 0.005); // 0.5% clipping

  function findRange(hist) {
    let lo = 0, hi = 255, sum = 0;
    for (let i = 0; i < 256; i++) { sum += hist[i]; if (sum > clip) { lo = i; break; } }
    sum = 0;
    for (let i = 255; i >= 0; i--) { sum += hist[i]; if (sum > clip) { hi = i; break; } }
    return [lo, hi];
  }

  const [rLo, rHi] = findRange(histR);
  const [gLo, gHi] = findRange(histG);
  const [bLo, bHi] = findRange(histB);

  // Build lookup tables (LUT) for each channel
  function buildLUT(lo, hi) {
    const lut = new Uint8Array(256);
    const range = Math.max(hi - lo, 1);
    for (let i = 0; i < 256; i++) {
      const stretched = ((i - lo) / range) * 255;
      const clamped = Math.max(0, Math.min(255, stretched));
      // Blend between original and stretched based on intensity
      lut[i] = Math.round(i + (clamped - i) * intensity);
    }
    return lut;
  }

  const lutR = buildLUT(rLo, rHi);
  const lutG = buildLUT(gLo, gHi);
  const lutB = buildLUT(bLo, bHi);

  for (let i = 0; i < data.length; i += 4) {
    data[i]     = lutR[data[i]];
    data[i + 1] = lutG[data[i + 1]];
    data[i + 2] = lutB[data[i + 2]];
  }
}

/* ── 2. Shadow Enhancement: selectively lift dark regions ── */
function enhanceShadows(data, intensity) {
  // Only affects pixels with luminance < threshold
  // Uses a smooth curve so the effect tapers off naturally
  const threshold = 100; // Pixels darker than this get lifted
  const strength = intensity * 0.45; // Max shadow lift amount

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum < threshold) {
      // Smooth ramp: full effect at lum=0, zero effect at lum=threshold
      const t = 1.0 - (lum / threshold);
      const lift = t * t * strength * 255; // quadratic falloff

      data[i]     = Math.min(255, r + lift);
      data[i + 1] = Math.min(255, g + lift);
      data[i + 2] = Math.min(255, b + lift);
    }
  }
}

/* ── 3. Saturation Boost: increase color richness ── */
function boostSaturation(data, intensity) {
  const boost = 1.0 + intensity * 0.35; // Up to 35% more saturation at 100%

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i]     = Math.max(0, Math.min(255, Math.round(gray + (r - gray) * boost)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(gray + (g - gray) * boost)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(gray + (b - gray) * boost)));
  }
}
