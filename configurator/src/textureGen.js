// Canvas-based texture generation for realistic frame mouldings and mount boards

const cache = new Map();

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function clamp(v, lo = 0, hi = 255) {
  return v < lo ? lo : v > hi ? hi : v;
}

// ── Noise primitives ──────────────────────────────────────────────────

function hash(x, y) {
  let h = ((x | 0) * 374761393 + (y | 0) * 668265263) >>> 0;
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  return h / 4294967296;
}

function smoothNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  return (
    hash(ix, iy) * (1 - sx) * (1 - sy) +
    hash(ix + 1, iy) * sx * (1 - sy) +
    hash(ix, iy + 1) * (1 - sx) * sy +
    hash(ix + 1, iy + 1) * sx * sy
  );
}

function fbm(x, y, octaves = 4) {
  let v = 0, a = 0.5;
  for (let i = 0; i < octaves; i++) {
    v += a * smoothNoise(x, y);
    x *= 2.03; y *= 2.03; a *= 0.5;
  }
  return v;
}


// ── Region renderer ───────────────────────────────────────────────────

function renderRegion(W, H, pathFn, baseR, baseG, baseB, noiseFn, gradFn) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  ctx.beginPath();
  pathFn(ctx);
  ctx.closePath();
  ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
  ctx.fill();

  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (d[i + 3] === 0) continue;
      const delta = noiseFn(x, y);
      d[i]     = clamp(d[i] + delta);
      d[i + 1] = clamp(d[i + 1] + delta);
      d[i + 2] = clamp(d[i + 2] + delta);
    }
  }
  ctx.putImageData(img, 0, 0);

  if (gradFn) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradFn(ctx);
    ctx.fillRect(0, 0, W, H);
  }

  return c;
}


// ── Moulding corner generator ─────────────────────────────────────────

const MLD_W = 160, MLD_H = 136;

export function generateMouldingCorner(hex, widthMm = 24, finish = 'Matt') {
  const key = `mld-${hex}-${widthMm}-${finish}`;
  if (cache.has(key)) return cache.get(key);

  const W = MLD_W, H = MLD_H;
  const [r, g, b] = hexToRgb(hex);

  const cx = W / 2;
  const tipY = H * 0.97;
  const bvH = W * 0.11;
  const bvD = H * 0.20;
  const tipInY = tipY - bvD;
  const arm = Math.min(W * 0.35, Math.max(W * 0.17, widthMm * 0.009 * W));

  const lO = cx - bvH - arm, lI = cx - bvH;
  const rI = cx + bvH, rO = cx + bvH + arm;

  const leftPath = (ctx) => {
    ctx.moveTo(lO, 0); ctx.lineTo(lI, 0);
    ctx.lineTo(cx, tipInY); ctx.lineTo(cx, tipY);
  };
  const rightPath = (ctx) => {
    ctx.moveTo(rI, 0); ctx.lineTo(rO, 0);
    ctx.lineTo(cx, tipY); ctx.lineTo(cx, tipInY);
  };
  const bevelPath = (ctx) => {
    ctx.moveTo(lI, 0); ctx.lineTo(rI, 0);
    ctx.lineTo(cx, tipInY);
  };

  const isWood = finish === 'Stained' || finish === 'Open Grain';
  const isCushion = finish === 'Cushion';
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  const brightBias = luminance < 0.25 ? 8 : 0;

  function makeNoiseFn(side) {
    return (x, y) => {
      let n = (fbm(x * 0.12, y * 0.12, 3) - 0.5);

      if (isWood) {
        const angle = side === 'left' ? -0.85 : 0.85;
        const gx = x * Math.cos(angle) - y * Math.sin(angle);
        const warp = fbm(x * 0.015, y * 0.015, 2) * 6;
        const grain = Math.sin(gx * 0.25 + warp);
        n = n * 0.3 + grain * 0.35;
        if (finish === 'Open Grain') {
          n += (fbm(x * 0.4 + 200, y * 0.08 + 200, 2) - 0.5) * 0.3;
        }
        return n * 55 + brightBias;
      }

      if (isCushion) {
        const across = side === 'left'
          ? (x - lO) / (arm + bvH)
          : (rO - x) / (arm + bvH);
        const curve = Math.sin(Math.max(0, Math.min(1, across)) * Math.PI);
        return n * 16 + curve * 12 + brightBias;
      }

      return n * 16 + brightBias;
    };
  }

  function leftGrad(ctx) {
    const g = ctx.createLinearGradient(lO, 0, cx, tipY);
    g.addColorStop(0, 'rgba(255,255,255,0.24)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.03)');
    g.addColorStop(1, 'rgba(0,0,0,0.16)');
    return g;
  }
  function rightGrad(ctx) {
    const g = ctx.createLinearGradient(rO, 0, cx, tipY);
    g.addColorStop(0, 'rgba(255,255,255,0.06)');
    g.addColorStop(0.25, 'rgba(0,0,0,0.04)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.10)');
    g.addColorStop(1, 'rgba(0,0,0,0.24)');
    return g;
  }
  function bevelGradFn(ctx) {
    const g = ctx.createLinearGradient(cx, 0, cx, tipInY);
    g.addColorStop(0, 'rgba(255,255,255,0.12)');
    g.addColorStop(0.5, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.10)');
    return g;
  }

  const rD = Math.round(r * 0.86), gD = Math.round(g * 0.86), bD = Math.round(b * 0.86);

  const leftC  = renderRegion(W, H, leftPath, r, g, b, makeNoiseFn('left'), leftGrad);
  const rightC = renderRegion(W, H, rightPath, rD, gD, bD, makeNoiseFn('right'), rightGrad);

  const bevelNoise = (x, y) => (fbm(x * 0.18, y * 0.18, 3) - 0.5) * 22;
  const bevelC = renderRegion(W, H, bevelPath, 235, 230, 222, bevelNoise, bevelGradFn);

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(leftC, 0, 0);
  ctx.drawImage(rightC, 0, 0);
  ctx.drawImage(bevelC, 0, 0);

  // Outer edge highlights
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(255,255,255,0.32)';
  ctx.beginPath(); ctx.moveTo(lO, 1); ctx.lineTo(cx, tipY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lO + 0.5, 0.8); ctx.lineTo(lI - 0.5, 0.8); ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.14)';
  ctx.beginPath(); ctx.moveTo(rO, 1); ctx.lineTo(cx, tipY); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.beginPath(); ctx.moveTo(rI + 0.5, 0.8); ctx.lineTo(rO - 0.5, 0.8); ctx.stroke();

  // Bevel inner edges — bright highlights
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(lI, 0.5); ctx.lineTo(cx, tipInY); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.40)';
  ctx.beginPath(); ctx.moveTo(rI, 0.5); ctx.lineTo(cx, tipInY); ctx.stroke();

  // Miter joint shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, tipInY); ctx.lineTo(cx, tipY); ctx.stroke();

  const url = canvas.toDataURL('image/png');
  cache.set(key, url);
  return url;
}


// ── Paper texture for mount board swatches ────────────────────────────

let paperUrl = null;

export function getPaperTextureUrl() {
  if (paperUrl) return paperUrl;

  const S = 120;
  const canvas = document.createElement('canvas');
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, S, S);

  const img = ctx.getImageData(0, 0, S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const fibre = fbm(x * 0.22, y * 0.22, 3);
      const dir   = fbm(x * 0.06 + 50, y * 0.5 + 50, 2);
      const speck = hash(x * 3, y * 3) > 0.97 ? 0.15 : 0;
      const combined = fibre * 0.45 + dir * 0.4 + speck + 0.075;
      const val = Math.round(128 + (combined - 0.5) * 50);
      d[i] = d[i + 1] = d[i + 2] = clamp(val);
    }
  }

  ctx.putImageData(img, 0, 0);
  paperUrl = canvas.toDataURL('image/png');
  return paperUrl;
}
