import React, { useState, useMemo, useCallback } from 'react';
import {
  PRINT_SIZES, FRAME_CATALOGUE, MOUNT_COLOURS, COLOUR_GROUPS, MOUNT_TYPES,
  GLASS_OPTIONS, calcFramePrice, calcPrintPrice, calcMountPrice, calcGlassPrice,
  VAT_RATE,
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
  mountColourId: 'snow-white',
  mountColourId2: 'deep-black',
  glassId: null,
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
  const mountType = MOUNT_TYPES.find(m => m.id === selections.mountTypeId);
  const glass = GLASS_OPTIONS.find(g => g.id === selections.glassId);

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
    const incVat = n => n * (1 + VAT_RATE);
    const printEx  = (!isCustom && selections.printType && size) ? (calcPrintPrice(selections.printType, selections.sizeId) || 0) : 0;
    const frameEx  = (frame && effW) ? calcFramePrice(frame, effW, effH) : 0;
    const mountEx  = (selections.mountTypeId !== 'none' && effW) ? calcMountPrice(selections.mountTypeId, effW, effH) : 0;
    const glassEx  = (selections.glassId && selections.glassId !== 'none' && effW) ? calcGlassPrice(selections.glassId, effW, effH) : 0;
    const printPrice = round2(incVat(printEx));
    const framePrice = round2(incVat(frameEx));
    const mountPrice = round2(incVat(mountEx));
    const glassPrice = round2(incVat(glassEx));
    const total = printPrice + framePrice + mountPrice + glassPrice;
    return {
      printPrice, framePrice, mountPrice, glassPrice,
      total: round2(total),
    };
  }, [selections, frame, size, effW, effH, isCustom]);

  const frameColourHex = frame
    ? (COLOUR_GROUPS.find(c => c.id === frame.colour)?.hex || '#333')
    : 'transparent';
  const framePx = frame ? Math.max(8, Math.round(frame.widthMm * 0.6)) : 0;

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
        <div className="preview-sticky">
          <div className="preview-frame-outer">
            <div
              className="preview-frame"
              style={{
                borderWidth: framePx,
                borderColor: frameColourHex,
                borderStyle: 'solid',
              }}
            >
              {selections.mountTypeId !== 'none' && selections.printType !== 'canvas' && (
                <div
                  className="preview-mount"
                  style={{
                    padding: selections.mountTypeId === 'double' ? 20 : 16,
                    backgroundColor: mountColour?.hex || '#F8F8F8',
                  }}
                >
                  {selections.mountTypeId === 'double' && (
                    <div className="preview-mount-inner" style={{ border: `3px solid ${mountColour2?.hex || '#1A1A1A'}` }} />
                  )}
                  {selections.mountTypeId === 'mount_line' && (
                    <div className="preview-mount-line" style={{ border: '1px solid #C9A84C' }} />
                  )}
                  <div
                    className="preview-image"
                    style={{ aspectRatio: `${displayW} / ${displayH}` }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {selections.imageUrl ? (
                      <img src={selections.imageUrl} alt="Preview" />
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
                    <img src={selections.imageUrl} alt="Preview" />
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

          {/* Upload + orientation controls */}
          <div className="preview-actions">
            <label className="upload-btn">
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              {selections.imageUrl ? 'Change Photo' : 'Upload Photo'}
            </label>
            {hasDims && (
              <button
                className="orientation-toggle"
                onClick={() => {
                  const current = selections.orientation || (rawW >= rawH ? 'landscape' : 'portrait');
                  update({ orientation: current === 'landscape' ? 'portrait' : 'landscape' });
                }}
                title={`Switch to ${(selections.orientation || (rawW >= rawH ? 'landscape' : 'portrait')) === 'landscape' ? 'portrait' : 'landscape'}`}
              >
                ↻
              </button>
            )}
          </div>

          {/* Frame detail strip — with moulding corner */}
          {frame && (
            <div className="frame-detail">
              <div className="frame-detail__img">
                <MouldingCorner hex={frameColourHex} widthMm={frame.widthMm} finish={frame.finish} />
              </div>
              <div className="frame-detail__info">
                <span className="frame-detail__name">{frame.name}</span>
                <span className="frame-detail__code">{frame.code}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Scrollable Accordion + Sticky Price Bar */}
      <div className="cfg__controls">
        <div className="cfg__scroll">
          {/* Reset button */}
          <div className="cfg__reset-bar">
            <button className="reset-btn" onClick={handleReset}>↺ Start Over</button>
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
            <div className="price-line price-line--muted"><span>Prices include VAT</span><span></span></div>
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
