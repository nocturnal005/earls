import React, { useState, useMemo, useCallback } from 'react';
import {
  PRINT_SIZES, FRAME_CATALOGUE, MOUNT_COLOURS, COLOUR_GROUPS, MOUNT_TYPES,
  GLASS_OPTIONS, calcTotal, calcFramePrice,
} from './newData.js';
import {
  SizePrintSection, FrameSection, MountSection, GlassSection,
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
  sizeId: 'A3',
  printType: 'poster',
  frameId: 'E004',
  mountTypeId: 'none',
  mountColourId: 'snow-white',
  mountColourId2: 'deep-black',
  glassId: 'standard',
};

export default function NewConfigurator() {
  const [selections, setSelections] = useState(DEFAULT_SELECTIONS);
  const [openSection, setOpenSection] = useState('size');

  const update = useCallback((partial) => {
    setSelections(prev => ({ ...prev, ...partial }));
  }, []);

  const frame = FRAME_CATALOGUE.find(f => f.id === selections.frameId);
  const size = PRINT_SIZES.find(s => s.id === selections.sizeId);
  const mountColour = MOUNT_COLOURS.find(c => c.id === selections.mountColourId);
  const mountColour2 = MOUNT_COLOURS.find(c => c.id === selections.mountColourId2);
  const mountType = MOUNT_TYPES.find(m => m.id === selections.mountTypeId);
  const glass = GLASS_OPTIONS.find(g => g.id === selections.glassId);

  const pricing = useMemo(() => {
    if (!selections.sizeId || !frame) return null;
    return calcTotal({ ...selections, frame });
  }, [selections, frame]);

  const frameColourHex = frame
    ? (COLOUR_GROUPS.find(c => c.id === frame.colour)?.hex || '#333')
    : '#333';
  const framePx = frame ? Math.max(8, Math.round(frame.widthMm * 0.6)) : 14;

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
      case 'size': return size ? `${size.label} ${selections.printType === 'none' ? '' : selections.printType?.replace('_', ' ')}`.trim() : '';
      case 'frame': return frame ? `${frame.widthMm}mm ${frame.finish} ${COLOUR_GROUPS.find(c => c.id === frame.colour)?.label || ''}`.trim() : '';
      case 'mount': return mountType?.label || '';
      case 'glass': return glass?.label || '';
      default: return '';
    }
  };

  const sectionPrice = (id) => {
    if (!pricing) return null;
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
                  </div>
                </div>
              )}

              {(selections.mountTypeId === 'none' || selections.printType === 'canvas') && (
                <div
                  className="preview-image"
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
                </div>
              )}
            </div>
          </div>

          {/* Upload button */}
          <label className="upload-btn">
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            {selections.imageUrl ? 'Change Photo' : 'Upload Photo'}
          </label>

          {/* Frame detail strip */}
          {frame && (
            <div className="frame-detail">
              <div className="frame-detail__img" style={{ backgroundColor: frameColourHex }} />
              <div className="frame-detail__info">
                <span className="frame-detail__name">{frame.name}</span>
                <span className="frame-detail__code">{frame.code}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Accordion + Price */}
      <div className="cfg__controls">
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
                    {price !== null && <span className="acc-header__price">{price === 0 ? 'Free' : `£${price.toFixed(2)}`}</span>}
                    <span className={`acc-header__chevron ${isOpen ? 'acc-header__chevron--open' : ''}`}>&#9662;</span>
                  </div>
                </button>
                <div className={`acc-body ${isOpen ? 'acc-body--open' : ''}`}>
                  {sec.id === 'size' && <SizePrintSection selections={selections} onUpdate={update} />}
                  {sec.id === 'frame' && <FrameSection selections={selections} onUpdate={update} />}
                  {sec.id === 'mount' && <MountSection selections={selections} onUpdate={update} />}
                  {sec.id === 'glass' && <GlassSection selections={selections} onUpdate={update} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Price summary */}
        {pricing && (
          <div className="price-card">
            <div className="price-card__lines">
              <div className="price-line"><span>Print</span><span>£{pricing.printPrice.toFixed(2)}</span></div>
              <div className="price-line"><span>Frame</span><span>£{pricing.framePrice.toFixed(2)}</span></div>
              <div className="price-line"><span>Mount</span><span>{pricing.mountPrice === 0 ? 'Free' : `£${pricing.mountPrice.toFixed(2)}`}</span></div>
              <div className="price-line"><span>Glass</span><span>{pricing.glassPrice === 0 ? 'Free' : `£${pricing.glassPrice.toFixed(2)}`}</span></div>
              <div className="price-line"><span>Handling</span><span>£{pricing.handlingPrice.toFixed(2)}</span></div>
              <hr className="price-divider" />
              <div className="price-line"><span>Subtotal</span><span>£{pricing.subtotal.toFixed(2)}</span></div>
              <div className="price-line price-line--muted"><span>VAT (20%)</span><span>£{pricing.vat.toFixed(2)}</span></div>
              <hr className="price-divider" />
              <div className="price-total"><span>Total</span><span>£{pricing.total.toFixed(2)}</span></div>
            </div>
            <button className="cta-btn">Add to Cart — £{pricing.total.toFixed(2)}</button>
          </div>
        )}
      </div>
    </div>
  );
}
