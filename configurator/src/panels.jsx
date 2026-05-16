import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { PanelHeader, StickyPriceBar, UploadZone, GreenButton } from './components.jsx';
import { SIZE_TABLES, STANDARD_FORMATS, MOUNTING_OPTIONS, FRAME_PROFILES, FRAME_COLOURS,
  FRAME_CATEGORIES, FRAME_CATALOGUE,
  SAMPLE_IMAGES } from './data.js';
import { ChevronRight, ChevronLeft, Upload, Smartphone, ReturnIcon, QualityDots, Check, RotateCw, SideBySideIcon, SplitViewIcon } from './Icons.jsx';
import SmartphoneUploadModal from './SmartphoneModal.jsx';

/* ─── SECTION 4: SELECT PHOTO ─── */
export function SelectPhotoPanel({ state, dispatch, onBack }) {
  const [showSmartphone, setShowSmartphone] = useState(false);
  const handleFile = (src, name) => {
    dispatch({ type: 'LOAD_IMAGE', src, name });
    onBack();
  };

  const orientations = [
    { id: 'landscape', label: 'Landscape', viewBox: '0 0 40 30', path: 'M2 4h36v22H2z' },
    { id: 'portrait', label: 'Portrait', viewBox: '0 0 30 40', path: 'M4 2h22v36H4z' },
    { id: 'square', label: 'Square', viewBox: '0 0 36 36', path: 'M3 3h30v30H3z' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PanelHeader title="Select Photo" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="custom-scrollbar">
        <UploadZone onFileSelect={handleFile} onSmartphone={() => setShowSmartphone(true)} />

        {/* Dashed separator */}
        <div style={{
          borderTop: '2px dashed #d1d5db',
          margin: '24px 0',
        }} />

        {/* Orientation preference section */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#555',
          marginBottom: '16px',
        }}>
          Choose Your Preference
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {orientations.map(o => {
            const selected = state.orientation === o.id;
            return (
              <button
                key={o.id}
                onClick={() => dispatch({ type: 'SET_ORIENTATION', orientation: o.id })}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 12px',
                  border: selected ? '2px solid #2E7D32' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  background: selected ? '#f0fdf4' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { if (!selected) e.currentTarget.style.borderColor = '#9ca3af'; }}
                onMouseOut={(e) => { if (!selected) e.currentTarget.style.borderColor = '#e5e7eb'; }}
              >
                <svg
                  viewBox={o.viewBox}
                  style={{ width: 40, height: 40 }}
                  fill="none"
                  stroke={selected ? '#2E7D32' : '#888'}
                  strokeWidth="2"
                >
                  <rect
                    x={o.id === 'landscape' ? '2' : o.id === 'portrait' ? '4' : '3'}
                    y={o.id === 'landscape' ? '4' : o.id === 'portrait' ? '2' : '3'}
                    width={o.id === 'landscape' ? '36' : o.id === 'portrait' ? '22' : '30'}
                    height={o.id === 'landscape' ? '22' : o.id === 'portrait' ? '36' : '30'}
                    rx="1"
                    fill={selected ? '#2E7D32' : '#ddd'}
                    fillOpacity={selected ? 0.15 : 0.3}
                  />
                  {/* Mountain/sun icon inside */}
                  <circle
                    cx={o.id === 'landscape' ? '14' : o.id === 'portrait' ? '11' : '13'}
                    cy={o.id === 'landscape' ? '12' : o.id === 'portrait' ? '14' : '14'}
                    r="3"
                    fill={selected ? '#2E7D32' : '#aaa'}
                    stroke="none"
                    fillOpacity="0.5"
                  />
                  <path
                    d={o.id === 'landscape'
                      ? 'M2 22l10-8 8 6 6-4 12 8'
                      : o.id === 'portrait'
                      ? 'M4 32l6-10 5 6 4-4 7 10'
                      : 'M3 28l8-10 6 6 5-4 11 10'}
                    fill={selected ? '#2E7D32' : '#bbb'}
                    fillOpacity="0.3"
                    stroke="none"
                  />
                </svg>
                <span style={{
                  fontSize: '12px',
                  fontWeight: selected ? 600 : 400,
                  color: selected ? '#2E7D32' : '#555',
                }}>
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
      <SmartphoneUploadModal isOpen={showSmartphone} onClose={() => setShowSmartphone(false)} />
    </div>
  );
}

/* ─── SECTION 5: IMAGE SIZE & CROP ─── */
export function SizeCropPanel({ state, dispatch, onBack }) {
  const [sizeTab, setSizeTab] = useState('perfect');
  const [stdTab, setStdTab] = useState('3:2');
  const [customW, setCustomW] = useState(state.selectedSize?.w || 50);
  const [customH, setCustomH] = useState(state.selectedSize?.h || 50);
  const [locked, setLocked] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const ratioRef = useRef(customW / customH);

  // Resolution dots based on size area
  const getResDots = (s) => {
    const area = s.w * s.h;
    if (area <= 3000) return 4;  // Excellent — small prints
    return 3;                     // Very Good — larger prints
  };

  const handleLockToggle = () => {
    if (!locked) {
      // Capture current ratio when locking
      const w = parseFloat(customW) || 50;
      const h = parseFloat(customH) || 50;
      ratioRef.current = w / h;
    }
    setLocked(!locked);
  };

  const handleWidthChange = (v) => {
    setCustomW(v);
    if (locked && v) {
      const num = parseFloat(v);
      if (num > 0) setCustomH(Math.round(num / ratioRef.current));
    }
  };

  const handleHeightChange = (v) => {
    setCustomH(v);
    if (locked && v) {
      const num = parseFloat(v);
      if (num > 0) setCustomW(Math.round(num * ratioRef.current));
    }
  };

  // All sizes from current aspect ratio
  const currentSizes = SIZE_TABLES[state.aspectRatio] || SIZE_TABLES['3:2'];
  const currentStdSizes = STANDARD_FORMATS[stdTab] || STANDARD_FORMATS['Classic'];

  // Tab icons
  const tabIcons = {
    perfect: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    custom: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="8" y="8" width="8" height="8" rx="1" strokeDasharray="2 2" />
      </svg>
    ),
    standard: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="8" y1="4" x2="8" y2="20" />
        <line x1="16" y1="4" x2="16" y2="20" />
      </svg>
    ),
  };

  const handleCustomApply = () => {
    const w = Math.max(10, Math.min(180, parseInt(customW) || 50));
    const h = Math.max(10, Math.min(290, parseInt(customH) || 50));
    const area = w * h;
    // 3× markup: cost ≈ base + area factor, then ×3
    const cost = 15 + (area * 0.025);
    const price = Math.round(cost * 3 * 100) / 100;
    dispatch({ type: 'SET_SIZE', size: { label: `${w} x ${h} cm`, w, h, price } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PanelHeader title="Image Size & Crop Photo" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="custom-scrollbar">
        <div>
          {/* Three sub-tabs: Perfect fit, Custom size, Standard formats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
              {[
                { id: 'perfect', label: 'Perfect fit' },
                { id: 'custom', label: 'Custom size' },
                { id: 'standard', label: 'Standard formats' },
              ].map(t => (
                <button key={t.id} onClick={() => setSizeTab(t.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                    color: sizeTab === t.id ? '#C41E1E' : '#888',
                    borderBottom: sizeTab === t.id ? '2px solid #C41E1E' : '2px solid transparent',
                    transition: 'all 0.2s', minWidth: '90px',
                  }}>
                  {tabIcons[t.id]}
                  <span style={{ fontSize: '11px', fontWeight: sizeTab === t.id ? 600 : 400 }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Perfect fit tab description */}
            {sizeTab === 'perfect' && (
              <p style={{ fontSize: '13px', color: '#777', marginBottom: '16px' }}>
                Perfectly fitting formats without image cropping.
              </p>
            )}
            {sizeTab === 'standard' && (
              <p style={{ fontSize: '13px', color: '#777', marginBottom: '16px' }}>
                Standard photo print formats for traditional sizes.
              </p>
            )}
            {sizeTab === 'custom' && (
              <p style={{ fontSize: '13px', color: '#777', marginBottom: '16px' }}>
                Your customised format for maximum flexibility.
              </p>
            )}

            {/* Resolution indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < 4 ? '#2E7D32' : '#ccc',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: '#555' }}>
                Resolution for this size: <strong style={{ color: '#2E7D32' }}>Excellent</strong>
              </span>
            </div>

            {/* Earl's SuperResolution toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', marginBottom: '16px', borderBottom: '1px solid #eee',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div onClick={() => dispatch({ type: 'TOGGLE_OPTIMISATION' })}
                  style={{
                    width: 42, height: 24, borderRadius: 12,
                    background: state.optimisationEnabled ? '#2E7D32' : '#ccc',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3,
                    left: state.optimisationEnabled ? 21 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                {state.optimisationEnabled && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#2E7D32">
                    <circle cx="10" cy="10" r="10" />
                    <polyline points="6 10 9 13 14 7" fill="none" stroke="white" strokeWidth="2" />
                  </svg>
                )}
                <span style={{ fontSize: '14px', color: '#333' }}>Earl's SuperResolution</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowInfoPopup(true); }}
                style={{ 
                  cursor: 'pointer', flexShrink: 0, background: 'none', border: 'none',
                  padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="SuperResolution info"
              >
                <svg width="22" height="22" viewBox="0 0 20 20" fill="#444">
                  <circle cx="10" cy="10" r="10" />
                  <rect x="9" y="8" width="2" height="6" fill="white" />
                  <circle cx="10" cy="5.5" r="1.2" fill="white" />
                </svg>
              </button>
            </div>

            {/* PERFECT FIT: Size table */}
            {sizeTab === 'perfect' && (
              <div>
                <SizeTable sizes={currentSizes} state={state} dispatch={dispatch} getResDots={getResDots} />
              </div>
            )}

            {/* STANDARD FORMATS: Classic / ISO / 16:9 */}
            {sizeTab === 'standard' && (
              <div>
                {/* Sub-tab selector — 3-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
                  {Object.keys(STANDARD_FORMATS).map(cat => (
                    <button key={cat} onClick={() => setStdTab(cat)}
                      style={{
                        padding: '9px 6px', fontSize: '11.5px', fontWeight: 600,
                        border: stdTab === cat ? '2px solid #C41E1E' : '2px solid #e5e7eb',
                        borderRadius: '6px', background: stdTab === cat ? '#FEF2F2' : 'white',
                        cursor: 'pointer', color: stdTab === cat ? '#C41E1E' : '#666',
                        transition: 'all 0.2s', textAlign: 'center',
                      }}>
                      {cat === 'Classic' ? 'Classic' : cat}
                    </button>
                  ))}
                </div>

                {/* Category heading with orientation icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: '#222' }}>{stdTab === 'Classic' ? 'Classic Formats' : stdTab}</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                    <rect x="2" y="4" width="14" height="10" rx="1" />
                    <path d="M9 1v3M6 2l3 2 3-2" />
                  </svg>
                </div>

                <SizeTable sizes={currentStdSizes} state={state} dispatch={dispatch} getResDots={getResDots} />
              </div>
            )}

            {/* CUSTOM SIZE tab */}
            {sizeTab === 'custom' && (
              <div>
                {/* Width & Height inputs */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block', fontSize: '10px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999',
                      marginBottom: '6px',
                    }}>Width in cm</label>
                    <input
                      type="number" value={customW}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', fontSize: '18px',
                        border: '1.5px solid #ddd', borderRadius: '4px',
                        outline: 'none', textAlign: 'center',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C41E1E'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      min="10" max="180"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block', fontSize: '10px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999',
                      marginBottom: '6px',
                    }}>Height in cm</label>
                    <input
                      type="number" value={customH}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', fontSize: '18px',
                        border: '1.5px solid #ddd', borderRadius: '4px',
                        outline: 'none', textAlign: 'center',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#C41E1E'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      min="10" max="290"
                    />
                  </div>
                  {/* Lock/unlock icon */}
                  <button onClick={handleLockToggle}
                    style={{
                      padding: '10px', border: 'none', background: 'none',
                      cursor: 'pointer', color: locked ? '#C41E1E' : '#aaa',
                      marginBottom: '2px',
                    }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {locked ? (
                        <>
                          <rect x="3" y="8" width="14" height="10" rx="2" />
                          <path d="M6 8V5a4 4 0 0 1 8 0v3" />
                        </>
                      ) : (
                        <>
                          <rect x="3" y="8" width="14" height="10" rx="2" />
                          <path d="M6 8V5a4 4 0 0 1 8 0" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>

                {/* Aspect ratio status */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 0', marginBottom: '20px',
                  borderBottom: '1px solid #eee',
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={locked ? '#C41E1E' : '#888'} strokeWidth="1.5">
                    {locked ? (
                      <><rect x="3" y="6" width="10" height="7" rx="1.5" /><path d="M5 6V4a3 3 0 0 1 6 0v2" /></>
                    ) : (
                      <><rect x="3" y="6" width="10" height="7" rx="1.5" /><path d="M5 6V4a3 3 0 0 1 6 0" /></>
                    )}
                  </svg>
                  <span style={{ fontSize: '13px', color: '#555' }}>
                    Aspect ratio: <strong style={{ color: locked ? '#C41E1E' : '#888' }}>{locked ? 'locked' : 'unlocked'}</strong>
                  </span>
                </div>

                {/* Apply custom size button */}
                <button onClick={handleCustomApply}
                  style={{
                    width: '100%', padding: '14px', background: '#C41E1E',
                    color: 'white', fontWeight: 600, fontSize: '14px',
                    border: 'none', borderRadius: '4px', cursor: 'pointer',
                    transition: 'background 0.2s', marginBottom: '16px',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#A31818'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#C41E1E'}
                >
                  APPLY CUSTOM SIZE
                </button>

                {/* Max size info */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 14px', background: '#f8f9fa', borderRadius: '6px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#C41E1E">
                    <circle cx="8" cy="8" r="8" />
                    <line x1="8" y1="7" x2="8" y2="12" stroke="white" strokeWidth="1.5" />
                    <circle cx="8" cy="4.5" r="1" fill="white" />
                  </svg>
                  <span style={{ fontSize: '13px', color: '#555' }}>
                    Maximum orderable size: <strong>180 x 290 cm</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
      <SuperResolutionInfoModal isOpen={showInfoPopup} onClose={() => setShowInfoPopup(false)} />
    </div>
  );
}

/* Reusable size table component */
function SizeTable({ sizes, state, dispatch, getResDots }) {
  return (
    <div>
      {/* Table header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid #eee',
      }}>
        <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolution</span>
        <div style={{ display: 'flex', gap: '60px' }}>
          <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Size</span>
          <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', width: '70px', textAlign: 'right' }}>Price</span>
        </div>
      </div>

      {/* Size rows */}
      {sizes.map((s, i) => {
        const selected = state.selectedSize?.label === s.label;
        const dots = getResDots(s);
        return (
          <button key={i}
            onClick={() => dispatch({ type: 'SET_SIZE', size: s })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '14px 12px',
              border: selected ? '2px solid #2E7D32' : '2px solid transparent',
              borderRadius: '6px', background: selected ? '#f0fdf4' : 'white',
              cursor: 'pointer', transition: 'all 0.15s',
              borderBottom: selected ? '2px solid #2E7D32' : '1px solid #f0f0f0',
            }}
            onMouseOver={(e) => { if (!selected) e.currentTarget.style.background = '#fafafa'; }}
            onMouseOut={(e) => { if (!selected) e.currentTarget.style.background = selected ? '#f0fdf4' : 'white'; }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0,1,2,3].map(d => (
                <div key={d} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: d < dots ? '#2E7D32' : '#ccc',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#222', minWidth: '140px' }}>{s.label}</span>
              <span style={{
                fontSize: '14px', fontWeight: 700, color: '#C41E1E',
                width: '80px', textAlign: 'right',
              }}>
                £ {s.price.toFixed(2)}
              </span>
            </div>
          </button>
      )})}
    </div>
  );
}

export function SuperResolutionInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const modalContent = (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.65)', zIndex: 99999, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', width: '880px', maxWidth: '92vw', maxHeight: '85vh',
          display: 'flex', position: 'relative', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.2)',
          borderRadius: '4px',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Close X button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px', zIndex: 10,
          background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', 
          padding: '8px', borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'background 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left side — Text content */}
        <div style={{ 
          width: '45%', padding: '50px 36px', background: '#fafafa',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          overflowY: 'auto',
        }}>
          <h2 style={{ 
            fontSize: '26px', color: '#222', fontWeight: 400, 
            marginBottom: '24px', lineHeight: 1.35,
            fontFamily: 'Georgia, serif',
          }}>
            What results can I expect from image optimization?
          </h2>
          <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '14px' }}>
              Our tool improves image quality by analyzing and adjusting individual pictures. Specific improvements include:
            </p>
            <ul style={{ paddingLeft: '18px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Better color richness and depth</li>
              <li>Correction of brightness levels and color imbalances</li>
              <li>Enhanced detail in dark and shadowed regions</li>
            </ul>
            <p style={{ marginBottom: '14px' }}>
              It's best to keep this option enabled. Disable it only if you have already performed your own custom printing and imaging corrections.
            </p>
            <p style={{ color: '#777', fontSize: '13px' }}>
              Use the slider to control the optimization level. You can preview the changes with the before-and-after comparison tool. The default setting is 70%.
            </p>
          </div>
        </div>

        {/* Right side — Dog image */}
        <div style={{ width: '55%', position: 'relative', minHeight: '420px' }}>
          <img 
            src="/configurator/dist/images/super-res-info.jpg" 
            alt="Earl's SuperResolution — before and after" 
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
            }} 
          />
          {/* Split divider line */}
          <div style={{ 
            position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', 
            background: 'rgba(255,255,255,0.8)',
          }} />
          {/* Drag handle arrows */}
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', display: 'flex', gap: '2px', 
            background: 'rgba(0,0,0,0.45)', padding: '6px 8px', borderRadius: '20px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
          {/* Labels */}
          <div style={{ 
            position: 'absolute', bottom: '16px', left: '16px', 
            fontSize: '10px', color: 'white', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>ORIGINAL IMAGE</div>
          <div style={{ 
            position: 'absolute', bottom: '16px', right: '16px', 
            fontSize: '10px', color: 'white', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>EARL'S SUPERRESOLUTION</div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/* ─── SECTION 6: IMAGE OPTIMISATION ─── */
export function OptimisationPanel({ state, dispatch, onBack }) {
  const [applyAll, setApplyAll] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <PanelHeader title="IMAGE OPTIMISATION" onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }} className="custom-scrollbar">

        {/* Toggle + status row — matches WhiteWall exactly */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px', 
          padding: '24px 0 16px 0',
        }}>
          <div 
            onClick={() => dispatch({ type: 'TOGGLE_OPTIMISATION' })}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: state.optimisationEnabled ? '#C41E1E' : '#ccc',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'white',
              position: 'absolute',
              top: '3px',
              left: state.optimisationEnabled ? '23px' : '3px',
              transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
          {state.optimisationEnabled && (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="11" fill="#C41E1E" />
              <polyline points="6.5 11 10 14.5 15.5 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span style={{ fontSize: '14px', color: '#333', fontWeight: 400 }}>You can optimise from 1 to 100 %.</span>
        </div>

        {/* Slider + number input + reset — WhiteWall layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0 24px 0' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="range"
              min="1"
              max="100"
              value={state.optimisationValue}
              onChange={(e) => dispatch({ type: 'SET_OPTIMISATION', value: parseInt(e.target.value) })}
              style={{
                width: '100%',
                accentColor: '#C41E1E',
                cursor: 'pointer',
                height: '6px',
              }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid #ddd',
            height: '48px',
            minWidth: '80px',
            justifyContent: 'center',
            gap: '4px',
          }}>
            <input 
              type="number"
              min="1"
              max="100"
              value={state.optimisationValue}
              onChange={(e) => dispatch({ type: 'SET_OPTIMISATION', value: Math.max(1, Math.min(100, parseInt(e.target.value) || 0)) })}
              style={{
                width: '34px',
                border: 'none',
                textAlign: 'right',
                fontSize: '18px',
                fontWeight: 400,
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                color: '#111',
              }}
            />
            <span style={{ fontSize: '16px', color: '#111' }}>%</span>
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_OPTIMISATION', value: 70 })}
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#555',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Reset to 70%"
          >
            <RotateCw size={20} />
          </button>
        </div>

        {/* Apply globally checkbox — WhiteWall style */}
        <div style={{ 
          display: 'flex', 
          gap: '14px', 
          alignItems: 'flex-start', 
          padding: '0 0 28px 0',
          borderBottom: '1px solid #eee',
          marginBottom: '28px',
        }}>
          <div 
            onClick={() => setApplyAll(!applyAll)}
            style={{
              width: '20px',
              height: '20px',
              border: '1.5px solid #888',
              flexShrink: 0,
              marginTop: '2px',
              background: applyAll ? '#C41E1E' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }} 
          >
            {applyAll && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <polyline points="2.5 6 5 8.5 9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
            Apply and save setting for all photos of your current and future orders
          </span>
        </div>

        {/* What is the effect — WhiteWall informational block */}
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 400, color: '#222', lineHeight: 1.3 }}>
          What results can I expect from image optimization?
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.65', color: '#444' }}>
          Our tool improves image quality by analyzing and adjusting individual pictures. Specific improvements include:
        </p>
        <ul style={{ margin: '0 0 20px 0', padding: '0 0 0 6px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            'Better color richness and depth',
            'Correction of brightness levels and color imbalances',
            'Enhanced detail in dark and shadowed regions',
          ].map((text, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>
              <span style={{ color: '#222', fontWeight: 700, fontSize: '16px', lineHeight: '20px' }}>•</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.65', color: '#444' }}>
          It's best to keep this option enabled. Disable it only if you have already performed your own custom printing and imaging corrections.
        </p>

        <p style={{ margin: '0 0 0 0', fontSize: '14px', lineHeight: '1.65', color: '#444' }}>
          Use the slider above to control the optimization level. You can preview the changes with the before-and-after comparison tool. The default setting is 70%.
        </p>
      </div>

      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
    </div>
  );
}
export function UltraHDPanel({ state, dispatch, onBack }) {
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Earl's UltraHD" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="border border-gray-200 rounded-xl p-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${state.ultraHDEnabled ? 'bg-[#C41E1E]' : 'bg-gray-300'}`}
              onClick={() => dispatch({ type: 'TOGGLE_ULTRAHD' })}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${state.ultraHDEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-semibold">Earl's ultraHD</span>
          </label>

          {/* Comparison image */}
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <span className="text-xs text-[#666]">Standard</span>
            </div>
            <div className="flex-1 rounded-lg aspect-square flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
              <span className="text-xs text-white font-semibold">ultraHD print</span>
            </div>
          </div>

          <p className="text-sm text-[#666]">
            Earl's ultraHD uses advanced multi-exposure printing technology to achieve
            unprecedented detail and colour accuracy. Every pixel is rendered with maximum
            fidelity, producing gallery-grade results that exceed conventional printing.
          </p>
        </div>
      </div>
      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
    </div>
  );
}

function MountCorner({ hex, mountType }) {
  let coreColour = '#FFFFFF';
  if (mountType === 'Black Core') coreColour = '#222222';
  if (mountType === 'Conservation') coreColour = '#FDFDFD';
  if (mountType === 'Museum') coreColour = '#FCFBF8';
  
  return (
    <svg viewBox="0 0 100 85" className="w-[85%] h-[85%] mx-auto overflow-visible">
      <defs>
        {/* Photorealistic drop shadow - 2-part system */}
        <filter id="realistic-shadow" x="-30%" y="-30%" width="160%" height="160%">
          {/* Contact shadow */}
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
          {/* Ambient occlusion shadow */}
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.08" />
        </filter>

        {/* High-fidelity paper texture */}
        <filter id={`texture-${hex.replace('#','')}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.06 0" in="noise" result="coloredNoise" />
          <feBlend mode="multiply" in="coloredNoise" in2="SourceGraphic" result="blend" />
        </filter>

        {/* Global lighting gradient */}
        <linearGradient id="surface-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      <g filter="url(#realistic-shadow)">
        {/* Left Bevel (Faces right/up - catches some light) */}
        <polygon points="30,70 50,50 50,55 30,75" fill={coreColour} />
        <polygon points="30,70 50,50 50,55 30,75" fill="black" opacity="0.05" />
        
        {/* Right Bevel (Faces left/down - in shadow) */}
        <polygon points="50,50 70,70 70,75 50,55" fill={coreColour} />
        <polygon points="50,50 70,70 70,75 50,55" fill="black" opacity="0.15" />

        {/* Bevel Lighting / Directional Highlight for White Core (Left Bevel) */}
        {mountType !== 'Black Core' && (
          <polygon points="30,70 50,50 50,51 30,71" fill="white" opacity="0.6" />
        )}

        {/* Main Surface with Texture */}
        <g filter={`url(#texture-${hex.replace('#','')})`}>
          <polygon points="50,10 90,50 70,70 50,50 30,70 10,50" fill={hex} />
        </g>
        
        {/* Surface Lighting Overlay */}
        <polygon points="50,10 90,50 70,70 50,50 30,70 10,50" fill="url(#surface-light)" />

        {/* Crisp Cut Edge (Inner bevel shadow line) */}
        <polyline points="30,70 50,50 70,70" stroke="black" strokeWidth="0.5" opacity="0.15" fill="none" />
        
        {/* Outer Edge Highlights */}
        <line x1="10" y1="50" x2="50" y2="10" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="10" x2="90" y2="50" stroke="white" strokeWidth="0.8" opacity="0.2" />
      </g>
    </svg>
  );
}

export function MountingPanel({ state, dispatch, onBack }) {
  const groups = [
    'Whites & Neutrals',
    'Greys',
    'Black Core',
    'Colour Accents',
    'Conservation',
    'Premium'
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#ffffff' 
    }}>
      <PanelHeader title="Mounting" onBack={onBack} />
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 16 }}>
        {groups.map((groupName, index) => {
          const groupMounts = MOUNTING_OPTIONS.filter(m => m.group === groupName);
          if (groupMounts.length === 0) return null;
          
          return (
            <section key={groupName} style={{ display: 'block', width: '100%', marginBottom: 24 }}>
              {/* Full-width Category Header — inline styles guarantee spacing */}
              <div style={{
                display: 'block',
                width: '100%',
                marginTop: index > 0 ? 32 : 0,
                marginBottom: 16,
                paddingBottom: 0,
                borderBottom: 'none',
              }}>
                <h3 style={{
                  display: 'block',
                  width: '100%',
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  margin: 0,
                  padding: '16px 0',
                }}>{groupName}</h3>
              </div>

              {/* Grid of mounts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 0,
                borderTop: '1px solid #e5e7eb',
              }}>
                {groupMounts.map(m => {
                  const selected = state.selectedMounting === m.id;
                  const baseName = m.label.split(' · ')[1] || m.label;
                  
                  return (
                    <button key={m.id}
                      onClick={() => dispatch({ type: 'SET_MOUNTING', id: m.id })}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: selected ? '#fafafa' : '#fff',
                        border: 'none',
                        borderRight: '1px solid #e5e7eb',
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background 0.2s',
                        padding: 0,
                        position: 'relative',
                      }}>
                      
                      {/* Image Area */}
                      <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        position: 'relative',
                        borderBottom: '1px solid #f0f0f0',
                        background: '#fff',
                      }}>
                        <MountCorner hex={m.hex} mountType={m.mountType} />
                        
                        {/* Info icon at bottom of image area */}
                        <div style={{
                          position: 'absolute',
                          bottom: 8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#999',
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </div>
                        
                        {/* Selection checkmark */}
                        {selected && (
                          <div style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            background: '#C41E1E',
                            borderRadius: '50%',
                            padding: 2,
                            zIndex: 10,
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Details Area */}
                      <div style={{
                        width: '100%',
                        padding: '12px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: selected ? '#fafafa' : '#fff',
                        flexGrow: 1,
                        justifyContent: 'space-between',
                      }}>
                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 32, width: '100%', marginBottom: 6 }}>
                           <p style={{
                             fontSize: 8,
                             color: '#333',
                             fontWeight: 900,
                             textAlign: 'center',
                             lineHeight: 1.3,
                             textTransform: 'uppercase',
                             width: '100%',
                             letterSpacing: '0.12em',
                             margin: 0,
                           }}>
                             {baseName}
                           </p>
                           <p style={{
                             fontSize: 7,
                             color: '#777',
                             fontWeight: 700,
                             textAlign: 'center',
                             textTransform: 'uppercase',
                             width: '100%',
                             marginTop: 2,
                             letterSpacing: '0.06em',
                             margin: '2px 0 0 0',
                           }}>
                             {m.mountType}
                           </p>
                         </div>
                         
                         <div style={{ width: '100%', borderTop: '1px solid #f0f0f0', marginBottom: 6 }}></div>
                         
                         <span style={{
                           color: '#555',
                           fontSize: 11,
                           fontWeight: 900,
                           width: '100%',
                           textAlign: 'center',
                           letterSpacing: '0.05em',
                         }}>
                           +£{m.addonPriceA1.toFixed(2)}
                         </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
    </div>
  );
}

/* ─── SECTION 9: FRAME PROFILE & COLOUR ─── */
export function FramePanel({ state, dispatch, onBack }) {
  const [activeCategory, setActiveCategory] = useState(null);

  // Get frames for the active category
  const categoryFrames = activeCategory
    ? FRAME_CATALOGUE.filter(f => f.category === activeCategory)
    : [];

  // Find the selected catalogue frame
  const selectedFrame = FRAME_CATALOGUE.find(f => f.id === state.selectedCatalogueFrame) || null;

  const handleSelectFrame = (frame) => {
    dispatch({ type: 'SET_CATALOGUE_FRAME', frame });
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Frame Selection" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">

        {/* Selected frame info bar */}
        {selectedFrame && (
          <div style={{
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 6,
              backgroundColor: selectedFrame.hex,
              border: selectedFrame.hex === '#F5F5F0' || selectedFrame.hex === '#FAFAFA' || selectedFrame.hex === '#F0F0F0' || selectedFrame.hex === '#F8F8F4' || selectedFrame.hex === '#F5F5F5' || selectedFrame.hex === '#EDE8DE' || selectedFrame.hex === '#E8E4DC'
                ? '2px solid #ddd' : '2px solid ' + selectedFrame.hex,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, lineHeight: 1.3 }}>{selectedFrame.name}</p>
              <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{selectedFrame.widthMm}mm • {selectedFrame.profile} • {selectedFrame.finish}</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#C41E1E', whiteSpace: 'nowrap' }}>
              £{selectedFrame.retailPerM.toFixed(2)}/m
            </span>
          </div>
        )}

        {/* Frame profiles — real frame images */}
        <div>
          <p className="text-xs uppercase text-[#666] tracking-wider mb-3 font-medium">Profile Width</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {FRAME_PROFILES.map(p => {
              const sel = state.selectedProfile === p.id;
              return (
                <button key={p.id}
                  onClick={() => dispatch({ type: 'SET_PROFILE', id: p.id })}
                  style={{
                    flexShrink: 0,
                    width: 100,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    outline: sel ? '2px solid #C41E1E' : '2px solid transparent',
                    borderRadius: 10,
                    transition: 'outline 0.15s',
                  }}>
                  <div style={{
                    width: 100, height: 72, borderRadius: 8,
                    background: '#f5f5f5',
                    overflow: 'hidden',
                    marginBottom: 4,
                    position: 'relative',
                  }}>
                    <img
                      src={`${import.meta.env.BASE_URL}${p.image}`}
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Width badge */}
                    <span style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 600,
                      padding: '1px 5px',
                      borderRadius: 3,
                      letterSpacing: '0.02em',
                    }}>{p.width}mm</span>
                  </div>
                  <span style={{ fontSize: 11, color: sel ? '#C41E1E' : '#333', fontWeight: sel ? 600 : 400 }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category / Frame browser */}
        <div>
          {!activeCategory ? (
            <>
              {/* Category grid — 2 columns with images */}
              <p className="text-xs uppercase text-[#666] tracking-wider mb-3 font-medium">Frame Categories</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {FRAME_CATEGORIES.map(cat => (
                  <button key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      border: '1px solid #e4e4e4',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'white',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#C41E1E'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(196,30,30,0.12)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#e4e4e4'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Category image */}
                    <div style={{ height: 72, background: '#f8f8f8', overflow: 'hidden' }}>
                      <img
                        src={import.meta.env.BASE_URL + cat.image}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    {/* Label */}
                    <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#222' }}>{cat.name}</span>
                      <span style={{ fontSize: 10, color: '#999', background: '#f0f0f0', padding: '2px 6px', borderRadius: 10 }}>{cat.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Back to categories */}
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, color: '#C41E1E', fontWeight: 600,
                  cursor: 'pointer', background: 'none', border: 'none',
                  marginBottom: 10, padding: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C41E1E" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                Back to categories
              </button>

              {/* Category image banner */}
              {(() => {
                const cat = FRAME_CATEGORIES.find(c => c.id === activeCategory);
                return cat ? (
                  <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 12, border: '1px solid #eee' }}>
                    <img src={import.meta.env.BASE_URL + cat.image} alt={cat.name}
                      style={{ width: '100%', height: 80, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ padding: '8px 12px', background: '#fafafa', borderTop: '1px solid #eee' }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111' }}>{cat.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{categoryFrames.length} frames available</p>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Individual frame cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {categoryFrames.map(frame => {
                  const sel = selectedFrame && selectedFrame.id === frame.id;
                  const isLight = frame.group === 'whites' || frame.group === 'creams' || frame.id.includes('ice') || frame.id.includes('dove') || frame.id.includes('dawn') || frame.id.includes('ash');
                  return (
                    <button key={frame.id}
                      onClick={() => handleSelectFrame(frame)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 10px',
                        borderRadius: 8,
                        border: sel ? '2px solid #C41E1E' : '1px solid #e8e8e8',
                        background: sel ? '#FFF5F5' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'left',
                      }}
                      onMouseOver={e => { if (!sel) e.currentTarget.style.borderColor = '#ccc'; }}
                      onMouseOut={e => { if (!sel) e.currentTarget.style.borderColor = '#e8e8e8'; }}
                    >
                      {/* Colour swatch */}
                      <div style={{
                        width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                        backgroundColor: frame.hex,
                        border: isLight ? '2px solid #ddd' : '2px solid ' + frame.hex,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
                        position: 'relative',
                      }}>
                        {sel && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#C41E1E' : 'white'} strokeWidth="3"
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#111', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{frame.name}</p>
                        <p style={{ fontSize: 10, color: '#999', margin: 0 }}>{frame.widthMm}mm • {frame.finish}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <StickyPriceBar price={calcPrice(state)} onApply={onBack} />
    </div>
  );
}



/* ─── Price calculation helper ─── */
export function calcPrice(state) {
  // Use selected size or default fallback (120×80 cm landscape)
  const defaultSize = { w: 120, h: 80, price: 0 };
  const size = state.selectedSize || defaultSize;
  
  let p = size.price || 0;
  
  const mount = MOUNTING_OPTIONS.find(m => m.id === state.selectedMounting);
  if (mount) {
    let gm = 1.25;
    if (mount.mountType === 'Conservation') gm = 1.55;
    if (mount.mountType === 'Extra Thick') gm = 1.40;
    if (mount.mountType === 'Museum') gm = 2.00;
    if (mount.mountType === 'Suede') gm = 1.50;
    
    // A1 Area reference
    const A1_AREA = 84.1 * 59.4;
    const currentArea = size.w * size.h;
    const sizeMultiplier = currentArea / A1_AREA;
    
    const mountPrice = Math.ceil(1.485 * gm * sizeMultiplier) * 3;
    p += mountPrice;
  }
  

  
  const frame = FRAME_PROFILES.find(f => f.id === state.selectedProfile);
  if (frame) p += (frame.price || 0);
  

  
  // Catalogue frame: add cost based on perimeter of selected size × retail rate
  if (state.selectedCatalogueFrame) {
    const catFrame = FRAME_CATALOGUE.find(f => f.id === state.selectedCatalogueFrame);
    if (catFrame) {
      const perimM = ((size.w + size.h) * 2) / 100;
      p += catFrame.retailPerM * perimM;
    }
  }
  return p;
}
