import { useState, useEffect, useRef } from 'react';
import { FRAME_COLOURS, FRAME_CATALOGUE, FRAME_PROFILES, MOUNTING_OPTIONS } from './data.js';
import { ZoomIn, ZoomOut, RotateCw, CentreIcon, RoomViewIcon, ThreeDViewIcon } from './Icons.jsx';
import roomLivingBg from '/images/living-room-bg.jpg';

export default function PreviewPanel({ state, dispatch }) {
  const [hoveredButton, setHoveredButton] = useState(null);
  
  // Resolve frame colour — catalogue frame takes priority
  const catalogueFrame = state.selectedCatalogueFrame ? FRAME_CATALOGUE.find(f => f.id === state.selectedCatalogueFrame) : null;
  let colour = catalogueFrame ? { 
    id: 'catalogue', 
    name: catalogueFrame.name, 
    hex: catalogueFrame.faceHex || catalogueFrame.hex || '#3B2316',
    isMoulding: true,
  } : (FRAME_COLOURS.find(c => c.id === state.selectedColour) || FRAME_COLOURS[1]);

  if (catalogueFrame && catalogueFrame.image) {
    const baseName = catalogueFrame.image.split('/').pop().replace(/\.(png|jpg|jpeg)$/i, '');
    colour.stripUrl = `${import.meta.env.BASE_URL}mouldings/strips/${baseName}_strip.png`;
    colour.stripVUrl = `${import.meta.env.BASE_URL}mouldings/strips/${baseName}_strip_v.png`;
  }
  const profile = FRAME_PROFILES.find(p => p.id === state.selectedProfile) || FRAME_PROFILES[0];
  const mountObj = MOUNTING_OPTIONS.find(m => m.id === state.selectedMounting) || MOUNTING_OPTIONS.find(m => m.id === 'wc-pure-white');
  const borderW = Math.max(6, profile.width * 0.8);
  const imgSrc = state.imageSrc;
  const is3D = state.viewMode === '3d';
  const isSizePanel = state.activePanel === 'size';
  const isCropMode = state.cropMode;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', background: is3D ? '#E8E6E3' : '#EAEAEA', overflow: 'hidden', transition: 'background 0.4s ease' }}>


      {/* ─── "Image Size / Crop Photo" floating toggle — visible when size panel is active ─── */}
      {isSizePanel && !is3D && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 55,
          display: 'flex',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          {[
            { id: false, label: 'Image Size' },
            { id: true, label: 'Crop Photo' },
          ].map(tab => {
            const active = isCropMode === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => dispatch({ type: 'SET_CROP_MODE', value: tab.id })}
                style={{
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: active ? '#333' : 'white',
                  color: active ? 'white' : '#666',
                  letterSpacing: '0.02em',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* View toggle — top right */}
      <div style={{ position: 'absolute', top: 20, right: 16, zIndex: 50 }}>
        <div style={{ display: 'flex', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {[
            { mode: 'room', label: 'Room View', Icon: RoomViewIcon, tooltip: 'For evaluating the motif and size of the product on the wall.' },
            { mode: '3d', label: '3D view', Icon: ThreeDViewIcon, tooltip: 'Interactive 3D view of the product (hold and drag with the mouse to rotate).' },
          ].map(({ mode, label, Icon, tooltip }) => {
            const active = state.viewMode === mode;
            return (
              <div 
                key={mode} 
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredButton(mode)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', mode })}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '8px 20px', cursor: 'pointer', border: 'none', minWidth: 90, transition: 'all 0.2s',
                    background: active ? '#C41E1E' : 'white', color: active ? 'white' : '#555',
                  }}>
                  <Icon size={18} />
                  <span style={{ fontSize: 11, marginTop: 2, whiteSpace: 'nowrap' }}>{label}</span>
                </button>
                {hoveredButton === mode && !active && tooltip && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: mode === '3d' ? '#2E7D32' : '#C41E1E',
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    lineHeight: '1.4',
                    width: '220px',
                    textAlign: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                    zIndex: 100,
                    borderRadius: '2px',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '30px',
                      width: 0, 
                      height: 0, 
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: `6px solid ${mode === '3d' ? '#2E7D32' : '#C41E1E'}`,
                    }} />
                    {tooltip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* View content — full area */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {state.activePanel === 'optimisation' ? (
          <OptimisationPreview state={state} dispatch={dispatch} />
        ) : (
          <>
            {(state.viewMode === 'room' || !state.viewMode) && (
              <RoomView imgSrc={imgSrc} colour={colour} borderW={borderW} mountObj={mountObj} state={state} dispatch={dispatch} />
            )}
            {state.viewMode === '3d' && (
              <ThreeDView imgSrc={imgSrc} colour={colour} borderW={borderW} mountObj={mountObj} state={state} dispatch={dispatch} />
            )}
          </>
        )}
      </div>

      {/* ─── CROP OVERLAY — visible when cropMode is true and size panel is active ─── */}
      {isSizePanel && isCropMode && (
        <CropOverlay imgSrc={imgSrc} state={state} dispatch={dispatch} />
      )}
    </div>
  );
}

/* ─── Crop overlay with resizable handles ─── */
function CropOverlay({ imgSrc, state, dispatch }) {
  const containerRef = useRef(null);
  const imgContainerRef = useRef(null);

  // Crop rect as percentage of the image container (0–100)
  const [crop, setCrop] = useState({ x: 5, y: 5, w: 90, h: 90 });
  const dragInfo = useRef({ active: false, type: null, startX: 0, startY: 0, startCrop: null });

  const MIN_SIZE = 15; // minimum crop size in %

  // Clamp helper
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Convert mouse position to % coordinates within image container
  const toPercent = (clientX, clientY) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return { px: 0, py: 0 };
    return {
      px: ((clientX - rect.left) / rect.width) * 100,
      py: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    dragInfo.current = {
      active: true,
      type,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragInfo.current.active) return;
      const { type, startX, startY, startCrop } = dragInfo.current;
      const rect = imgContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Delta in percentage
      const dx = ((e.clientX - startX) / rect.width) * 100;
      const dy = ((e.clientY - startY) / rect.height) * 100;

      let { x, y, w, h } = startCrop;

      switch (type) {
        case 'move': {
          const nx = clamp(x + dx, 0, 100 - w);
          const ny = clamp(y + dy, 0, 100 - h);
          setCrop({ x: nx, y: ny, w, h });
          break;
        }
        // Edges
        case 'n': {
          const ny = clamp(y + dy, 0, y + h - MIN_SIZE);
          setCrop({ x, y: ny, w, h: h - (ny - y) });
          break;
        }
        case 's': {
          const nh = clamp(h + dy, MIN_SIZE, 100 - y);
          setCrop({ x, y, w, h: nh });
          break;
        }
        case 'w': {
          const nx = clamp(x + dx, 0, x + w - MIN_SIZE);
          setCrop({ x: nx, y, w: w - (nx - x), h });
          break;
        }
        case 'e': {
          const nw = clamp(w + dx, MIN_SIZE, 100 - x);
          setCrop({ x, y, w: nw, h });
          break;
        }
        // Corners
        case 'nw': {
          const nx = clamp(x + dx, 0, x + w - MIN_SIZE);
          const ny = clamp(y + dy, 0, y + h - MIN_SIZE);
          setCrop({ x: nx, y: ny, w: w - (nx - x), h: h - (ny - y) });
          break;
        }
        case 'ne': {
          const nw = clamp(w + dx, MIN_SIZE, 100 - x);
          const ny = clamp(y + dy, 0, y + h - MIN_SIZE);
          setCrop({ x, y: ny, w: nw, h: h - (ny - y) });
          break;
        }
        case 'sw': {
          const nx = clamp(x + dx, 0, x + w - MIN_SIZE);
          const nh = clamp(h + dy, MIN_SIZE, 100 - y);
          setCrop({ x: nx, y, w: w - (nx - x), h: nh });
          break;
        }
        case 'se': {
          const nw = clamp(w + dx, MIN_SIZE, 100 - x);
          const nh = clamp(h + dy, MIN_SIZE, 100 - y);
          setCrop({ x, y, w: nw, h: nh });
          break;
        }
      }
    };

    const handleUp = () => {
      dragInfo.current.active = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [crop]);

  const handleReset = () => setCrop({ x: 5, y: 5, w: 90, h: 90 });
  const handleFit = () => setCrop({ x: 0, y: 0, w: 100, h: 100 });

  const sz = state.selectedSize || (state.orientation === 'portrait' ? { w: 80, h: 120 } : state.orientation === 'square' ? { w: 100, h: 100 } : { w: 120, h: 80 });

  // Edge handle style builder
  const edgeHandle = (cursor, posStyle, size) => ({
    position: 'absolute',
    ...posStyle,
    ...size,
    cursor,
    zIndex: 15,
    background: 'transparent',
  });

  // Corner L-bracket style builder
  const cornerBracket = (posStyle) => ({
    position: 'absolute',
    ...posStyle,
    zIndex: 16,
    pointerEvents: 'none',
  });

  return (
    <div ref={containerRef} style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Image container */}
      <div
        ref={imgContainerRef}
        style={{
          position: 'relative',
          width: '65%',
          maxWidth: 520,
          aspectRatio: `${sz.w}/${sz.h}`,
          overflow: 'hidden',
        }}
      >
        {/* Full image */}
        {imgSrc ? (
          <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#d1d5db' }} />
        )}

        {/* Dark overlay with crop cut-out using clip-path */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)',
          clipPath: `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
            ${crop.x}% ${crop.y}%,
            ${crop.x}% ${crop.y + crop.h}%,
            ${crop.x + crop.w}% ${crop.y + crop.h}%,
            ${crop.x + crop.w}% ${crop.y}%,
            ${crop.x}% ${crop.y}%
          )`,
          pointerEvents: 'none',
        }} />

        {/* Crop border */}
        <div style={{
          position: 'absolute',
          left: `${crop.x}%`, top: `${crop.y}%`,
          width: `${crop.w}%`, height: `${crop.h}%`,
          border: '2px solid rgba(255,255,255,0.85)',
          pointerEvents: 'none',
          boxSizing: 'border-box',
        }} />

        {/* Rule of thirds grid inside crop */}
        <div style={{
          position: 'absolute',
          left: `${crop.x}%`, top: `${crop.y}%`,
          width: `${crop.w}%`, height: `${crop.h}%`,
          pointerEvents: 'none',
        }}>
          {[33.33, 66.66].map(p => (
            <div key={`h${p}`} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.25)' }} />
          ))}
          {[33.33, 66.66].map(p => (
            <div key={`v${p}`} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>

        {/* Corner L-brackets — professional crop tool look */}
        {[
          { corner: 'nw', style: { left: `${crop.x}%`, top: `${crop.y}%` }, transform: '' },
          { corner: 'ne', style: { left: `${crop.x + crop.w}%`, top: `${crop.y}%` }, transform: 'rotate(90deg)' },
          { corner: 'se', style: { left: `${crop.x + crop.w}%`, top: `${crop.y + crop.h}%` }, transform: 'rotate(180deg)' },
          { corner: 'sw', style: { left: `${crop.x}%`, top: `${crop.y + crop.h}%` }, transform: 'rotate(270deg)' },
        ].map(({ corner, style: pos, transform }) => (
          <div key={corner} style={{ ...cornerBracket(pos), transform: `translate(-2px, -2px) ${transform}` }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M0 0 L0 18 M0 0 L18 0" stroke="white" strokeWidth="3" />
            </svg>
          </div>
        ))}

        {/* Edge mid-point bars — subtle white ticks */}
        {[
          { edge: 'n', style: { left: `${crop.x + crop.w / 2}%`, top: `${crop.y}%`, transform: 'translate(-50%, -1px)' } },
          { edge: 's', style: { left: `${crop.x + crop.w / 2}%`, top: `${crop.y + crop.h}%`, transform: 'translate(-50%, -1px)' } },
          { edge: 'w', style: { left: `${crop.x}%`, top: `${crop.y + crop.h / 2}%`, transform: 'translate(-1px, -50%)' } },
          { edge: 'e', style: { left: `${crop.x + crop.w}%`, top: `${crop.y + crop.h / 2}%`, transform: 'translate(-1px, -50%)' } },
        ].map(({ edge, style: pos }) => {
          const isVert = edge === 'n' || edge === 's';
          return (
            <div key={edge} style={{
              position: 'absolute', ...pos,
              width: isVert ? 24 : 3,
              height: isVert ? 3 : 24,
              background: 'white',
              borderRadius: 1,
              pointerEvents: 'none',
              zIndex: 16,
            }} />
          );
        })}

        {/* Invisible drag handles — edges */}
        <div onMouseDown={(e) => handleMouseDown(e, 'n')} style={edgeHandle('ns-resize', { left: `${crop.x}%`, top: `${crop.y}%`, transform: 'translateY(-50%)' }, { width: `${crop.w}%`, height: 12 })} />
        <div onMouseDown={(e) => handleMouseDown(e, 's')} style={edgeHandle('ns-resize', { left: `${crop.x}%`, top: `${crop.y + crop.h}%`, transform: 'translateY(-50%)' }, { width: `${crop.w}%`, height: 12 })} />
        <div onMouseDown={(e) => handleMouseDown(e, 'w')} style={edgeHandle('ew-resize', { left: `${crop.x}%`, top: `${crop.y}%`, transform: 'translateX(-50%)' }, { width: 12, height: `${crop.h}%` })} />
        <div onMouseDown={(e) => handleMouseDown(e, 'e')} style={edgeHandle('ew-resize', { left: `${crop.x + crop.w}%`, top: `${crop.y}%`, transform: 'translateX(-50%)' }, { width: 12, height: `${crop.h}%` })} />

        {/* Invisible drag handles — corners (larger hit area) */}
        <div onMouseDown={(e) => handleMouseDown(e, 'nw')} style={edgeHandle('nwse-resize', { left: `${crop.x}%`, top: `${crop.y}%`, transform: 'translate(-50%, -50%)' }, { width: 24, height: 24 })} />
        <div onMouseDown={(e) => handleMouseDown(e, 'ne')} style={edgeHandle('nesw-resize', { left: `${crop.x + crop.w}%`, top: `${crop.y}%`, transform: 'translate(-50%, -50%)' }, { width: 24, height: 24 })} />
        <div onMouseDown={(e) => handleMouseDown(e, 'sw')} style={edgeHandle('nesw-resize', { left: `${crop.x}%`, top: `${crop.y + crop.h}%`, transform: 'translate(-50%, -50%)' }, { width: 24, height: 24 })} />
        <div onMouseDown={(e) => handleMouseDown(e, 'se')} style={edgeHandle('nwse-resize', { left: `${crop.x + crop.w}%`, top: `${crop.y + crop.h}%`, transform: 'translate(-50%, -50%)' }, { width: 24, height: 24 })} />

        {/* Center drag area — move the entire crop */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 'move')}
          style={{
            position: 'absolute',
            left: `${crop.x + 3}%`, top: `${crop.y + 3}%`,
            width: `${Math.max(0, crop.w - 6)}%`, height: `${Math.max(0, crop.h - 6)}%`,
            cursor: 'move',
            zIndex: 12,
          }}
        />

        {/* Crop dimensions label */}
        <div style={{
          position: 'absolute',
          left: `${crop.x + crop.w / 2}%`,
          top: `${crop.y + crop.h}%`,
          transform: 'translate(-50%, 8px)',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '3px 10px',
          borderRadius: 3,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.02em',
          pointerEvents: 'none',
          zIndex: 20,
          whiteSpace: 'nowrap',
        }}>
          {Math.round(crop.w)}% × {Math.round(crop.h)}%
        </div>
      </div>

      {/* Bottom crop control buttons */}
      <div style={{
        display: 'flex',
        gap: '2px',
        marginTop: '14px',
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        {[
          { tooltip: 'Fit to frame', action: handleFit, icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )},
          { tooltip: 'Reset crop', action: handleReset, icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12a9 9 0 1 0 9-9 4 4 0 0 0 0 8" />
              <path d="M3 3v6h6" />
            </svg>
          )},
          { tooltip: 'Apply crop', action: () => {
            dispatch({ type: 'APPLY_CROP', crop: { ...crop } });
          }, icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )},
        ].map((btn, i) => (
          <button key={i} onClick={btn.action} title={btn.tooltip} style={{
            padding: '10px 18px',
            border: 'none',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#555',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            {btn.icon}
            <span>{btn.tooltip}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Helper to render image — uses selectedSize dimensions for aspect ratio, applies cropData */
function ImageContent({ imgSrc, selectedSize, orientation = 'portrait', cropData }) {
  // Derive aspect ratio from actual selected size, fall back to orientation
  let ar;
  if (selectedSize && selectedSize.w && selectedSize.h) {
    ar = `${selectedSize.w} / ${selectedSize.h}`;
  } else {
    ar = orientation === 'landscape' ? '4/3' : orientation === 'square' ? '1/1' : '3/4';
  }

  // If crop is applied and meaningful (not full frame), render cropped view
  const hasCrop = cropData && !(cropData.x <= 0.5 && cropData.y <= 0.5 && cropData.w >= 99 && cropData.h >= 99);

  if (imgSrc) {
    if (hasCrop) {
      // Scale and position the image so only the cropped region is visible
      const scaleX = 100 / cropData.w;
      const scaleY = 100 / cropData.h;
      const tx = -(cropData.x / cropData.w) * 100;
      const ty = -(cropData.y / cropData.h) * 100;
      return (
        <div style={{ aspectRatio: ar, overflow: 'hidden', background: '#000', position: 'relative' }}>
          <img
            src={imgSrc}
            alt="Preview"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transformOrigin: '0 0',
              transform: `scale(${scaleX}, ${scaleY}) translate(${tx}%, ${ty}%)`,
            }}
          />
        </div>
      );
    }
    return (
      <div style={{ aspectRatio: ar, overflow: 'hidden', background: '#000' }}>
        <img src={imgSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  return (
    <div style={{ aspectRatio: ar, background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none" stroke="#999" strokeWidth="2">
        <rect x="2" y="2" width="76" height="56" rx="2" />
        <circle cx="25" cy="22" r="6" />
        <path d="M2 45 L25 28 L45 42 L55 35 L78 50" />
      </svg>
    </div>
  );
}



/* --- ROOM VIEW — Modern grey living room background --- */
function RoomView({ imgSrc, colour, borderW, mountObj, state, dispatch }) {
  // When the size panel is active, push the frame down to make room for the floating toggle
  const isSizePanel = state.activePanel === 'size';
  const frameTopOffset = isSizePanel ? '12%' : '4%';

  // Frame wood colour — use selected colour or default espresso
  const woodHex = colour?.hex || '#3B2316';
  const woodDarker = adjustBrightness(woodHex, -18);
  const woodLighter = adjustBrightness(woodHex, 12);
  const woodHighlight = adjustBrightness(woodHex, 25);
  
  // Mount colour and bevel core
  const mountHex = mountObj?.hex || '#ffffff';
  const mountDarker = adjustBrightness(mountHex, -10);
  const isBlackCore = mountObj?.mountType?.includes('BLACK');
  const isCons = mountObj?.mountType?.includes('CONSERVATION');
  const coreHex = isBlackCore ? '#1a1a1a' : isCons ? '#f4eed9' : '#ffffff';

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {/* Full-bleed living room background photo */}
      <img
        src={roomLivingBg}
        alt="Modern living room scene"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
        }}
      />

      {/* Subtle darkening overlay for better frame contrast */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.12) 100%)',
      }} />

      {/* FRAMED PHOTO on the wall — museum-quality layered frame */}
      {(() => {
        const sz = state?.selectedSize || (state.orientation === 'portrait' ? { w: 80, h: 120 } : state.orientation === 'square' ? { w: 100, h: 100 } : { w: 120, h: 80 });
        const pxPerCm = 2.8;
        const maxW = 520;
        const minW = 140;
        const rawW = sz.w * pxPerCm;
        const frameW = Math.max(minW, Math.min(maxW, rawW));

        // Frame proportions scale with size
        const outerFrameWidth = Math.max(14, Math.min(24, frameW * 0.055));
        const matWidth = Math.max(20, Math.min(38, frameW * 0.08));
        const goldAccentWidth = 2;

        return (
          <div style={{
            position: 'absolute',
            top: frameTopOffset,
            left: '50%',
            transform: 'translateX(-50%)',
            width: frameW,
            zIndex: 10,
            transition: 'top 0.4s ease, width 0.4s ease',
          }}>

            {/* === OUTER WOOD FRAME === */}
            <div style={{
              padding: outerFrameWidth,
              position: 'relative',
              /* Wood grain texture fallback */
              background: colour.stripUrl ? '#111' : `
                repeating-linear-gradient(
                  92deg,
                  transparent 0px,
                  transparent 3px,
                  rgba(0,0,0,0.03) 3px,
                  rgba(0,0,0,0.03) 4px
                ),
                repeating-linear-gradient(
                  88deg,
                  transparent 0px,
                  transparent 7px,
                  rgba(255,255,255,0.04) 7px,
                  rgba(255,255,255,0.04) 8px
                ),
                linear-gradient(180deg,
                  ${woodHighlight} 0%,
                  ${woodHex} 8%,
                  ${woodDarker} 45%,
                  ${woodHex} 55%,
                  ${woodLighter} 92%,
                  ${woodHighlight} 100%
                )
              `,
              /* Beveled profile — outer highlight, inner shadow */
              boxShadow: `
                /* Outer wall shadow — deep and realistic */
                8px 12px 35px rgba(0,0,0,0.45),
                3px 5px 15px rgba(0,0,0,0.25),
                /* Outer bevel highlight (top/left light catch) */
                inset 2px 2px 0px ${woodHighlight},
                inset -1px -1px 0px ${woodDarker},
                /* Inner bevel shadow (depth into mat) */
                inset -2px -2px 4px rgba(0,0,0,0.3),
                inset 1px 1px 3px rgba(255,255,255,0.08)
              `,
            }}>
              {/* True Texture Mapping Strips */}
              {colour.stripUrl && (
                <>
                  {/* TOP edge — horizontal strip, height=mouldingWidth maps to border thickness */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: outerFrameWidth, backgroundImage: `url(${colour.stripUrl})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left top', clipPath: `polygon(0 0, 100% 0, calc(100% - ${outerFrameWidth}px) 100%, ${outerFrameWidth}px 100%)`, zIndex: 1 }} />
                  {/* RIGHT edge — vertical strip, width=mouldingWidth maps to border thickness */}
                  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: outerFrameWidth, backgroundImage: `url(${colour.stripVUrl})`, backgroundSize: '100% auto', backgroundRepeat: 'repeat-y', backgroundPosition: 'left top', clipPath: `polygon(100% 0, 100% 100%, 0 calc(100% - ${outerFrameWidth}px), 0 ${outerFrameWidth}px)`, zIndex: 1 }} />
                  {/* BOTTOM edge — horizontal strip, flipped */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: outerFrameWidth, backgroundImage: `url(${colour.stripUrl})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left top', clipPath: `polygon(${outerFrameWidth}px 0, calc(100% - ${outerFrameWidth}px) 0, 100% 100%, 0 100%)`, zIndex: 1, transform: 'scaleY(-1)' }} />
                  {/* LEFT edge — vertical strip, flipped */}
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: outerFrameWidth, backgroundImage: `url(${colour.stripVUrl})`, backgroundSize: '100% auto', backgroundRepeat: 'repeat-y', backgroundPosition: 'left top', clipPath: `polygon(0 0, 100% ${outerFrameWidth}px, 100% calc(100% - ${outerFrameWidth}px), 0 100%)`, zIndex: 1, transform: 'scaleX(-1)' }} />
                  
                  {/* Subtle lighting overlay to simulate 3D bevels over the true texture */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, boxShadow: `inset 2px 2px 1px rgba(255,255,255,0.15), inset -2px -2px 1px rgba(0,0,0,0.25), inset 0 0 6px rgba(0,0,0,0.3)`, pointerEvents: 'none', zIndex: 2 }} />
                </>
              )}

              {/* Mitered corner accents — subtle diagonal lines at corners */}
              {[
                { top: 0, left: 0, bg: `linear-gradient(135deg, ${woodLighter} 0%, transparent 50%)` },
                { top: 0, right: 0, bg: `linear-gradient(225deg, ${woodLighter} 0%, transparent 50%)` },
                { bottom: 0, left: 0, bg: `linear-gradient(45deg, ${woodDarker} 0%, transparent 50%)` },
                { bottom: 0, right: 0, bg: `linear-gradient(315deg, ${woodDarker} 0%, transparent 50%)` },
              ].map((corner, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: outerFrameWidth * 1.4,
                  height: outerFrameWidth * 1.4,
                  background: corner.bg,
                  opacity: colour.stripUrl ? 0 : 0.5,
                  pointerEvents: 'none',
                  zIndex: 2,
                  ...corner,
                }} />
              ))}

              {/* === WHITE COTTON MAT BOARD === */}
              <div style={{
                padding: matWidth,
                position: 'relative',
                zIndex: 5,
                /* Multi-ply mat texture — very subtle warm white with fiber texture */
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 2px,
                    rgba(0,0,0,0.008) 2px,
                    rgba(0,0,0,0.008) 3px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 2px,
                    rgba(0,0,0,0.006) 2px,
                    rgba(0,0,0,0.006) 3px
                  ),
                  linear-gradient(180deg, ${mountHex} 0%, ${mountHex} 50%, ${mountDarker} 100%)
                `,
                /* Beveled inner edge — shadow at top, highlight at bottom */
                boxShadow: `
                  inset 0 2px 6px rgba(0,0,0,0.12),
                  inset 0 -1px 3px rgba(255,255,255,0.6),
                  inset 2px 0 5px rgba(0,0,0,0.06),
                  inset -1px 0 3px rgba(255,255,255,0.3)
                `,
              }}>
                {/* Hand-beveled inner edge highlight — the 45° cut reveal */}
                <div style={{
                  position: 'absolute',
                  top: 3, left: 3, right: 3, bottom: 3,
                  border: `2px solid ${coreHex}`,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />

                {/* === GOLD LEAF ACCENT MAT === */}
                <div style={{
                  padding: goldAccentWidth,
                  background: 'linear-gradient(160deg, #D4AF37 0%, #C5A028 25%, #E8CC5A 50%, #C5A028 75%, #B8922A 100%)',
                  boxShadow: `
                    inset 0 0 1px rgba(0,0,0,0.15),
                    0 0 0 0.5px rgba(212,175,55,0.3)
                  `,
                  position: 'relative',
                }}>
                  {/* Gold shimmer overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />

                  {/* === ARTWORK WINDOW === */}
                  <div style={{
                    background: '#E8E8E8',
                    position: 'relative',
                    /* Inner shadow from the mat overhang */
                    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.25), inset 1px 0 3px rgba(0,0,0,0.15)',
                  }}>
                    <ImageContent
                      imgSrc={imgSrc}
                      orientation={state?.orientation}
                      selectedSize={sz}
                      cropData={state.cropData}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Wall shadow beneath the frame — elongated soft drop */}
            <div style={{
              position: 'absolute',
              bottom: '-14px',
              left: '3%',
              right: '-2%',
              height: '20px',
              background: 'radial-gradient(ellipse at 55% 0%, rgba(0,0,0,0.22) 0%, transparent 75%)',
              filter: 'blur(6px)',
              zIndex: -1,
            }} />

            {/* Side shadow — slight right-side cast */}
            <div style={{
              position: 'absolute',
              top: '5%',
              right: '-6px',
              bottom: '-6px',
              width: '12px',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, transparent 100%)',
              filter: 'blur(4px)',
              zIndex: -1,
            }} />
          </div>
        );
      })()}
    </div>
  );
}


/* --- 3D VIEW — Y-axis, full 360 degree rotation --- */
function ThreeDView({ imgSrc, colour, borderW, mountObj, state, dispatch }) {
  const frameDepth = 18;
  // Derive 3D frame width from selected size (proportional, clamped)
  const sz = state?.selectedSize || (state.orientation === 'portrait' ? { w: 80, h: 120 } : state.orientation === 'square' ? { w: 100, h: 100 } : { w: 120, h: 80 });
  const baseWidth = Math.max(200, Math.min(400, sz.w * 3.6));
  const D = frameDepth;
  const W = baseWidth;
  const scale = state.zoom3d;

  const [rotY, setRotY] = useState(-15);
  const [rotX, setRotX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [introComplete, setIntroComplete] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const autoRotRef = useRef(null);

  // Intro animation: ease from -15 to 0 on mount
  useEffect(() => {
    const timer = setTimeout(() => setRotY(0), 50);
    const timer2 = setTimeout(() => setIntroComplete(true), 700);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);

  // Auto-rotate: continuous 360 at 25 deg/s
  useEffect(() => {
    if (!state.rotating3d) {
      if (autoRotRef.current) cancelAnimationFrame(autoRotRef.current);
      autoRotRef.current = null;
      return;
    }
    let lastTime = performance.now();
    const animate = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setRotY(prev => prev + 25 * dt);
      autoRotRef.current = requestAnimationFrame(animate);
    };
    autoRotRef.current = requestAnimationFrame(animate);
    return () => { if (autoRotRef.current) cancelAnimationFrame(autoRotRef.current); };
  }, [state.rotating3d]);

  // Drag: omnidirectional — horizontal = yaw (rotY), vertical = pitch (rotX)
  const handleMouseDown = (e) => {
    if (state.rotating3d) dispatch({ type: 'STOP_ROTATE' });
    setIsDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setRotY(prev => prev + dx * 0.4);
    setRotX(prev => Math.max(-40, Math.min(40, prev - dy * 0.3)));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // Dynamic edge lighting for full 360 rotation
  const normY = ((rotY % 360) + 360) % 360;
  const leftBr = normY <= 180
    ? 0.85 - (Math.min(normY, 90) / 90) * 0.3
    : 0.55 + (Math.min(normY - 180, 90) / 90) * 0.3;
  const rightBr = normY <= 180
    ? 0.55 + (Math.min(normY, 90) / 90) * 0.3
    : 0.85 - (Math.min(normY - 180, 90) / 90) * 0.3;

  // Wood grain gradient for edges
  const edgeGrain = (hex) => {
    const darker = adjustBrightness(hex, -12);
    return `linear-gradient(180deg, ${hex} 0%, ${darker} 35%, ${hex} 55%, ${darker} 100%)`;
  };

  // Transition logic
  const getTransition = () => {
    if (isDragging || state.rotating3d) return 'none';
    if (!introComplete) return 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    return 'transform 0.3s ease-out';
  };

  const controlBtns = [
    {
      id: 'centre', icon: <CentreIcon size={18} />, label: 'Centre',
      action: () => { setRotY(0); setRotX(0); dispatch({ type: 'RESET_3D' }); },
      tooltip: 'Reset position, zoom & stop rotation'
    },
    { id: 'zoom-in', icon: <ZoomIn size={18} />, label: 'Zoom in', action: () => dispatch({ type: 'ZOOM_3D', dir: 'in' }), tooltip: 'Zoom in (+10%)' },
    { id: 'zoom-out', icon: <ZoomOut size={18} />, label: 'Zoom out', action: () => dispatch({ type: 'ZOOM_3D', dir: 'out' }), tooltip: 'Zoom out (-10%)' },
    {
      id: 'rotate', icon: <RotateCw size={18} />, label: 'Rotate',
      action: () => dispatch({ type: 'TOGGLE_ROTATE' }),
      active: state.rotating3d,
      tooltip: state.rotating3d ? 'Stop auto-rotation' : 'Start auto-rotation'
    },
  ];

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#E8E6E3',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        padding: 40,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Top-left toolbar */}
      <div style={{
        position: 'absolute', top: 20, left: 16, zIndex: 50,
        display: 'flex', background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden',
      }}>
        {controlBtns.map(btn => (
          <div key={btn.id} style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredBtn(btn.id)} onMouseLeave={() => setHoveredBtn(null)}>
            <button
              onClick={(e) => { e.stopPropagation(); btn.action(); }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 16px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: btn.active ? '#FEF2F2' : 'transparent',
                color: btn.active ? '#C41E1E' : '#555',
              }}
              onMouseOver={(e) => { if (!btn.active) { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#111'; } }}
              onMouseOut={(e) => { if (!btn.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; } }}
            >
              {btn.icon}
              <span style={{ fontSize: 10, fontWeight: 500 }}>{btn.label}</span>
            </button>
            {hoveredBtn === btn.id && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                background: '#2E7D32', color: 'white', padding: '6px 10px', fontSize: '11px',
                whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                pointerEvents: 'none', zIndex: 100, borderRadius: '2px',
              }}>
                <div style={{
                  position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0, borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent', borderBottom: '4px solid #2E7D32',
                }} />
                {btn.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ambient light overlay — upper-left directional */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(210deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
        pointerEvents: 'none',
      }} />

      {/* 3D Frame — proper CSS cuboid */}
      <div style={{ perspective: '1000px', perspectiveOrigin: 'center center' }}>
        <div style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
          transition: getTransition(),
          width: W, position: 'relative',
        }}>
          {/* FRONT — print with frame border */}
          <div style={{
            transform: `translateZ(${D / 2}px)`,
            border: `${Math.max(8, borderW)}px solid ${colour.stripUrl ? 'transparent' : colour.hex}`,
            backgroundClip: 'padding-box',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)',
            background: mountObj?.hex || '#ffffff',
            padding: Math.max(20, Math.min(38, W * 0.08)),
            backfaceVisibility: 'hidden',
            position: 'relative',
          }}>
            {/* True Texture Mapping for Front Frame Border */}
            {colour.stripUrl && (() => {
              const b = Math.max(8, borderW);
              return (
                <>
                  {/* TOP edge */}
                  <div style={{ position: 'absolute', top: -b, left: -b, right: -b, height: b, backgroundImage: `url(${colour.stripUrl})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left top', clipPath: `polygon(0 0, 100% 0, calc(100% - ${b}px) 100%, ${b}px 100%)`, zIndex: 10 }} />
                  {/* RIGHT edge */}
                  <div style={{ position: 'absolute', top: -b, right: -b, bottom: -b, width: b, backgroundImage: `url(${colour.stripVUrl})`, backgroundSize: '100% auto', backgroundRepeat: 'repeat-y', backgroundPosition: 'left top', clipPath: `polygon(100% 0, 100% 100%, 0 calc(100% - ${b}px), 0 ${b}px)`, zIndex: 10 }} />
                  {/* BOTTOM edge */}
                  <div style={{ position: 'absolute', bottom: -b, left: -b, right: -b, height: b, backgroundImage: `url(${colour.stripUrl})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x', backgroundPosition: 'left top', clipPath: `polygon(${b}px 0, calc(100% - ${b}px) 0, 100% 100%, 0 100%)`, zIndex: 10, transform: 'scaleY(-1)' }} />
                  {/* LEFT edge */}
                  <div style={{ position: 'absolute', top: -b, left: -b, bottom: -b, width: b, backgroundImage: `url(${colour.stripVUrl})`, backgroundSize: '100% auto', backgroundRepeat: 'repeat-y', backgroundPosition: 'left top', clipPath: `polygon(0 0, 100% ${b}px, 100% calc(100% - ${b}px), 0 100%)`, zIndex: 10, transform: 'scaleX(-1)' }} />
                  {/* Subtle edge bevel lighting */}
                  <div style={{ position: 'absolute', top: -b, left: -b, right: -b, bottom: -b, boxShadow: `inset 2px 2px 1px rgba(255,255,255,0.15), inset -2px -2px 1px rgba(0,0,0,0.25), inset 0 0 5px rgba(0,0,0,0.3)`, pointerEvents: 'none', zIndex: 11 }} />
                </>
              );
            })()}
            <div style={{
              background: '#111',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.25), inset 1px 0 3px rgba(0,0,0,0.15)',
            }}>
              <ImageContent imgSrc={imgSrc} orientation={state?.orientation} selectedSize={sz} cropData={state.cropData} />
            </div>
          </div>

          {/* RIGHT EDGE — shows the moulding face texture on the side */}
          <div style={{
            position: 'absolute', top: 0,
            right: `${-D / 2}px`,
            width: `${D}px`, height: '100%',
            background: colour.stripVUrl ? `url(${colour.stripVUrl}) left top / 100% auto repeat-y` : edgeGrain(colour.hex),
            transform: 'rotateY(90deg)',
            filter: `brightness(${rightBr})`,
          }} />

          {/* LEFT EDGE */}
          <div style={{
            position: 'absolute', top: 0,
            left: `${-D / 2}px`,
            width: `${D}px`, height: '100%',
            background: colour.stripVUrl ? `url(${colour.stripVUrl}) left top / 100% auto repeat-y` : edgeGrain(colour.hex),
            transform: 'rotateY(-90deg)',
            filter: `brightness(${leftBr})`,
          }} />

          {/* TOP EDGE */}
          <div style={{
            position: 'absolute',
            top: `${-D / 2}px`,
            left: 0,
            width: '100%', height: `${D}px`,
            background: colour.stripUrl ? `url(${colour.stripUrl}) left top / auto 100% repeat-x` : colour.hex,
            transform: 'rotateX(90deg)',
            filter: `brightness(${0.88 - (Math.max(0, rotX) / 40) * 0.2})`,
          }} />

          {/* BOTTOM EDGE */}
          <div style={{
            position: 'absolute',
            bottom: `${-D / 2}px`,
            left: 0,
            width: '100%', height: `${D}px`,
            background: colour.stripUrl ? `url(${colour.stripUrl}) left top / auto 100% repeat-x` : colour.hex,
            transform: 'rotateX(-90deg)',
            filter: `brightness(${0.55 + (Math.max(0, rotX) / 40) * 0.2})`,
          }} />

          {/* REAR — matte backing board with mounting clips */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: `
              repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 5px),
              repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.015) 6px, rgba(0,0,0,0.015) 7px),
              linear-gradient(180deg, #cec9c2 0%, #c8c4be 50%, #c0bbb4 100%)
            `,
            transform: `rotateY(180deg) translateZ(${D / 2}px)`,
            backfaceVisibility: 'hidden',
          }}>
            {/* Mounting clip — LEFT */}
            <div style={{ position: 'absolute', top: '3%', left: '20%' }}>
              {/* Vertical plate (fixed to stretcher bar) */}
              <div style={{
                width: 22, height: 14,
                background: 'linear-gradient(180deg, #d0d0d0 0%, #b8b8b8 40%, #a8a8a8 100%)',
                borderRadius: '1px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25), inset 0 0 1px rgba(255,255,255,0.3)',
              }} />
              {/* Horizontal flange (hooks onto wall screw) */}
              <div style={{
                width: 22, height: 8,
                background: `
                  repeating-linear-gradient(90deg, #c0c0c0 0px, #c0c0c0 3px, #b0b0b0 3px, #b0b0b0 4px),
                  linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)
                `,
                backgroundBlendMode: 'multiply',
                borderRadius: '0 0 1px 1px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.15)',
                marginTop: -1,
              }} />
              {/* Screw hole */}
              <div style={{
                position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%',
                background: 'radial-gradient(circle, #666 0%, #888 60%, #aaa 100%)',
                boxShadow: 'inset 0 0 1px rgba(0,0,0,0.5)',
              }} />
            </div>

            {/* Mounting clip — RIGHT */}
            <div style={{ position: 'absolute', top: '3%', right: '20%' }}>
              {/* Vertical plate */}
              <div style={{
                width: 22, height: 14,
                background: 'linear-gradient(180deg, #d0d0d0 0%, #b8b8b8 40%, #a8a8a8 100%)',
                borderRadius: '1px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25), inset 0 0 1px rgba(255,255,255,0.3)',
              }} />
              {/* Horizontal flange */}
              <div style={{
                width: 22, height: 8,
                background: `
                  repeating-linear-gradient(90deg, #c0c0c0 0px, #c0c0c0 3px, #b0b0b0 3px, #b0b0b0 4px),
                  linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)
                `,
                backgroundBlendMode: 'multiply',
                borderRadius: '0 0 1px 1px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.15)',
                marginTop: -1,
              }} />
              {/* Screw hole */}
              <div style={{
                position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%',
                background: 'radial-gradient(circle, #666 0%, #888 60%, #aaa 100%)',
                boxShadow: 'inset 0 0 1px rgba(0,0,0,0.5)',
              }} />
            </div>

            {/* Hanging wire between clips */}
            <svg style={{ position: 'absolute', top: '3%', left: '20%', width: '60%', height: '12%', overflow: 'visible' }} viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 2 8 Q 50 28 98 8" fill="none" stroke="#9a9a9a" strokeWidth="0.8" />
              <path d="M 2 8 Q 50 28 98 8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" strokeDasharray="1,2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floor shadow */}
      <div style={{
        position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)',
        width: W * scale * 0.7, height: 14,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.09) 0%, transparent 70%)',
        filter: 'blur(6px)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ─── Optimisation Preview Section ─── */
function OptimisationPreview({ state, dispatch }) {
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [optimisedSrc, setOptimisedSrc] = useState(null);
  const [processing, setProcessing] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Seagull demo image for the optimisation comparison
  const sampleImg = `${import.meta.env.BASE_URL}images/seagull-sample.jpg`;
  // Use user-uploaded image if available, else seagull sample
  const activeImg = state.imageSrc || sampleImg;

  // Process image through real canvas optimiser when intensity or image changes
  useEffect(() => {
    if (!state.optimisationEnabled) {
      setOptimisedSrc(null);
      return;
    }

    // Debounce to avoid processing on every slider tick
    clearTimeout(debounceRef.current);
    const abortController = new AbortController();

    debounceRef.current = setTimeout(async () => {
      setProcessing(true);
      try {
        const { optimiseImage } = await import('./imageOptimiser.js');
        const result = await optimiseImage(activeImg, state.optimisationValue / 100, abortController.signal);
        if (!abortController.signal.aborted) {
          setOptimisedSrc(result);
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Optimisation failed:', err);
      } finally {
        if (!abortController.signal.aborted) setProcessing(false);
      }
    }, 200);

    return () => {
      clearTimeout(debounceRef.current);
      abortController.abort();
    };
  }, [activeImg, state.optimisationValue, state.optimisationEnabled]);

  // Drag handling for split view
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSplitPos((x / rect.width) * 100);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // The "After" image: use the canvas-processed version, or fall back to original
  const afterImg = optimisedSrc || activeImg;

  // Processing spinner overlay
  const ProcessingBadge = () => processing ? (
    <div style={{
      position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
      zIndex: 60, background: 'rgba(0,0,0,0.7)', color: 'white',
      padding: '8px 20px', fontSize: '12px', fontWeight: 600,
      letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <div style={{
        width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid white', borderRadius: '50%',
        animation: 'optimise-spin 0.8s linear infinite',
      }} />
      PROCESSING
      <style>{`@keyframes optimise-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ) : null;

  // View mode toggle bar (shared between both views)
  const ViewToggle = () => (
    <div style={{
      position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 50, display: 'flex', background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    }}>
      {[
        { id: 'side', label: 'Side-by-side' },
        { id: 'split', label: 'Split View' },
      ].map(v => {
        const active = state.optimisationView === v.id;
        return (
          <button key={v.id}
            onClick={() => dispatch({ type: 'SET_OPTIMISATION_VIEW', view: v.id })}
            style={{
              padding: '10px 28px', fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: active ? '#111' : 'white',
              color: active ? 'white' : '#666',
              letterSpacing: '0.02em',
            }}
          >{v.label}</button>
        );
      })}
    </div>
  );

  /* ─── SIDE-BY-SIDE VIEW ─── */
  if (state.optimisationView === 'side') {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', background: '#F5F5F5',
      }}>
        <ViewToggle />
        <ProcessingBadge />

        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '48px', padding: '80px 40px 40px 40px',
        }}>
          {/* BEFORE */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '42%' }}>
            <div style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)', lineHeight: 0, background: '#fff' }}>
              <img src={activeImg} alt="Before" style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', display: 'block' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 400, color: '#555', letterSpacing: '0.03em' }}>Before</span>
          </div>

          {/* AFTER */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '42%' }}>
            <div style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)', lineHeight: 0, background: '#fff', position: 'relative' }}>
              <img src={afterImg} alt="After" style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', display: 'block' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 400, color: '#555', letterSpacing: '0.03em' }}>After</span>
          </div>
        </div>
      </div>
    );
  }

  /* ─── SPLIT VIEW ─── Draggable before/after divider */
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', background: '#F5F5F5',
    }}>
      <ViewToggle />
      <ProcessingBadge />

      <div
        ref={containerRef}
        style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 40px 40px 40px',
          cursor: isDragging ? 'col-resize' : 'default',
          userSelect: 'none',
        }}
      >
        <div style={{
          position: 'relative', maxWidth: '75%', maxHeight: '70vh',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', lineHeight: 0, overflow: 'hidden',
        }}>
          {/* After (optimised) — full image as base */}
          <img src={afterImg} alt="After" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />

          {/* Before (original) — clipped overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${splitPos}%`, overflow: 'hidden',
          }}>
            <img src={activeImg} alt="Before" style={{
              width: `${100 / (splitPos / 100)}%`, maxWidth: 'none',
              height: '100%', objectFit: 'contain', display: 'block',
            }} />
          </div>

          {/* Divider line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${splitPos}%`,
            width: '2px', background: 'white', zIndex: 20,
            pointerEvents: 'none', boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          }} />

          {/* Drag handle circle */}
          <div
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            style={{
              position: 'absolute', top: '50%', left: `${splitPos}%`,
              transform: 'translate(-50%, -50%)', width: '44px', height: '44px',
              borderRadius: '50%', background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'col-resize', zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '7px solid #333' }} />
              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '7px solid #333' }} />
            </div>
          </div>

          {/* Before / After labels */}
          <div style={{
            position: 'absolute', bottom: '16px', left: '16px',
            background: 'rgba(255,255,255,0.9)', color: '#222',
            padding: '6px 18px', fontSize: '12px', fontWeight: 600,
            zIndex: 40, letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>Before</div>
          <div style={{
            position: 'absolute', bottom: '16px', right: '16px',
            background: '#C41E1E', color: 'white',
            padding: '6px 18px', fontSize: '12px', fontWeight: 600,
            zIndex: 40, letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(196,30,30,0.3)',
          }}>After</div>
        </div>
      </div>
    </div>
  );
}


/* --- Utility: adjust hex colour brightness by percentage --- */
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + Math.round(255 * percent / 100)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + Math.round(255 * percent / 100)));
  const b = Math.max(0, Math.min(255, (num & 0xFF) + Math.round(255 * percent / 100)));
  return `rgb(${r},${g},${b})`;
}
