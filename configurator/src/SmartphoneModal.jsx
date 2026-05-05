import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * SmartphoneUploadModal — WhiteWall-inspired overlay with Earl's branding.
 * Generates a real, scannable QR code that opens the configurator on the user's phone.
 */
export default function SmartphoneUploadModal({ isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Build a unique Earl's mobile upload URL based on the current page
    const base = window.location.origin + window.location.pathname;
    const uploadUrl = `${base}?source=mobile-upload&t=${Date.now()}`;

    QRCode.toDataURL(uploadUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#C41E1E',   // Earl's red
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const stepStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '0 12px',
  };

  const numberStyle = (n) => ({
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '2px solid #C41E1E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    color: '#C41E1E',
    flexShrink: 0,
  });

  const captionStyle = {
    fontSize: '13px',
    color: '#555',
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: '180px',
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '10px',
          padding: '36px 40px 32px',
          maxWidth: '680px',
          width: '90%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#999',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px',
            transition: 'color 0.15s',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#333'}
          onMouseOut={(e) => e.currentTarget.style.color = '#999'}
        >
          ✕
        </button>

        {/* Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: 400,
          color: '#222',
          textAlign: 'center',
          marginBottom: '36px',
        }}>
          Upload photos from your smartphone
        </h3>

        {/* Three-step flow */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '24px',
        }}>
          {/* Step 1 — QR Code */}
          <div style={stepStyle}>
            <div style={numberStyle(1)}>1</div>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan to upload"
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '4px',
                }}
              />
            ) : (
              <div style={{
                width: 160, height: 160,
                background: '#f5f5f5',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: '12px',
              }}>
                Generating...
              </div>
            )}
            <p style={captionStyle}>
              Scan the QR code with your smartphone.
            </p>
          </div>

          {/* Step 2 — Upload from phone */}
          <div style={stepStyle}>
            <div style={numberStyle(2)}>2</div>
            {/* Phone with upload icon */}
            <svg width="100" height="160" viewBox="0 0 100 160" fill="none">
              {/* Phone body */}
              <rect x="15" y="8" width="70" height="130" rx="10" stroke="#333" strokeWidth="2.5" fill="white" />
              {/* Screen */}
              <rect x="22" y="22" width="56" height="100" rx="2" fill="#f8f8f8" />
              {/* Home button */}
              <circle cx="50" cy="140" r="4" stroke="#bbb" strokeWidth="1.5" fill="none" />
              {/* Image placeholder on screen */}
              <rect x="32" y="40" width="36" height="28" rx="3" fill="#C41E1E" fillOpacity="0.12" stroke="#C41E1E" strokeWidth="1.5" />
              {/* Mountain icon */}
              <path d="M36 62 L44 50 L50 56 L54 52 L64 64" stroke="#C41E1E" strokeWidth="1.2" fill="none" />
              <circle cx="42" cy="48" r="2.5" fill="#C41E1E" fillOpacity="0.4" />
              {/* Upload arrow */}
              <line x1="50" y1="95" x2="50" y2="78" stroke="#C41E1E" strokeWidth="2" />
              <polyline points="42,85 50,78 58,85" stroke="#C41E1E" strokeWidth="2" fill="none" />
              {/* Dot below arrow */}
              <circle cx="50" cy="100" r="2.5" fill="#C41E1E" />
            </svg>
            <p style={captionStyle}>
              Select and upload photos on your smartphone.
            </p>
          </div>

          {/* Step 3 — Photos appear */}
          <div style={stepStyle}>
            <div style={numberStyle(3)}>3</div>
            {/* Desktop with synced photos */}
            <svg width="140" height="160" viewBox="0 0 140 160" fill="none">
              {/* Monitor */}
              <rect x="15" y="12" width="110" height="80" rx="6" stroke="#333" strokeWidth="2.5" fill="white" />
              {/* Screen */}
              <rect x="22" y="19" width="96" height="60" rx="2" fill="#f8f8f8" />
              {/* Three image thumbnails on screen */}
              {[30, 55, 80].map((x, i) => (
                <g key={i}>
                  <rect x={x} y="30" width="22" height="18" rx="2" fill="#C41E1E" fillOpacity={0.1 + i * 0.05} stroke="#C41E1E" strokeWidth="1" />
                  <path d={`M${x+3} ${44} L${x+8} ${36} L${x+12} ${40} L${x+15} ${37} L${x+19} ${44}`} stroke="#C41E1E" strokeWidth="0.8" fill="none" />
                  <circle cx={x+7} cy={35} r="1.5" fill="#C41E1E" fillOpacity="0.4" />
                </g>
              ))}
              {/* Monitor stand */}
              <line x1="70" y1="92" x2="70" y2="106" stroke="#333" strokeWidth="2.5" />
              <line x1="50" y1="106" x2="90" y2="106" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
              {/* Arrow from phone to monitor */}
              <line x1="8" y1="58" x2="18" y2="58" stroke="#C41E1E" strokeWidth="2" />
              <polyline points="14,53 19,58 14,63" stroke="#C41E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <p style={captionStyle}>
              Uploaded photos appear here automatically.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid #e5e5e5',
          margin: '8px 0 0',
        }} />
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
