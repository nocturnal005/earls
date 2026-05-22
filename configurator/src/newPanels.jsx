import React, { useState, useMemo, useEffect } from 'react';
import {
  PRINT_SIZES, PRINT_TYPES, PRINT_PRICES,
  GLASS_OPTIONS, MOUNT_TYPES, MOUNT_COLOURS, MOUNT_COLOUR_GROUPS, MOUNT_WIDTHS, VGROOVE_COLOURS,
  FRAME_CATALOGUE, COLOUR_GROUPS,
  getFinishesForColour, recommendWidth,
  calcGlassPrice, calcMountPrice, calcFramePrice, calcPrintPrice,
  SQCM_PER_SQFT, FRAME_MARKUP,
} from './newData.js';
// ─── Colour Square (simple swatch for frames) ──────────────────────────────

export function MouldingCorner({ hex, className = '' }) {
  return <span className={`colour-square ${className}`} style={{ backgroundColor: hex }} />;
}

export function CroppedFrameThumb({ image, name, fallbackHex }) {
  const [croppedUrl, setCroppedUrl] = useState(null);

  useEffect(() => {
    if (!image) return;
    const fullUrl = `${import.meta.env.BASE_URL}${image}`;
    import('./imageCropper.js').then(({ cropFrameImage }) => {
      cropFrameImage(fullUrl).then(url => {
        setCroppedUrl(url);
      }).catch(() => {
        setCroppedUrl(fullUrl);
      });
    });
  }, [image]);

  if (!image) {
    return <MouldingCorner hex={fallbackHex} />;
  }

  return (
    <img
      src={croppedUrl || `${import.meta.env.BASE_URL}${image}`}
      alt={name}
      style={{ objectFit: 'cover', objectPosition: 'center top' }}
    />
  );
}



// ─── Size & Print Section ────────────────────────────────────────────────────

export function SizePrintSection({ selections, onUpdate }) {
  const { sizeId, printType, customW, customH } = selections;
  const [unit, setUnit] = useState('imperial');
  const isCustom = sizeId === 'custom';

  const isoSizes = PRINT_SIZES.filter(s => s.group === 'ISO');
  const impSizes = PRINT_SIZES.filter(s => s.group === 'Imperial');

  const toDisplay = (cm) => {
    if (cm == null) return '';
    return unit === 'imperial' ? Math.round(cm / 2.54) : Math.round(cm);
  };

  const fromInput = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return null;
    return unit === 'imperial' ? n * 2.54 : n;
  };

  const isValidDim = (cm) => cm == null || (cm >= 10 && cm <= 200);

  return (
    <div className="sec-body">
      <div className="sec-row">
        <div className="sec-row__head">
          <span className="sec-label">Print Size</span>
          <div className="unit-toggle">
            <button className={`unit-toggle__btn ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>in</button>
            <button className={`unit-toggle__btn ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>cm</button>
          </div>
        </div>
        <div className="chip-grid">
          {[...isoSizes, ...impSizes].map(s => (
            <button
              key={s.id}
              className={`chip ${sizeId === s.id ? 'chip--sel' : ''}`}
              onClick={() => onUpdate({ sizeId: s.id, orientation: null })}
            >
              <span className="chip__name">{s.label}</span>
              <span className="chip__dim">
                {unit === 'imperial' ? `${s.w_in} × ${s.h_in}` : `${s.w_cm} × ${s.h_cm} cm`}
              </span>
            </button>
          ))}
          <button
            className={`chip chip--custom ${isCustom ? 'chip--sel' : ''}`}
            onClick={() => onUpdate({ sizeId: 'custom', printType: 'none', orientation: null })}
          >
            <span className="chip__name">Custom</span>
            <span className="chip__dim">Enter size</span>
          </button>
        </div>
      </div>

      {isCustom && (
        <div className="sec-row">
          <span className="sec-label">Enter Dimensions ({unit === 'imperial' ? 'inches' : 'cm'})</span>
          <div className="custom-size-inputs">
            <div className="custom-size-field">
              <label className="custom-size-field__label">Width</label>
              <input
                type="number"
                className={`custom-size-field__input ${!isValidDim(customW) ? 'custom-size-field__input--err' : ''}`}
                value={toDisplay(customW)}
                onChange={(e) => onUpdate({ customW: fromInput(e.target.value) })}
                placeholder={unit === 'imperial' ? 'e.g. 18' : 'e.g. 45'}
                min={unit === 'imperial' ? 4 : 10}
                max={unit === 'imperial' ? 79 : 200}
                step="1"
              />
            </div>
            <span className="custom-size-x">×</span>
            <div className="custom-size-field">
              <label className="custom-size-field__label">Height</label>
              <input
                type="number"
                className={`custom-size-field__input ${!isValidDim(customH) ? 'custom-size-field__input--err' : ''}`}
                value={toDisplay(customH)}
                onChange={(e) => onUpdate({ customH: fromInput(e.target.value) })}
                placeholder={unit === 'imperial' ? 'e.g. 24' : 'e.g. 60'}
                min={unit === 'imperial' ? 4 : 10}
                max={unit === 'imperial' ? 79 : 200}
                step="1"
              />
            </div>
          </div>
          {(!isValidDim(customW) || !isValidDim(customH)) && (
            <span className="custom-size-hint">Size must be between 10–200 cm (4–79 in) per side</span>
          )}
        </div>
      )}

      {sizeId && !isCustom && (
        <div className="sec-row">
          <span className="sec-label">Print Type</span>
          <div className="opt-grid opt-grid--4">
            {PRINT_TYPES.map(pt => {
              const price = calcPrintPrice(pt.id, sizeId);
              const unavailable = pt.id !== 'none' && price === null;
              return (
                <button
                  key={pt.id}
                  className={`opt-card ${printType === pt.id ? 'opt-card--sel' : ''} ${unavailable ? 'opt-card--off' : ''}`}
                  onClick={() => !unavailable && onUpdate({ printType: pt.id })}
                  disabled={unavailable}
                >
                  <span className="opt-card__name">{pt.label}</span>
                  <span className="opt-card__desc">{pt.desc}</span>
                  <span className="opt-card__price">
                    {unavailable ? 'N/A' : pt.id === 'none' ? '—' : `£${price?.toFixed(2)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCustom && (
        <div className="sec-row">
          <p className="sec-note">Custom sizes are for framing your own artwork — print service is available for standard sizes only.</p>
        </div>
      )}
    </div>
  );
}


// ─── Frame Section ───────────────────────────────────────────────────────────

export function FrameSection({ selections, onUpdate, effW, effH }) {
  const { frameId, sizeId, printType, mountTypeId, mountWidthId } = selections;
  const mountWidthMm = MOUNT_WIDTHS.find(mw => mw.id === mountWidthId)?.mm || 50;
  const [selectedColour, setSelectedColour] = useState('black');
  const [selectedFinish, setSelectedFinish] = useState(null);
  const [tier, setTier] = useState('everyday');

  const size = PRINT_SIZES.find(s => s.id === sizeId);
  const dimW = effW || size?.w_cm;
  const dimH = effH || size?.h_cm;

  const colourCounts = useMemo(() => {
    const counts = {};
    FRAME_CATALOGUE.forEach(f => {
      if (tier === 'everyday' && f.tier !== 'everyday') return;
      counts[f.colour] = (counts[f.colour] || 0) + 1;
    });
    return counts;
  }, [tier]);

  const availableColours = COLOUR_GROUPS.filter(cg => colourCounts[cg.id]);

  const finishes = useMemo(() => {
    const groups = {};
    FRAME_CATALOGUE.forEach(f => {
      if (f.colour !== selectedColour) return;
      if (tier === 'everyday' && f.tier !== 'everyday') return;
      if (!groups[f.finish]) groups[f.finish] = [];
      groups[f.finish].push(f);
    });
    return Object.entries(groups).map(([name, frames]) => ({ name, count: frames.length }));
  }, [selectedColour, tier]);

  const activeFinish = selectedFinish || (finishes.length > 0 ? finishes[0].name : null);

  const widthFrames = useMemo(() => {
    return FRAME_CATALOGUE
      .filter(f => f.colour === selectedColour && f.finish === activeFinish && (tier === 'all' || f.tier === 'everyday'))
      .sort((a, b) => a.widthMm - b.widthMm);
  }, [selectedColour, activeFinish, tier]);

  const rec = dimW ? recommendWidth(dimW, dimH) : null;
  const maxW = widthFrames.length > 0 ? Math.max(...widthFrames.map(f => f.widthMm)) : 1;

  const handleColourChange = (colourId) => {
    setSelectedColour(colourId);
    setSelectedFinish(null);
  };

  return (
    <div className="sec-body">
      {/* Tier toggle */}
      <div className="tier-toggle">
        <button className={`tier-toggle__btn ${tier === 'everyday' ? 'active' : ''}`} onClick={() => setTier('everyday')}>Classic</button>
        <button className={`tier-toggle__btn ${tier === 'all' ? 'active' : ''}`} onClick={() => setTier('all')}>Full Collection</button>
      </div>

      {/* Colour — Premium Inset Tiles */}
      <div className="sec-row">
        <span className="sec-label">Colour</span>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: 8 }}>
          {availableColours.map(cg => (
            <button
              key={cg.id}
              className={`colour-swatch ${selectedColour === cg.id ? 'colour-swatch--sel' : ''}`}
              onClick={() => handleColourChange(cg.id)}
              title={`${cg.label} (${colourCounts[cg.id]})`}
            >
              <span className="colour-swatch__square">
                <MouldingCorner hex={cg.hex} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="colour-swatch__label">{cg.label}</span>
                <span className="colour-swatch__count">{colourCounts[cg.id]} available</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Finish */}
      {finishes.length > 0 && (
        <div className="sec-row">
          <span className="sec-label">Finish</span>
          <div className="pill-row">
            {finishes.map(f => (
              <button
                key={f.name}
                className={`pill ${activeFinish === f.name ? 'pill--sel' : ''}`}
                onClick={() => setSelectedFinish(f.name)}
              >
                {f.name} <span className="pill__count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Width ladder — moulding corners with finish-specific rendering */}
      {widthFrames.length > 0 && (
        <div className="sec-row">
          <span className="sec-label">Width {rec && <span className="sec-label__hint">— rec. {rec.ideal}mm for {size?.label || 'your size'}</span>}</span>
          <div className="width-ladder">
            {widthFrames.map(f => {
              const isSelected = frameId === f.id;
              const barPct = Math.max(10, (f.widthMm / maxW) * 100);
              const isRec = rec && f.widthMm === rec.ideal;
              const framePrice = dimW ? calcFramePrice(f, dimW, dimH, mountTypeId, mountWidthMm) : null;
              const cg = COLOUR_GROUPS.find(c => c.id === f.colour);

              return (
                <button
                  key={f.id}
                  className={`w-row ${isSelected ? 'w-row--sel' : ''}`}
                  onClick={() => onUpdate({ frameId: f.id })}
                >
                  <span className="w-row__thumb">
                    {f.image ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${f.image}`}
                        alt={f.name}
                        style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      />
                    ) : (
                      <MouldingCorner hex={cg?.hex || '#8A8A8A'} />
                    )}
                  </span>
                  <span className="w-row__info">
                    <span className="w-row__mm">{f.widthMm}mm</span>
                    <span className="w-row__code">{f.code}</span>
                  </span>
                  <span className="w-row__bar-wrap">
                    <span className="w-row__bar" style={{ width: `${barPct}%` }} />
                  </span>
                  <span className="w-row__price">
                    {framePrice !== null ? `£${framePrice.toFixed(2)}` : '—'}
                  </span>
                  {isRec && <span className="w-row__rec">REC</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Mount Section ───────────────────────────────────────────────────────────

export function MountSection({ selections, onUpdate, effW, effH }) {
  const [unit, setUnit] = useState('metric');
  const { mountTypeId, mountColourId, mountColourId2, mountWidthId, vGrooveColourId, sizeId, printType, customMountWidth } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  const dimW = effW || size?.w_cm;
  const dimH = effH || size?.h_cm;
  const isCanvas = printType === 'canvas';
  const isDouble = mountTypeId === 'double';
  const isVGroove = mountTypeId === 'v_groove';
  if (isCanvas) {
    return (
      <div className="sec-body">
        <p className="sec-note">Canvas prints don't use mounts.</p>
      </div>
    );
  }

  const coloursByGroup = {};
  MOUNT_COLOURS.forEach(mc => {
    if (!coloursByGroup[mc.group]) coloursByGroup[mc.group] = [];
    coloursByGroup[mc.group].push(mc);
  });

  const mountWidthMm = mountWidthId === 'custom' 
    ? (customMountWidth || 0) 
    : (MOUNT_WIDTHS.find(mw => mw.id === mountWidthId)?.mm || 50);

  const mountColour = MOUNT_COLOURS.find(mc => mc.id === mountColourId);
  const mountColour2 = MOUNT_COLOURS.find(mc => mc.id === mountColourId2);
  const vGrooveColour = VGROOVE_COLOURS.find(vc => vc.id === vGrooveColourId);

  return (
    <div className="sec-body">
      <div className="sec-row">
        <span className="sec-label">Mount Type</span>
        <div className="opt-grid opt-grid--3">
          {MOUNT_TYPES.map(mt => {
            const price = dimW ? calcMountPrice(mt.id, dimW, dimH, mountWidthMm) : null;
            return (
              <button
                key={mt.id}
                className={`opt-card opt-card--sm ${mountTypeId === mt.id ? 'opt-card--sel' : ''}`}
                onClick={() => onUpdate({ mountTypeId: mt.id })}
              >
                <span className="opt-card__name">{mt.label}</span>
                <span className="opt-card__price">{mt.id === 'none' ? '—' : price !== null ? `£${price.toFixed(2)}` : '—'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mountTypeId !== 'none' && (
        <>
          {/* Active Mount Profile Card */}
          <div className="mount-profile-card">
            <div className="mount-profile-card__preview-wrapper">
              <div 
                className="mount-profile-card__preview-top" 
                style={{ backgroundColor: mountColour?.hex || '#F9F7F4' }}
              >
                {isDouble ? (
                  <div 
                    className="mount-profile-card__preview-bottom" 
                    style={{ backgroundColor: mountColour2?.hex || '#1A1A1A' }}
                  >
                    <div className="mount-profile-card__preview-artwork" />
                  </div>
                ) : (
                  <>
                    {isVGroove && vGrooveColour && (
                      <div 
                        className="mount-profile-card__preview-vgroove" 
                        style={{ borderColor: vGrooveColour.hex }}
                      />
                    )}
                    <div className="mount-profile-card__preview-artwork" />
                  </>
                )}
              </div>
            </div>
            
            <div className="mount-profile-card__details">
              <div className="mount-profile-card__title">Selected Specification</div>
              <div className="mount-profile-card__spec">
                <span className="mount-profile-card__spec-label">{isDouble ? 'Top Board:' : 'Board:'}</span>
                <span className="mount-profile-card__spec-value">
                  {mountColour ? `${mountColour.label}` : 'None'}
                </span>
              </div>
              
              {isDouble && (
                <div className="mount-profile-card__spec">
                  <span className="mount-profile-card__spec-label">Bottom Board:</span>
                  <span className="mount-profile-card__spec-value">
                    {mountColour2 ? `${mountColour2.label}` : 'None'}
                  </span>
                </div>
              )}
              
              {isVGroove && vGrooveColour && (
                <div className="mount-profile-card__spec">
                  <span className="mount-profile-card__spec-label">V-Groove:</span>
                  <span className="mount-profile-card__spec-value">{vGrooveColour.label}</span>
                </div>
              )}
              
              <div className="mount-profile-card__spec">
                <span className="mount-profile-card__spec-label">Border Width:</span>
                <span className="mount-profile-card__spec-value">{mountWidthMm}mm</span>
              </div>
            </div>
          </div>
          <div className="sec-row">
            <span className="sec-label">Mount Width</span>
            <div className="opt-grid opt-grid--4">
              {MOUNT_WIDTHS.map(mw => (
                <button
                  key={mw.id}
                  className={`opt-card opt-card--sm ${mountWidthId === mw.id ? 'opt-card--sel' : ''}`}
                  onClick={() => onUpdate({ mountWidthId: mw.id })}
                >
                  <span className="opt-card__name">{mw.label}</span>
                  <span className="opt-card__desc">{mw.mm ? `${mw.mm}mm` : 'Your Size'}</span>
                </button>
              ))}
            </div>
          </div>

          {mountWidthId === 'custom' && (
            <div className="sec-row" style={{ marginTop: -8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="sec-label">Enter Custom Width</span>
                <div className="unit-toggle" style={{ flexDirection: 'row' }}>
                  <button className={`unit-toggle__btn ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>in</button>
                  <button className={`unit-toggle__btn ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>cm</button>
                </div>
              </div>
              <div className="custom-size-inputs">
                <div className="custom-size-field">
                  <input
                    type="number"
                    className="custom-size-field__input"
                    value={customMountWidth === null ? 0 : (unit === 'imperial' ? Math.round(customMountWidth / 25.4) : Math.round(customMountWidth / 10))}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val)) {
                         onUpdate({ customMountWidth: null });
                         return;
                      }
                      const mm = unit === 'imperial' ? val * 25.4 : val * 10;
                      onUpdate({ customMountWidth: mm });
                    }}
                    placeholder="0"
                    min="0"
                    max={unit === 'imperial' ? 12 : 30}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="sec-row">
            <span className="sec-label">{isDouble ? 'Top Mount Colour' : 'Mount Colour'}</span>
            <div className="mc-scroll">
              {MOUNT_COLOUR_GROUPS.map(grp => {
                const colours = coloursByGroup[grp.id];
                if (!colours || colours.length === 0) return null;
                return (
                  <div key={grp.id} className="mc-group">
                    <span className="mc-group__label">{grp.label}</span>
                    <div className="mc-row">
                      {colours.map(mc => (
                        <button
                          key={mc.id}
                          className={`mc-swatch ${mountColourId === mc.id ? 'mc-swatch--sel' : ''}`}
                          onClick={() => onUpdate({ mountColourId: mc.id })}
                          title={mc.label}
                        >
                          <span className="mc-swatch__fill" style={{ backgroundColor: mc.hex }} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {isDouble && (
              <>
                <span className="sec-label" style={{ marginTop: 12 }}>Bottom Mount Colour</span>
                <div className="mc-scroll">
                  {MOUNT_COLOUR_GROUPS.map(grp => {
                    const colours = coloursByGroup[grp.id];
                    if (!colours || colours.length === 0) return null;
                    return (
                      <div key={grp.id} className="mc-group">
                        <span className="mc-group__label">{grp.label}</span>
                        <div className="mc-row">
                          {colours.map(mc => (
                            <button
                              key={mc.id}
                              className={`mc-swatch ${mountColourId2 === mc.id ? 'mc-swatch--sel' : ''}`}
                              onClick={() => onUpdate({ mountColourId2: mc.id })}
                              title={mc.label}
                            >
                              <span className="mc-swatch__fill" style={{ backgroundColor: mc.hex }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {isVGroove && (
              <>
                <span className="sec-label" style={{ marginTop: 12 }}>V-Groove Colour</span>
                <div className="mc-row">
                  {VGROOVE_COLOURS.map(vc => (
                    <button
                      key={vc.id}
                      className={`mc-swatch ${vGrooveColourId === vc.id ? 'mc-swatch--sel' : ''}`}
                      onClick={() => onUpdate({ vGrooveColourId: vc.id })}
                      title={vc.label}
                    >
                      <span className="mc-swatch__fill" style={{ backgroundColor: vc.hex }} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}


// ─── Glass Section ───────────────────────────────────────────────────────────

export function GlassSection({ selections, onUpdate, effW, effH }) {
  const { glassId, sizeId, printType, mountTypeId, mountWidthId } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  const dimW = effW || size?.w_cm;
  const dimH = effH || size?.h_cm;
  const isCanvas = printType === 'canvas';
  const mountWidthMm = MOUNT_WIDTHS.find(mw => mw.id === mountWidthId)?.mm || 50;

  if (isCanvas) {
    return (
      <div className="sec-body">
        <p className="sec-note">Canvas prints don't require glazing.</p>
      </div>
    );
  }

  return (
    <div className="sec-body">
      <div className="sec-row">
        <div className="opt-grid opt-grid--3">
          {GLASS_OPTIONS.map(g => {
            const price = dimW ? calcGlassPrice(g.id, dimW, dimH, mountTypeId, mountWidthMm) : null;
            return (
              <button
                key={g.id}
                className={`opt-card ${glassId === g.id ? 'opt-card--sel' : ''}`}
                onClick={() => onUpdate({ glassId: g.id })}
              >
                <span className="opt-card__name">{g.label}</span>
                <span className="opt-card__desc">{g.desc}</span>
                <span className="opt-card__price">
                  {g.id === 'none' ? '—' : price !== null ? `£${price.toFixed(2)}` : '—'}
                </span>
                {g.ratePerSqFt > 0 && <span className="opt-card__rate">£{g.ratePerSqFt.toFixed(2)}/sq ft</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
