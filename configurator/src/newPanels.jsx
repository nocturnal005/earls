import React, { useState, useMemo } from 'react';
import {
  PRINT_SIZES, PRINT_TYPES, PRINT_PRICES,
  GLASS_OPTIONS, MOUNT_TYPES, MOUNT_COLOURS,
  FRAME_CATALOGUE, COLOUR_GROUPS,
  getFinishesForColour, recommendWidth,
  calcGlassPrice, calcMountPrice, calcFramePrice, calcPrintPrice,
  SQCM_PER_SQFT, FRAME_MARKUP,
} from './newData.js';
// ─── Colour Square (simple swatch for frames) ──────────────────────────────

export function MouldingCorner({ hex, className = '' }) {
  return <span className={`colour-square ${className}`} style={{ backgroundColor: hex }} />;
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
    return unit === 'imperial' ? (cm / 2.54).toFixed(1) : cm.toFixed(1);
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
                step="0.1"
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
                step="0.1"
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
  const { frameId, sizeId, printType } = selections;
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
        <button className={`tier-toggle__btn ${tier === 'everyday' ? 'active' : ''}`} onClick={() => setTier('everyday')}>Everyday</button>
        <button className={`tier-toggle__btn ${tier === 'all' ? 'active' : ''}`} onClick={() => setTier('all')}>All inc. Premium</button>
      </div>

      {/* Colour — square swatches with moulding corners */}
      <div className="sec-row">
        <span className="sec-label">Colour</span>
        <div className="colour-row">
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
              <span className="colour-swatch__label">{cg.label}</span>
              <span className="colour-swatch__count">{colourCounts[cg.id]}</span>
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
              const framePrice = dimW ? calcFramePrice(f, dimW, dimH) : null;
              const cg = COLOUR_GROUPS.find(c => c.id === f.colour);

              return (
                <button
                  key={f.id}
                  className={`w-row ${isSelected ? 'w-row--sel' : ''}`}
                  onClick={() => onUpdate({ frameId: f.id })}
                >
                  <span className="w-row__thumb">
                    {f.imageUrl
                      ? <img src={f.imageUrl} alt={f.name} />
                      : <MouldingCorner hex={cg?.hex || '#888'} widthMm={f.widthMm} finish={f.finish} />
                    }
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
  const { mountTypeId, mountColourId, mountColourId2, sizeId, printType } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  const dimW = effW || size?.w_cm;
  const dimH = effH || size?.h_cm;
  const isCanvas = printType === 'canvas';
  const isDouble = mountTypeId === 'double';
  if (isCanvas) {
    return (
      <div className="sec-body">
        <p className="sec-note">Canvas prints don't use mounts.</p>
      </div>
    );
  }

  const colourGroups = {};
  MOUNT_COLOURS.forEach(mc => {
    if (!colourGroups[mc.group]) colourGroups[mc.group] = [];
    colourGroups[mc.group].push(mc);
  });

  return (
    <div className="sec-body">
      <div className="sec-row">
        <span className="sec-label">Mount Type</span>
        <div className="opt-grid opt-grid--5">
          {MOUNT_TYPES.map(mt => {
            const price = dimW ? calcMountPrice(mt.id, dimW, dimH) : null;
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
        <div className="sec-row">
          <span className="sec-label">{isDouble ? 'Primary Mount Colour' : 'Mount Colour'}</span>
          {Object.entries(colourGroups).map(([groupName, colours]) => (
            <div key={groupName} className="mc-group">
              <span className="mc-group__label">{groupName}</span>
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
          ))}

          {isDouble && (
            <>
              <span className="sec-label" style={{ marginTop: 12 }}>Secondary Mount Colour</span>
              <div className="mc-row">
                {MOUNT_COLOURS.map(mc => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}


// ─── Glass Section ───────────────────────────────────────────────────────────

export function GlassSection({ selections, onUpdate, effW, effH }) {
  const { glassId, sizeId, printType } = selections;
  const size = PRINT_SIZES.find(s => s.id === sizeId);
  const dimW = effW || size?.w_cm;
  const dimH = effH || size?.h_cm;
  const isCanvas = printType === 'canvas';

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
            const price = dimW ? calcGlassPrice(g.id, dimW, dimH) : null;
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
