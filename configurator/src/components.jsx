import React from 'react';
import { ChevronRight, ChevronLeft, Upload, Smartphone, ReturnIcon } from './Icons.jsx';

// Reusable green button
export function GreenButton({ children, onClick, className = '', fullWidth = false }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#C41E1E] hover:bg-[#A31818] text-white font-semibold py-3 px-6 rounded transition-colors cursor-pointer ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}


// Sticky price + apply bar at bottom of panels — matches WhiteWall layout
export function StickyPriceBar({ price, onApply, buttonText = 'APPLY CHANGE' }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid #e5e7eb',
      padding: '16px 16px 12px 16px', marginTop: 'auto',
    }}>
      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#888' }}>
          Price incl. VAT, excl.{' '}
          <span style={{ color: '#C41E1E', textDecoration: 'underline', cursor: 'pointer' }}>shipping</span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#C41E1E', letterSpacing: '-0.02em' }}>
          £ {price.toFixed(2)}
        </span>
      </div>
      {/* Apply button */}
      <button onClick={onApply}
        style={{
          width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#C41E1E', color: 'white', fontWeight: 700, fontSize: 14,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          border: 'none', borderRadius: 0, cursor: 'pointer', transition: 'background 0.2s',
          marginBottom: '16px'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#A31818'}
        onMouseLeave={e => e.currentTarget.style.background = '#C41E1E'}
      >
        {buttonText} <ReturnIcon size={14} />
      </button>

      {/* Footer Links */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        fontSize: '12px', 
        color: '#707070',
        flexWrap: 'wrap'
      }}>
        {['Terms & Conditions', 'Privacy policy', 'Cookie Settings', 'Legal Info'].map((link, i) => (
          <React.Fragment key={link}>
            <span style={{ cursor: 'pointer', hover: { textDecoration: 'underline' } }}>{link}</span>
            {i < 3 && <span style={{ color: '#E0E0E0' }}>|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Section summary row in the sidebar — uses div (not button) to avoid Tailwind base reset
export function SummaryRow({ icon, label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-summary-row="true"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '28px 24px',
        background: 'white',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
      onMouseLeave={e => e.currentTarget.style.background = 'white'}
    >
      <span style={{ color: '#555', flexShrink: 0, width: '40px', display: 'flex', justifyContent: 'center' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{value}</div>
      </div>
      <ChevronRight style={{ color: '#bbb', flexShrink: 0 }} size={22} />
    </div>
  );
}

// Panel header with back arrow — matches WhiteWall (green < arrow, bold uppercase title)
export function PanelHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
      <button onClick={onBack} className="text-[#C41E1E] hover:text-[#A31818] transition-colors cursor-pointer">
        <ChevronLeft size={24} />
      </button>
      <h2 className="text-base font-bold text-[#111] uppercase tracking-wide">{title}</h2>
    </div>
  );
}


// Upload zone component — WhiteWall-inspired, Earl's branding
export function UploadZone({ onFileSelect, onSmartphone, compact = false }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onFileSelect(ev.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onFileSelect(ev.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '6px',
        padding: compact ? '24px 16px' : '40px 28px',
        textAlign: 'center',
        transition: 'border-color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = '#999'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
    >
      {/* Large title */}
      <p style={{
        fontSize: compact ? '18px' : '22px',
        fontWeight: 300,
        color: '#222',
        marginBottom: '12px',
        lineHeight: 1.3,
      }}>
        Drag & Drop Your Files Here
      </p>

      {/* File specs */}
      <p style={{
        fontSize: '13px',
        color: '#777',
        lineHeight: 1.6,
        maxWidth: '340px',
        margin: '0 auto 28px',
      }}>
        JPG/TIFF/HEIC, min 700 x 700 px, max 50,000 x 50,000 px or 1,000 MP, max 2 GB. We save uploaded photos in your customer account for 90 days.
      </p>

      {/* UPLOAD PHOTOS — red, centered, not full-width */}
      <label style={{ display: 'block', marginBottom: '16px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#C41E1E',
          color: 'white',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '0.5px',
          padding: '14px 48px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
          onMouseOver={(e) => e.currentTarget.style.background = '#A31818'}
          onMouseOut={(e) => e.currentTarget.style.background = '#C41E1E'}
        >
          <Upload size={16} />
          UPLOAD PHOTOS
        </div>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </label>

      {/* From smartphone — black outline, centered */}
      <div style={{ marginBottom: '24px' }}>
        <button onClick={onSmartphone} style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          border: '1.5px solid #333',
          borderRadius: '4px',
          background: 'white',
          color: '#333',
          fontWeight: 500,
          fontSize: '14px',
          padding: '12px 40px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#333'; }}
        >
          {/* QR code icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" rx="0.5" />
            <rect x="11" y="1" width="6" height="6" rx="0.5" />
            <rect x="1" y="11" width="6" height="6" rx="0.5" />
            <rect x="3" y="3" width="2" height="2" fill="currentColor" stroke="none" />
            <rect x="13" y="3" width="2" height="2" fill="currentColor" stroke="none" />
            <rect x="3" y="13" width="2" height="2" fill="currentColor" stroke="none" />
            <rect x="11" y="11" width="2" height="2" fill="currentColor" stroke="none" />
            <rect x="15" y="13" width="2" height="2" fill="currentColor" stroke="none" />
            <rect x="13" y="15" width="2" height="2" fill="currentColor" stroke="none" />
          </svg>
          From smartphone
        </button>
      </div>

      {/* Login link — two lines like WhiteWall */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: '13px',
          color: '#C41E1E',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontWeight: 500,
        }}>
          Please login
        </span>
        <p style={{
          fontSize: '13px',
          color: '#777',
          marginTop: '2px',
        }}>
          to access your photos
        </p>
      </div>
    </div>
  );
}
