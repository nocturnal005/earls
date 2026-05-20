import React, { useState, useMemo, useCallback } from 'react';
import {
  PRINT_SIZES, FRAME_CATALOGUE, MOUNT_COLOURS, COLOUR_GROUPS, MOUNT_TYPES,
  GLASS_OPTIONS, VGROOVE_COLOURS, MOUNT_WIDTHS,
  calcFramePrice, calcPrintPrice, calcMountPrice, calcGlassPrice,
} from './newData.js';
import {
  SizePrintSection, FrameSection, MountSection, GlassSection,
  MouldingCorner,
} from './newPanels.jsx';

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
  orientation: null,
  printType: null,
  frameId: null,
  mountTypeId: 'none',
  mountColourId: 'bright-white',
  mountColourId2: 'deep-black',
  mountWidthId: 'standard',
  vGrooveColourId: null,
  glassId: null,
  imageFit: 'fill',
};

export default function NewConfigurator() {
  const [selections, setSelections] = useState(DEFAULT_SELECTIONS);
  const [openSection, setOpenSection] = useState('size');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const update = useCallback((partial) => {
    setSelections(prev => ({ ...prev, ...partial }));
  }, []);

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
    const framePrice  = (frame && effW) ? calcFramePrice(frame, effW, effH) : 0;
    const mountWidthMm = MOUNT_WIDTHS.find(mw => mw.id === selections.mountWidthId)?.mm || 50;
    const mountPrice  = (selections.mountTypeId !== 'none' && selections.printType !== 'canvas' && effW) ? calcMountPrice(selections.mountTypeId, effW, effH, mountWidthMm) : 0;
    const glassPrice  = (selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && effW) ? calcGlassPrice(selections.glassId, effW, effH) : 0;
    const total = printPrice + framePrice + mountPrice + glassPrice;
    return {
      printPrice: round2(printPrice), framePrice: round2(framePrice),
      mountPrice: round2(mountPrice), glassPrice: round2(glassPrice),
      total: round2(total),
    };
  }, [selections, frame, size, effW, effH, isCustom]);

  const frameColourHex = frame
    ? (COLOUR_GROUPS.find(c => c.id === frame.colour)?.hex || '#2D2D2D')
    : 'transparent';
  const framePx = frame ? Math.max(8, Math.round(frame.widthMm * 0.6)) : 0;
  const mountPadPx = mountWidth ? Math.round(mountWidth.mm * 0.7) : 35;

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
    <div className="cfg">
      {/* LEFT — Preview */}
      <div className="cfg__preview">
        {/* Upload + orientation controls — positioned left side */}
        <div className="preview-actions">
          <label className="upload-btn">
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            {selections.imageUrl ? 'Change Photo' : 'Upload Photo'}
          </label>
          {hasDims && (() => {
            const current = selections.orientation || (rawW >= rawH ? 'landscape' : 'portrait');
            return (
              <div className="unit-toggle">
                <button
                  className={`unit-toggle__btn ${current === 'landscape' ? 'active' : ''}`}
                  onClick={() => update({ orientation: 'landscape' })}
                >Landscape</button>
                <button
                  className={`unit-toggle__btn ${current === 'portrait' ? 'active' : ''}`}
                  onClick={() => update({ orientation: 'portrait' })}
                >Portrait</button>
              </div>
            );
          })()}
          {selections.imageUrl && (
            <div className="unit-toggle">
              <button
                className={`unit-toggle__btn ${selections.imageFit === 'fit' ? 'active' : ''}`}
                onClick={() => update({ imageFit: 'fit' })}
              >Fit</button>
              <button
                className={`unit-toggle__btn ${selections.imageFit === 'fill' ? 'active' : ''}`}
                onClick={() => update({ imageFit: 'fill' })}
              >Fill</button>
            </div>
          )}

          {/* Frame detail — moulding image + name */}
          {frame && (
            <div className="frame-detail">
              <div className="frame-detail__img">
                {frame.image
                  ? <img src={`${import.meta.env.BASE_URL}${frame.image}`} alt={frame.name} />
                  : <MouldingCorner hex={frameColourHex} />
                }
              </div>
              <div className="frame-detail__info">
                <span className="frame-detail__name">{frame.name}</span>
                <span className="frame-detail__code">{frame.code}</span>
              </div>
            </div>
          )}
        </div>

        <div className="preview-sticky">
          <div className="preview-frame-outer">
            <div
              className={`preview-frame${!frame ? ' preview-frame--no-frame' : ''}`}
              style={{
                borderWidth: framePx,
                borderColor: frameColourHex,
                borderStyle: 'solid',
              }}
            >
              {selections.mountTypeId !== 'none' && selections.printType !== 'canvas' && (
                <div
                  className={`preview-mount preview-mount--${selections.mountTypeId}`}
                  style={{
                    padding: selections.mountTypeId === 'double' ? Math.max(8, mountPadPx - 6) : mountPadPx,
                    backgroundColor: mountColour?.hex || '#F9F7F4',
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
                  
                  {selections.mountTypeId === 'double' ? (
                    <div
                      className="preview-mount-double-reveal"
                      style={{
                        padding: '6px',
                        backgroundColor: mountColour2?.hex || '#1A1A1A',
                      }}
                    >
                      <div
                        className="preview-image"
                        style={{
                          aspectRatio: selections.mountTypeId === 'round' ? '1 / 1' : `${displayW} / ${displayH}`,
                          borderRadius: isOvalOrRound ? '50%' : 0,
                          overflow: 'hidden',
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                      >
                        {selections.imageUrl ? (
                          <img src={selections.imageUrl} alt="Preview" style={{ borderRadius: isOvalOrRound ? '50%' : 0, objectFit: selections.imageFit === 'fit' ? 'contain' : 'cover' }} />
                        ) : (
                          <div className="preview-placeholder">
                            <span className="preview-placeholder__icon">+</span>
                            <span>Drop photo here</span>
                          </div>
                        )}
                        {selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && (
                          <div className={`glass-overlay glass-overlay--${selections.glassId}`} style={{ borderRadius: isOvalOrRound ? '50%' : 0 }} />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="preview-image"
                      style={{
                        aspectRatio: selections.mountTypeId === 'round' ? '1 / 1' : `${displayW} / ${displayH}`,
                        borderRadius: isOvalOrRound ? '50%' : 0,
                        overflow: 'hidden',
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      {selections.imageUrl ? (
                        <img src={selections.imageUrl} alt="Preview" style={{ borderRadius: isOvalOrRound ? '50%' : 0, objectFit: selections.imageFit === 'fit' ? 'contain' : 'cover' }} />
                      ) : (
                        <div className="preview-placeholder">
                          <span className="preview-placeholder__icon">+</span>
                          <span>Drop photo here</span>
                        </div>
                      )}
                      {selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && (
                        <div className={`glass-overlay glass-overlay--${selections.glassId}`} style={{ borderRadius: isOvalOrRound ? '50%' : 0 }} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {(selections.mountTypeId === 'none' || selections.printType === 'canvas') && (
                <div
                  className="preview-image"
                  style={{ aspectRatio: `${displayW} / ${displayH}` }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {selections.imageUrl ? (
                    <img src={selections.imageUrl} alt="Preview" style={{ objectFit: selections.imageFit === 'fit' ? 'contain' : 'cover' }} />
                  ) : (
                    <div className="preview-placeholder">
                      <span className="preview-placeholder__icon">+</span>
                      <span>Drop photo here</span>
                    </div>
                  )}
                  {selections.glassId && selections.glassId !== 'none' && selections.printType !== 'canvas' && (
                    <div className={`glass-overlay glass-overlay--${selections.glassId}`} />
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
          {/* Reset button */}
          <div className="cfg__reset-bar">
            <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
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

          <button className="cta-btn" disabled={pricing.total === 0}>Add to Cart — £{pricing.total.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}
