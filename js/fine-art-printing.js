// js/fine-art-printing.js — Fine Art Printing Configurator
document.addEventListener('DOMContentLoaded', () => {
  // ── State ──
  const state = {
    step: 1, croppedImageURL: null, file: null,
    size: null, sizeLabel: '', paper: null, colour: 'original', border: 0,
    addFrame: false, frame: null, mount: 'none', mountColour: null, mountWidth: 'narrow', glass: null,
    printPrice: 0, paperPrice: 0, framePrice: 0, mountPrice: 0, glassPrice: 0, handlingPrice: 5
  };
  let cropper = null, papers = [], frames = [], pricing = {};

  // ── Print Sizes (reuse from Frame My Photo) ──
  const sizes = {
    metric: ['15×10','18×13','20×15','20×20','25×20','30×20','30×30','40×30','40×40','50×40','50×50','60×40','60×50','70×50','80×60','90×60','100×70','100×100'],
    imperial: ['6×4','7×5','8×6','8×8','10×8','12×8','12×10','12×12','14×10','14×11','16×12','16×16','18×12','20×16','20×20','24×16','24×20','30×20'],
    asize: ['A5','A4','A3','A2','A1','A0']
  };
  const sizeRatios = {
    '15×10':1.5,'18×13':1.385,'20×15':1.333,'20×20':1,'25×20':1.25,'30×20':1.5,'30×30':1,'40×30':1.333,
    '40×40':1,'50×40':1.25,'50×50':1,'60×40':1.5,'60×50':1.2,'70×50':1.4,'80×60':1.333,'90×60':1.5,
    '100×70':1.429,'100×100':1,'6×4':1.5,'7×5':1.4,'8×6':1.333,'8×8':1,'10×8':1.25,'12×8':1.5,
    '12×10':1.2,'12×12':1,'14×10':1.4,'14×11':1.273,'16×12':1.333,'16×16':1,'18×12':1.5,'20×16':1.25,
    '20×20':1,'24×16':1.5,'24×20':1.2,'30×20':1.5,
    'A5':1.414,'A4':1.414,'A3':1.414,'A2':1.414,'A1':1.414,'A0':1.414
  };

  // ── Load Data ──
  async function loadData() {
    try {
      const [papersRes, framesRes, pricingRes] = await Promise.all([
        fetch('/data/papers.json'), fetch('/api/frames'), fetch('/api/pricing')
      ]);
      papers = await papersRes.json();
      frames = await framesRes.json();
      pricing = await pricingRes.json();
      renderPapers(); renderFrames(); renderMountColours(); renderGlass();
    } catch(e) { console.error('Data load error:', e); }
  }

  // ── Step Navigation ──
  function goToStep(n) {
    document.querySelectorAll('.fap-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(n === 'success' ? 'fap-step-success' : `fap-step-${n}`);
    if (panel) panel.style.display = '';
    if (n !== 'success') state.step = n;

    // Update stepper
    document.querySelectorAll('.fap-step').forEach(s => {
      const sn = +s.dataset.step;
      s.classList.toggle('active', sn === n);
      s.classList.toggle('completed', sn < n);
    });
    document.querySelectorAll('.fap-step__line').forEach((line, i) => {
      line.classList.toggle('completed', i + 1 < n);
    });

    // Sync previews
    if (state.croppedImageURL) {
      ['fap-live-preview-img-2','fap-live-preview-img-3','fap-live-preview-img-4'].forEach(id => {
        const img = document.getElementById(id);
        if (img) img.src = state.croppedImageURL;
      });
    }
    applyColourFilter();
    applyBorderPreview();
    applyFramePreview();
    updatePricing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Upload ──
  const photoInput = document.getElementById('fap-photo-input');
  const uploadZone = document.getElementById('fap-upload-zone');
  const uploadPreview = document.getElementById('fap-upload-preview');

  photoInput?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    state.file = file;
    document.getElementById('fap-preview-filename').textContent = file.name;
    document.getElementById('fap-preview-filesize').textContent = (file.size / 1024 / 1024).toFixed(1) + ' MB';

    const reader = new FileReader();
    reader.onload = ev => {
      uploadZone.style.display = 'none';
      uploadPreview.style.display = '';
      const img = document.getElementById('fap-cropper-image');
      img.src = ev.target.result;
      if (cropper) cropper.destroy();
      cropper = new Cropper(img, { viewMode: 1, autoCropArea: 0.9, responsive: true, background: false });
      document.getElementById('fap-btn-next-1').disabled = false;
    };
    reader.readAsDataURL(file);
  });

  // Drag & drop
  uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor = 'var(--earls-red)'; });
  uploadZone?.addEventListener('dragleave', () => { uploadZone.style.borderColor = ''; });
  uploadZone?.addEventListener('drop', e => {
    e.preventDefault(); uploadZone.style.borderColor = '';
    if (e.dataTransfer.files[0]) { photoInput.files = e.dataTransfer.files; photoInput.dispatchEvent(new Event('change')); }
  });

  // Change photo
  document.getElementById('fap-btn-change-photo')?.addEventListener('click', () => {
    if (cropper) { cropper.destroy(); cropper = null; }
    uploadZone.style.display = ''; uploadPreview.style.display = 'none';
    photoInput.value = ''; document.getElementById('fap-btn-next-1').disabled = true;
  });

  // Crop controls
  document.getElementById('fap-btn-rotate-left')?.addEventListener('click', () => cropper?.rotate(-90));
  document.getElementById('fap-btn-rotate-right')?.addEventListener('click', () => cropper?.rotate(90));
  document.getElementById('fap-btn-flip-ratio')?.addEventListener('click', () => {
    if (!cropper) return;
    const d = cropper.getData(); cropper.setAspectRatio(d.height / d.width);
  });
  document.getElementById('fap-btn-reset-crop')?.addEventListener('click', () => cropper?.reset());

  // Size tabs
  document.getElementById('fap-size-tabs')?.addEventListener('click', e => {
    const tab = e.target.closest('.fmp-size-tab');
    if (!tab) return;
    document.querySelectorAll('#fap-size-tabs .fmp-size-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tabName = tab.dataset.tab;
    ['metric','imperial','asize','freeform'].forEach(t => {
      const el = document.getElementById(`fap-size-${t}`);
      if (el) el.style.display = t === tabName ? '' : 'none';
    });
    if (tabName === 'freeform' && cropper) { cropper.setAspectRatio(NaN); state.size = 'freeform'; state.sizeLabel = 'Freeform'; }
  });

  // Populate sizes
  function populateSizes() {
    Object.entries(sizes).forEach(([group, list]) => {
      const grid = document.getElementById(`fap-grid-${group}`);
      if (!grid) return;
      grid.innerHTML = list.map(s =>
        `<div class="fmp-size-card" data-size="${s}" data-group="${group}">${group === 'asize' ? s : s.replace('×',' × ')} ${group === 'metric' ? 'cm' : group === 'imperial' ? '"' : ''}</div>`
      ).join('');
    });
    document.querySelectorAll('#fap-step-1 .fmp-size-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#fap-step-1 .fmp-size-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.size = card.dataset.size; state.sizeLabel = card.textContent.trim();
        const ratio = sizeRatios[card.dataset.size];
        if (ratio && cropper) cropper.setAspectRatio(ratio);
      });
    });
  }

  // ── Papers ──
  function renderPapers() {
    const grid = document.getElementById('fap-paper-grid');
    if (!grid) return;
    grid.innerHTML = papers.map(p => `
      <div class="fap-paper-card" data-paper-id="${p.id}">
        <div class="fap-paper-card__badge"><span class="iconify" data-icon="lucide:check" data-width="14"></span></div>
        <div class="fap-paper-card__icon"><span class="iconify" data-icon="${p.icon}" data-width="32"></span></div>
        <div class="fap-paper-card__name">${p.name}</div>
        <div class="fap-paper-card__desc">${p.shortDesc}</div>
        <div class="fap-paper-card__price">From £${p.price.toFixed(2)}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.fap-paper-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.fap-paper-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.paper = papers.find(p => p.id === card.dataset.paperId);
        state.paperPrice = state.paper.price;
        document.getElementById('fap-btn-next-2').disabled = false;
        updatePricing();
      });
    });
  }

  // ── Colour Treatment ──
  document.getElementById('fap-colour-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.fap-colour-btn');
    if (!btn) return;
    document.querySelectorAll('.fap-colour-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.colour = btn.dataset.colour;
    applyColourFilter();
  });

  function applyColourFilter() {
    document.querySelectorAll('.fap-live-preview__print').forEach(el => {
      el.classList.remove('bw', 'sepia');
      if (state.colour === 'bw') el.classList.add('bw');
      if (state.colour === 'sepia') el.classList.add('sepia');
    });
  }

  // ── Border ──
  document.getElementById('fap-border-btns')?.addEventListener('click', e => {
    const btn = e.target.closest('.fap-border-btn');
    if (!btn) return;
    document.querySelectorAll('.fap-border-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.border = +btn.dataset.border;
    applyBorderPreview();
  });

  function applyBorderPreview() {
    const px = state.border * 1.5; // scale mm to preview px
    document.querySelectorAll('.fap-live-preview__print').forEach(el => {
      el.style.padding = px + 'px';
    });
  }

  // ── Frame Toggle ──
  document.getElementById('fap-frame-toggle')?.addEventListener('click', () => {
    const wrap = document.getElementById('fap-frame-toggle');
    const section = document.getElementById('fap-frame-section');
    state.addFrame = !state.addFrame;
    wrap.classList.toggle('active', state.addFrame);
    section.classList.toggle('visible', state.addFrame);
    if (!state.addFrame) { state.frame = null; state.framePrice = 0; state.mount = 'none'; state.mountPrice = 0; state.glass = null; state.glassPrice = 0; }
    applyFramePreview();
    updatePricing();
  });

  // ── Frames (reuse structure from Frame My Photo) ──
  function renderFrames() {
    const grid = document.getElementById('fap-frame-grid');
    if (!grid || !frames.length) return;
    renderFilteredFrames();
  }

  function renderFilteredFrames() {
    const colourMap = {
      'Black':'#1A1A1A','White':'#F5F5F5','Brown':'#5C4033','Natural':'#C4A970',
      'Gold':'#D4AF37','Silver':'#C0C0C0','Grey':'#8A8A8A','Green':'#4A7C59',
      'Blue':'#2C5F8A','Red':'#C41E1E','Pink':'#D4878F','Purple':'#6B4C7A','Yellow':'#C9A83E'
    };
    const grid = document.getElementById('fap-frame-grid');
    const colour = document.getElementById('fap-filter-colour')?.value || 'all';
    const material = document.getElementById('fap-filter-material')?.value || 'all';
    let filtered = frames.filter(f => {
      if (colour !== 'all' && f.colour !== colour) return false;
      if (material !== 'all' && f.material !== material) return false;
      return true;
    });
    document.getElementById('fap-frame-count').textContent = `Showing ${filtered.length} frames`;
    grid.innerHTML = filtered.map(f => {
      const hex = colourMap[f.colour] || '#8A8A8A';
      return `
      <div class="fmp-frame-card" data-frame-id="${f.id}">
        <div class="fmp-frame-card__swatch"><div class="fmp-frame-card__swatch-inner" style="background:${hex}"></div></div>
        <div class="fmp-frame-card__name">${f.name}</div>
        <div class="fmp-frame-card__meta">${f.material} · ${f.widthMm || 20}mm</div>
        <div class="fmp-frame-card__price">£${(f.retailPricePerMetre || 0).toFixed(2)}/m</div>
      </div>`;
    }).join('');
    grid.querySelectorAll('.fmp-frame-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.fmp-frame-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const fid = +card.dataset.frameId;
        state.frame = frames.find(f => f.id === fid);
        state.framePrice = state.frame ? (state.frame.retailPricePerMetre || 0) * 2 : 0; // ~2m perimeter estimate
        applyFramePreview(); updatePricing();
      });
    });
  }

  document.getElementById('fap-filter-colour')?.addEventListener('change', renderFilteredFrames);
  document.getElementById('fap-filter-material')?.addEventListener('change', renderFilteredFrames);

  function applyFramePreview() {
    const colourMap = {
      'Black':'#1A1A1A','White':'#F5F5F5','Brown':'#5C4033','Natural':'#C4A970',
      'Gold':'#D4AF37','Silver':'#C0C0C0','Grey':'#8A8A8A','Green':'#4A7C59',
      'Blue':'#2C5F8A','Red':'#C41E1E','Pink':'#D4878F'
    };
    document.querySelectorAll('.fap-live-preview__print').forEach(el => {
      if (state.addFrame && state.frame) {
        const w = state.frame.widthMm || 20;
        const px = Math.max(8, w * 0.8);
        const hex = colourMap[state.frame.colour] || '#333';
        el.style.border = `${px}px solid ${hex}`;
        el.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), inset 0 0 ${px/2}px rgba(0,0,0,0.15)`;
      } else {
        el.style.border = 'none';
        el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5)';
      }
    });
  }

  // ── Mount ──
  function renderMountColours() {
    const grid = document.getElementById('fap-mount-colour-grid');
    if (!grid || !pricing.mountColours) return;
    grid.innerHTML = pricing.mountColours.map(c =>
      `<div class="fmp-colour-swatch${c.id === 'white' ? ' selected' : ''}" data-colour-id="${c.id}" style="background:${c.hex}" title="${c.name}"></div>`
    ).join('');
    state.mountColour = pricing.mountColours[0];
    grid.querySelectorAll('.fmp-colour-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        grid.querySelectorAll('.fmp-colour-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        state.mountColour = pricing.mountColours.find(c => c.id === sw.dataset.colourId);
      });
    });
  }

  document.getElementById('fap-mount-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.fmp-mount-btn');
    if (!btn) return;
    document.querySelectorAll('#fap-mount-toggle .fmp-mount-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mount = btn.dataset.mount;
    const opts = document.getElementById('fap-mount-options');
    if (opts) opts.style.display = state.mount === 'none' ? 'none' : '';
    const mp = pricing.mounts?.[state.mount];
    state.mountPrice = mp ? (mp.basePrice || 0) : 0;
    if (state.mount !== 'none') {
      const wm = pricing.mountWidths?.[state.mountWidth];
      if (wm) state.mountPrice *= wm.multiplier;
    }
    updatePricing();
  });

  document.getElementById('fap-mount-width-btns')?.addEventListener('click', e => {
    const btn = e.target.closest('.fmp-width-btn');
    if (!btn) return;
    document.querySelectorAll('#fap-mount-width-btns .fmp-width-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mountWidth = btn.dataset.width;
    const mp = pricing.mounts?.[state.mount];
    state.mountPrice = mp ? (mp.basePrice || 0) : 0;
    const wm = pricing.mountWidths?.[state.mountWidth];
    if (wm) state.mountPrice *= wm.multiplier;
    updatePricing();
  });

  // ── Glass ──
  function renderGlass() {
    const list = document.getElementById('fap-glass-list');
    if (!list || !pricing.glass) return;
    list.innerHTML = pricing.glass.map(g => `
      <div class="fmp-glass-option" data-glass-id="${g.id}">
        <div class="fmp-glass-option__radio"></div>
        <div class="fmp-glass-option__info">
          <div class="fmp-glass-option__name">${g.name}</div>
          <div class="fmp-glass-option__desc">${g.description}</div>
        </div>
        <div class="fmp-glass-option__price">£${g.price.toFixed(2)}</div>
      </div>
    `).join('');
    list.querySelectorAll('.fmp-glass-option').forEach(opt => {
      opt.addEventListener('click', () => {
        list.querySelectorAll('.fmp-glass-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.glass = pricing.glass.find(g => g.id === opt.dataset.glassId);
        state.glassPrice = state.glass ? state.glass.price : 0;
        updatePricing();
      });
    });
  }

  // ── Pricing ──
  function updatePricing() {
    const printBase = state.paper ? state.paper.price : 0;
    let total = printBase + state.handlingPrice;
    if (state.addFrame) {
      total += state.framePrice + state.mountPrice + state.glassPrice;
    }
    state.printPrice = printBase;
    document.querySelectorAll('.fap-running-total').forEach(el => el.textContent = `£${total.toFixed(2)}`);

    // Summary (Step 4)
    const sizeText = state.sizeLabel || '—';
    document.getElementById('fap-summary-print').textContent = sizeText;
    document.getElementById('fap-summary-print-price').textContent = '';
    document.getElementById('fap-summary-paper').textContent = state.paper ? `${state.paper.name}${state.colour !== 'original' ? ' · ' + state.colour.toUpperCase() : ''}${state.border ? ' · ' + state.border + 'mm border' : ''}` : '—';
    document.getElementById('fap-summary-paper-price').textContent = state.paper ? `£${printBase.toFixed(2)}` : '—';

    const frameRow = document.getElementById('fap-summary-frame-row');
    const mountRow = document.getElementById('fap-summary-mount-row');
    const glassRow = document.getElementById('fap-summary-glass-row');

    if (state.addFrame) {
      frameRow.style.display = ''; mountRow.style.display = ''; glassRow.style.display = '';
      document.getElementById('fap-summary-frame').textContent = state.frame ? state.frame.name : '—';
      document.getElementById('fap-summary-frame-price').textContent = state.frame ? `£${state.framePrice.toFixed(2)}` : '—';
      document.getElementById('fap-summary-mount').textContent = state.mount === 'none' ? 'No Mount' : `${pricing.mounts[state.mount]?.label || state.mount}`;
      document.getElementById('fap-summary-mount-price').textContent = `£${state.mountPrice.toFixed(2)}`;
      document.getElementById('fap-summary-glass').textContent = state.glass ? state.glass.name : '—';
      document.getElementById('fap-summary-glass-price').textContent = state.glass ? `£${state.glassPrice.toFixed(2)}` : '—';
    } else {
      frameRow.style.display = 'none'; mountRow.style.display = 'none'; glassRow.style.display = 'none';
    }

    document.getElementById('fap-summary-total').textContent = `£${total.toFixed(2)}`;
    document.getElementById('fap-summary-photo-info').textContent = state.file ? state.file.name : '—';
    document.getElementById('fap-summary-dimensions').textContent = sizeText;
  }

  // ── Navigation Buttons ──
  document.getElementById('fap-btn-next-1')?.addEventListener('click', () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({ maxWidth: 2048, maxHeight: 2048 });
      state.croppedImageURL = canvas.toDataURL('image/jpeg', 0.9);
    }
    goToStep(2);
  });
  document.getElementById('fap-btn-next-2')?.addEventListener('click', () => goToStep(3));
  document.getElementById('fap-btn-next-3')?.addEventListener('click', () => goToStep(4));
  document.getElementById('fap-btn-back-2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('fap-btn-back-3')?.addEventListener('click', () => goToStep(2));
  document.getElementById('fap-btn-back-4')?.addEventListener('click', () => goToStep(3));

  // ── Pay Button ──
  document.getElementById('fap-btn-pay')?.addEventListener('click', async () => {
    const btn = document.getElementById('fap-btn-pay');
    btn.disabled = true; btn.textContent = 'Processing…';
    try {
      const items = [
        { name: `Fine Art Print — ${state.sizeLabel}`, description: state.paper?.name || 'Print', price: state.printPrice }
      ];
      if (state.addFrame && state.frame) items.push({ name: `Frame: ${state.frame.name}`, price: state.framePrice });
      if (state.addFrame && state.mountPrice > 0) items.push({ name: `Mount: ${pricing.mounts[state.mount]?.label}`, price: state.mountPrice });
      if (state.addFrame && state.glass) items.push({ name: `Glass: ${state.glass.name}`, price: state.glassPrice });
      items.push({ name: 'Crafting & Handling', price: state.handlingPrice });

      const res = await fetch('/api/create-checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, orderSummary: { size: state.sizeLabel, paper: state.paper?.name, colour: state.colour, border: state.border, frame: state.frame?.name, mount: state.mount } })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { goToStep('success'); }
    } catch(e) {
      console.error('Checkout error:', e);
      goToStep('success'); // Demo fallback
    }
  });

  // ── Payment success URL check ──
  if (window.location.search.includes('payment=success')) goToStep('success');

  // ── Init ──
  populateSizes();
  loadData();
});
