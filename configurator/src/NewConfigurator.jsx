import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  PRINT_SIZES, FRAME_CATALOGUE, MOUNT_COLOURS, COLOUR_GROUPS, MOUNT_TYPES,
  GLASS_OPTIONS, VGROOVE_COLOURS, MOUNT_WIDTHS,
  calcFramePrice, calcPrintPrice, calcMountPrice, calcGlassPrice,
} from './newData.js';
import {
  SizePrintSection, FrameSection, MountSection, GlassSection,
  MouldingCorner, MouldingThumb,
} from './newPanels.jsx';
import { useCart } from './CartContext.jsx';
import CartDrawer from './CartDrawer.jsx';
import CheckoutView from './CheckoutView.jsx';
import html2canvas from 'html2canvas';


const SECTIONS = [
  { id: 'size',  label: 'Size & Print' },
  { id: 'frame', label: 'Frame' },
  { id: 'mount', label: 'Mount' },
  { id: 'glass', label: 'Glass' },
];

const DEFAULT_SELECTIONS = {
  imageUrl: null,
  imageFile: null,
  sizeId: null,
  customW: null,
  customH: null,
  orientation: 'portrait',
  printType: 'poster',
  frameId: null,
  mountTypeId: 'plain',
  mountColourId: 'bright-white',
  mountColourId2: 'deep-black',
  mountWidthId: 'standard',
  customMountWidth: null,
  vGrooveColourId: null,
  glassId: 'standard',
  imageFit: 'fill',
};

const getInitialSelections = () => {
  if (typeof window === 'undefined') return DEFAULT_SELECTIONS;
  const params = new URLSearchParams(window.location.search);
  const printParam = params.get('printType');
  const validTypes = ['poster', 'art_paper', 'canvas', 'none'];
  if (printParam && validTypes.includes(printParam)) {
    return { ...DEFAULT_SELECTIONS, printType: printParam };
  }
  return DEFAULT_SELECTIONS;
};

export default function NewConfigurator() {
  const [selections, setSelections] = useState(getInitialSelections);
  const [openSection, setOpenSection] = useState('size');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [viewMode, setViewMode] = useState('detail');

  const { addToCart, cartTotalCount, setIsCartOpen } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  const update = useCallback((partial) => {
    setSelections(prev => ({ ...prev, ...partial }));
  }, []);

  // Hook into the main website's header cart button
  React.useEffect(() => {
    const btn = document.getElementById('header-cart-btn');
    const badge = document.getElementById('header-cart-count');
    
    if (btn) {
      const handleClick = (e) => {
        e.preventDefault();
        setIsCartOpen(true);
      };
      btn.addEventListener('click', handleClick);
      
      if (badge) {
        if (cartTotalCount > 0) {
          badge.style.display = 'flex';
          badge.textContent = cartTotalCount;
        } else {
          badge.style.display = 'none';
        }
      }
      
      return () => btn.removeEventListener('click', handleClick);
    }
  }, [cartTotalCount, setIsCartOpen]);

  const handleAddToCart = useCallback(async (pricingObj, currentFrame, sizeLabel) => {
    if (!pricingObj || pricingObj.total === 0) return;

    // Capture configured frame preview as image
    let configuredImage = null;
    const previewEl = document.querySelector('.preview-frame');
    if (previewEl) {
      try {
        const canvas = await html2canvas(previewEl, {
          backgroundColor: '#FFFFFF',
          scale: 4,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          logging: false,
        });
        configuredImage = canvas.toDataURL('image/png');
      } catch (e) {
        console.warn('Could not capture frame preview:', e);
      }
    }
    
    const cartItem = {
      frameName: currentFrame ? currentFrame.name : 'Unframed Print',
      dimensions: sizeLabel,
      mount: selections.mountTypeId !== 'none' ? MOUNT_COLOURS.find(m => m.id === selections.mountColourId)?.label || 'Mount' : null,
      price: pricingObj.total,
      image: configuredImage || selections.imageUrl || (currentFrame ? `${import.meta.env.BASE_URL}${currentFrame.image}` : null)
    };
    
    addToCart(cartItem);
    setToastMessage('Added to your basket');
    setTimeout(() => setToastMessage(''), 3000);
  }, [selections, addToCart]);

  const handleReset = useCallback(() => {
    setSelections(DEFAULT_SELECTIONS);
    setOpenSection('size');
    setShowBreakdown(false);
  }, []);

  const frame = FRAME_CATALOGUE.find(f => f.id === selections.frameId);
  const size = PRINT_SIZES.find(s => s.id === selections.sizeId);
  const mountColour = MOUNT_COLOURS.find(c => c.id === selections.mountColourId);
  const mountColour2 = MOUNT_COLOURS.find(c => c.id === selections.mountColourId2);
  const vGrooveColour = VGROOVE_COLOURS.find(c => c.id === selections.vGrooveColourId);
  const mountType = MOUNT_TYPES.find(m => m.id === selections.mountTypeId);
  const mountWidth = MOUNT_WIDTHS.find(mw => mw.id === selections.mountWidthId);
  const glass = GLASS_OPTIONS.find(g => g.id === selections.glassId);
  const isOvalOrRound = selections.mountTypeId === 'oval' || selections.mountTypeId === 'round';

  const isCustom = selections.sizeId === 'custom';
  const rawW = isCustom ? selections.customW : size?.w_cm;
  const rawH = isCustom ? selections.customH : size?.h_cm;
  const hasDims = rawW > 0 && rawH > 0;

  const [displayW, displayH] = useMemo(() => {
    if (!hasDims) return [3, 4];
    const w = rawW, h = rawH;
    if (selections.orientation === 'landscape') return w >= h ? [w, h] : [h, w];
    if (selections.orientation === 'portrait') return h >= w ? [w, h] : [h, w];
    return [w, h];
  }, [rawW, rawH, hasDims, selections.orientation]);

  const effW = hasDims ? displayW : null;
  const effH = hasDims ? displayH : null;

  const pricing = useMemo(() => {
    const round2 = n => Math.round(n * 100) / 100;
    const printPrice  = (!isCustom && selections.printType && size) ? (calcPrintPrice(selections.printType, selections.sizeId) || 0) : 0;
    const mountWidthMm = selections.mountWidthId === 'custom'
      ? (selections.customMountWidth || 0)
      : (MOUNT_WIDTHS.find(mw => mw.id === selections.mountWidthId)?.mm || 50);
    const framePrice  = (frame && effW) ? calcFramePrice(frame, effW, effH, selections.mountTypeId, mountWidthMm) : 0;
    const mountPrice  = (selections.mountTypeId !== 'none' && selections.printType !== 'canvas' && effW) ? calcMountPrice(selections.mountTypeId, effW, effH, mountWidthMm) : 0;
    const glassPrice  = (selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && effW) ? calcGlassPrice(selections.glassId, effW, effH, selections.mountTypeId, mountWidthMm) : 0;
    const total = printPrice + framePrice + mountPrice + glassPrice;
    return {
      printPrice: round2(printPrice), framePrice: round2(framePrice),
      mountPrice: round2(mountPrice), glassPrice: round2(glassPrice),
      total: round2(total),
    };
  }, [selections, frame, size, effW, effH, isCustom]);

  const previewScale = useMemo(() => {
    if (!hasDims) {
       // Detail view uses a large scale (25) to fill the screen.
       // Room view must use a smaller scale (8.5) so the empty placeholder doesn't explode to 600px and hit the sofa.
       return viewMode === 'detail' ? 25 : 8.5; 
    }
    const activeMountCm = selections.mountTypeId !== 'none' && selections.printType !== 'canvas'
      ? (selections.mountWidthId === 'custom' ? (selections.customMountWidth || 0) : (MOUNT_WIDTHS.find(mw => mw.id === selections.mountWidthId)?.mm || 50)) / 10 
      : 0;
    const frameCm = frame ? frame.widthMm / 10 : 0;
    
    const extraCmPerSide = activeMountCm + frameCm;
    const totalPhysicalWidthCm = displayW + (extraCmPerSide * 2);
    const totalPhysicalHeightCm = displayH + (extraCmPerSide * 2);
    const maxTotalDimCm = Math.max(totalPhysicalWidthCm, totalPhysicalHeightCm);

    if (viewMode === 'detail') {
       // Fit entire assembly within ~450px for detail view
       return Math.min(450 / maxTotalDimCm, 40); // Cap scale so tiny items don't blow up too much
    } else {
       // Fixed physical scale for room view so A4 looks small and A0 looks large.
       // 1.8 ensures realistic sizing against the room background.
       // We cap the max pixel height to 220px so it NEVER hits the sofa.
       const idealScale = 1.8;
       const maxAllowedHeightPx = 220;
       
       if (totalPhysicalHeightCm * idealScale > maxAllowedHeightPx) {
           return maxAllowedHeightPx / totalPhysicalHeightCm;
       }
       return idealScale;
    }
  }, [displayW, displayH, hasDims, viewMode, selections.mountTypeId, selections.mountWidthId, selections.printType, selections.customMountWidth, frame]);

  const frameColourHex = frame
    ? (COLOUR_GROUPS.find(c => c.id === frame.colour)?.hex || '#2D2D2D')
    : 'transparent';

  // Locked per-moulding face colour — no image-processing dependency
  const frameFaceHex = frame?.faceHex || frameColourHex;

  const [frameStripUrl, frameStripUrlV] = useMemo(() => {
    if (!frame?.image) return [null, null];
    const filename = frame.image.split('/').pop();
    const base = filename.replace(/\.[^.]+$/, '');
    const baseUrl = `${import.meta.env.BASE_URL}mouldings/strips/${base}`;
    return [`${baseUrl}_strip.png`, `${baseUrl}_strip_v.png`];
  }, [frame]);

  const framePx = frame ? Math.max(4, Math.round((frame.widthMm / 10) * previewScale)) : 0;
  const activeMountWidthMm = selections.mountWidthId === 'custom' 
      ? (selections.customMountWidth || 0) 
      : (MOUNT_WIDTHS.find(mw => mw.id === selections.mountWidthId)?.mm || 50);
  const mountPadPx = Math.max(0, Math.round((activeMountWidthMm / 10) * previewScale));

  const artworkWidthPx = Math.round(displayW * previewScale);
  const artworkHeightPx = Math.round(displayH * previewScale);

  const toggleSection = (id) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update({ imageUrl: url, imageFile: file });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      update({ imageUrl: url, imageFile: file });
    }
  };

  const sectionSummary = (id) => {
    switch (id) {
      case 'size': {
        const sizeLabel = isCustom && hasDims ? `Custom ${Math.round(effW)} × ${Math.round(effH)} cm` : size?.label || '';
        const printLabel = selections.printType === 'none' ? '' : selections.printType?.replace('_', ' ') || '';
        return sizeLabel ? `${sizeLabel} ${printLabel}`.trim() : '';
      }
      case 'frame': return frame ? `${frame.widthMm}mm ${frame.finish} ${COLOUR_GROUPS.find(c => c.id === frame.colour)?.label || ''}`.trim() : '';
      case 'mount': return mountType?.label || '';
      case 'glass': return glass?.label || '';
      default: return '';
    }
  };

  const sectionPrice = (id) => {
    switch (id) {
      case 'size': return pricing.printPrice;
      case 'frame': return pricing.framePrice;
      case 'mount': return pricing.mountPrice;
      case 'glass': return pricing.glassPrice;
      default: return 0;
    }
  };

  return (
    <>
      <CartDrawer />
      <CheckoutView />
      
      {toastMessage && (
        <div className="cart-toast">
          {toastMessage}
        </div>
      )}

      <div className="cfg">
        {/* LEFT — Preview */}
        <div className={`cfg__preview cfg__preview--${viewMode}`}>
          
          {/* Left Side Floating Elements */}
        <div className="left-floating-panel">
          <div className="preview-actions">
            {/* View Modes */}
            <button
              className={`action-item-btn ${viewMode === 'detail' ? 'active' : ''}`}
              onClick={() => setViewMode('detail')}
            >
              <div className="icon-wrapper">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="38,40 12,40 12,12 46,12 46,28" />
                  <polyline points="33,34 18,34 18,18 40,18 40,24" />
                  <line x1="12" y1="12" x2="18" y2="18" />
                  <line x1="46" y1="12" x2="40" y2="18" />
                  <line x1="12" y1="40" x2="18" y2="34" />
                  <circle cx="25" cy="24" r="1.5" />
                  <path d="M 18 34 L 26 26 L 31 31 L 36 26 L 38 28" />
                  <circle cx="44" cy="38" r="10" />
                  <circle cx="44" cy="38" r="6" />
                  <rect x="50" y="46" width="4" height="12" rx="2" transform="rotate(-45 52 52)" />
                  <rect x="12" y="46" width="24" height="6" rx="1" />
                  <line x1="16" y1="46" x2="16" y2="49" />
                  <line x1="20" y1="46" x2="20" y2="49" />
                  <line x1="24" y1="46" x2="24" y2="50" />
                  <line x1="28" y1="46" x2="28" y2="49" />
                  <line x1="32" y1="46" x2="32" y2="49" />
                </svg>
              </div>
              <span>Detail View</span>
            </button>

            <button
              className={`action-item-btn ${viewMode === 'room' ? 'active' : ''}`}
              onClick={() => setViewMode('room')}
            >
              <div className="icon-wrapper">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="22" y="10" width="20" height="12" strokeWidth="1.5" />
                  <circle cx="36" cy="15" r="1" strokeWidth="1.5" />
                  <path d="M 22 22 L 28 17 L 33 22" strokeWidth="1.5" />
                  <path d="M 31 20 L 35 16 L 42 22" strokeWidth="1.5" />
                  <path d="M 18 36 C 18 28 22 28 32 28 C 42 28 46 28 46 36" />
                  <line x1="32" y1="28" x2="32" y2="42" />
                  <path d="M 18 32 C 12 32 10 36 10 40 L 10 44 L 16 44 L 16 38 C 16 36 18 36 18 36" />
                  <path d="M 46 32 C 52 32 54 36 54 40 L 54 44 L 48 44 L 48 38 C 48 36 46 36 46 36" />
                  <line x1="16" y1="42" x2="48" y2="42" />
                  <rect x="14" y="44" width="36" height="6" rx="2" />
                  <line x1="20" y1="50" x2="18" y2="54" />
                  <line x1="44" y1="50" x2="46" y2="54" />
                </svg>
              </div>
              <span>Room View</span>
            </button>

            <div className="pill-divider" />

            {/* Orientation Toggles */}
            <button
              className={`action-item-btn ${(selections.orientation || 'portrait') === 'portrait' ? 'active' : ''}`}
              onClick={() => update({ orientation: 'portrait' })}
            >
              <div className="icon-wrapper">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="18" y="12" width="28" height="40" />
                  <rect x="24" y="18" width="16" height="28" />
                  <line x1="18" y1="12" x2="24" y2="18" />
                  <line x1="46" y1="12" x2="40" y2="18" />
                  <line x1="18" y1="52" x2="24" y2="46" />
                  <line x1="46" y1="52" x2="40" y2="46" />
                </svg>
              </div>
              <span>Portrait</span>
            </button>

            <button
              className={`action-item-btn ${(selections.orientation || 'portrait') === 'landscape' ? 'active' : ''}`}
              onClick={() => update({ orientation: 'landscape' })}
            >
              <div className="icon-wrapper">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="12" y="18" width="40" height="28" />
                  <rect x="18" y="24" width="28" height="16" />
                  <line x1="12" y1="18" x2="18" y2="24" />
                  <line x1="52" y1="18" x2="46" y2="24" />
                  <line x1="12" y1="46" x2="18" y2="40" />
                  <line x1="52" y1="46" x2="46" y2="40" />
                </svg>
              </div>
              <span>Landscape</span>
            </button>

            {/* Frame Detail */}
            {frame && (
              <>
                <div className="pill-divider" />
                <div className="frame-detail-floating-inner">
                  <div className="frame-detail__img">
                    <MouldingThumb
                      image={frame.image}
                      name={frame.name}
                      fallbackHex={frameFaceHex}
                    />
                  </div>
                  <div className="frame-detail__info">
                    <span className="frame-detail__name">{frame.name}</span>
                    <span className="frame-detail__code">{frame.code}</span>
                    <span className="frame-detail__dims">{frame.widthMm}mm × {frame.heightMm}mm · {frame.profile}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="preview-sticky">
          <div className={`preview-frame-outer preview-frame-outer--${viewMode}`}>
            <div
              className={`preview-frame${!frame ? ' preview-frame--no-frame' : ''}`}
              style={{
                padding: framePx,
                '--frame-w': `${framePx}px`,
              }}
            >
              {frame && (
                <>
                  <div className="frame-bar frame-bar--top"
                    style={{
                      backgroundImage: frameStripUrl ? `url(${frameStripUrl})` : 'none',
                      backgroundColor: frameFaceHex,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="frame-bar frame-bar--right"
                    style={{
                      backgroundImage: frameStripUrlV ? `url(${frameStripUrlV})` : 'none',
                      backgroundColor: frameFaceHex,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="frame-bar frame-bar--bottom"
                    style={{
                      backgroundImage: frameStripUrl ? `url(${frameStripUrl})` : 'none',
                      backgroundColor: frameFaceHex,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="frame-bar frame-bar--left"
                    style={{
                      backgroundImage: frameStripUrlV ? `url(${frameStripUrlV})` : 'none',
                      backgroundColor: frameFaceHex,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </>
              )}
              {selections.printType !== 'canvas' ? (
                <div
                  className={`preview-mount preview-mount--${selections.mountTypeId}`}
                  style={{
                    padding: selections.mountTypeId !== 'none' ? (selections.mountTypeId === 'double' ? Math.max(8, mountPadPx - 6) : mountPadPx) : 0,
                    backgroundColor: selections.mountTypeId !== 'none' ? (mountColour?.hex || '#F9F7F4') : 'transparent',
                    boxShadow: selections.mountTypeId !== 'none' ? 'inset 1px 1px 2px rgba(255, 255, 255, 0.4)' : 'none',
                    transition: 'padding 0.6s ease-in-out, background-color 0.5s ease-in-out',
                    borderRadius: isOvalOrRound ? '50%' : 0,
                  }}
                >
                  {selections.mountTypeId === 'v_groove' && vGrooveColour && (
                    <div 
                      className="preview-mount-line" 
                      style={{ 
                        borderColor: vGrooveColour.hex,
                        borderRadius: isOvalOrRound ? '50%' : 0,
                      }} 
                    />
                  )}
                  
                  <div
                    className={selections.mountTypeId === 'double' ? 'preview-mount-double-reveal' : ''}
                    style={{
                      padding: selections.mountTypeId === 'double' ? '6px' : '0px',
                      backgroundColor: selections.mountTypeId === 'double' ? (mountColour2?.hex || '#1A1A1A') : 'transparent',
                      borderRadius: isOvalOrRound ? '50%' : 0,
                      transition: 'padding 0.6s ease-in-out, background-color 0.5s ease-in-out',
                      width: '100%', height: '100%', display: 'flex', boxSizing: 'border-box'
                    }}
                  >
                    <div
                      className={`preview-image ${!selections.imageUrl ? 'preview-image--empty' : ''}`}
                      style={{
                        width: selections.mountTypeId === 'round' ? Math.min(artworkWidthPx, artworkHeightPx) : artworkWidthPx,
                        height: selections.mountTypeId === 'round' ? Math.min(artworkWidthPx, artworkHeightPx) : artworkHeightPx,
                        borderRadius: isOvalOrRound ? '50%' : 0,
                        overflow: 'hidden',
                        containerType: 'size'
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      {selections.imageUrl ? (
                        <label style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}>
                          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                          <img src={selections.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: isOvalOrRound ? '50%' : 0, objectFit: selections.imageFit === 'fit' ? 'contain' : 'cover' }} />
                          <div className="change-photo-overlay" style={{ borderRadius: isOvalOrRound ? '50%' : 0 }}>
                            <span className="preview-placeholder__icon">↻</span>
                            <span>Change Photo</span>
                          </div>
                        </label>
                      ) : (
                        <label 
                          className="preview-placeholder"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                        >
                          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                          <span className="preview-placeholder__icon">+</span>
                          <span>Upload photo</span>
                        </label>
                      )}
                      {selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && (
                        <div className={`glass-overlay glass-overlay--${selections.glassId}`} style={{ borderRadius: isOvalOrRound ? '50%' : 0 }} />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`preview-image ${!selections.imageUrl ? 'preview-image--empty' : ''}`}
                  style={{
                    width: artworkWidthPx, height: artworkHeightPx,
                    borderRadius: 0,
                    overflow: 'hidden',
                    containerType: 'size'
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {selections.imageUrl ? (
                    <label style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                      <img src={selections.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: 0, objectFit: selections.imageFit === 'fit' ? 'contain' : 'cover' }} />
                      <div className="change-photo-overlay" style={{ borderRadius: 0 }}>
                        <span className="preview-placeholder__icon">↻</span>
                        <span>Change Photo</span>
                      </div>
                    </label>
                  ) : (
                    <label 
                      className="preview-placeholder"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                      <span className="preview-placeholder__icon">+</span>
                      <span>Upload photo</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT — Scrollable Accordion + Sticky Price Bar */}
      <div className="cfg__controls">
        <div className="cfg__scroll">
          {/* Top Control Bar: Upload & Reset */}
          <div className="cfg__top-actions" style={{ display: 'flex', padding: '16px 20px 0', justifyContent: 'flex-end' }}>
            <button className="reset-btn" onClick={handleReset} style={{ 
              padding: '12px 24px', 
              background: '#1A1A1A', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '30px', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <span style={{ fontSize: '18px' }}>↺</span> Reset
            </button>
          </div>

          <div className="accordion">
            {SECTIONS.map(sec => {
              const isOpen = openSection === sec.id;
              const price = sectionPrice(sec.id);
              const summary = sectionSummary(sec.id);
              return (
                <div key={sec.id} className={`acc-panel ${isOpen ? 'acc-panel--open' : ''}`}>
                  <button className="acc-header" onClick={() => toggleSection(sec.id)}>
                    <div className="acc-header__left">
                      <span className="acc-header__title">{sec.label}</span>
                      {!isOpen && summary && <span className="acc-header__summary">{summary}</span>}
                    </div>
                    <div className="acc-header__right">
                      {price > 0 && <span className="acc-header__price">£{price.toFixed(2)}</span>}
                      <span className={`acc-header__chevron ${isOpen ? 'acc-header__chevron--open' : ''}`}>&#9662;</span>
                    </div>
                  </button>
                  <div className={`acc-body ${isOpen ? 'acc-body--open' : ''}`}>
                    {sec.id === 'size' && <SizePrintSection selections={selections} onUpdate={update} />}
                    {sec.id === 'frame' && <FrameSection selections={selections} onUpdate={update} effW={effW} effH={effH} />}
                    {sec.id === 'mount' && <MountSection selections={selections} onUpdate={update} effW={effW} effH={effH} />}
                    {sec.id === 'glass' && <GlassSection selections={selections} onUpdate={update} effW={effW} effH={effH} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky price bar — always visible */}
        <div className="price-bar">
          <div className={`price-bar__breakdown ${showBreakdown ? 'price-bar__breakdown--open' : ''}`}>
            <div className="price-line"><span>Print</span><span>£{pricing.printPrice.toFixed(2)}</span></div>
            <div className="price-line"><span>Frame</span><span>£{pricing.framePrice.toFixed(2)}</span></div>
            <div className="price-line"><span>Mount</span><span>£{pricing.mountPrice.toFixed(2)}</span></div>
            <div className="price-line"><span>Glass</span><span>£{pricing.glassPrice.toFixed(2)}</span></div>
            <hr className="price-divider" />
            <div className="price-line price-line--muted"><span>Shipping calculated at checkout</span><span></span></div>
          </div>

          <button className="price-bar__toggle" onClick={() => setShowBreakdown(p => !p)}>
            <span className="price-bar__total-label">Total</span>
            <span className="price-bar__total-value">£{pricing.total.toFixed(2)}</span>
            <span className={`price-bar__chevron ${showBreakdown ? 'price-bar__chevron--open' : ''}`}>▴</span>
          </button>

          <button className="cta-btn" disabled={pricing.total === 0} onClick={() => handleAddToCart(pricing, frame, sectionSummary('size'))}>Add to Cart — £{pricing.total.toFixed(2)}</button>
        </div>
      </div>
    </div>
    </>
  );
}
