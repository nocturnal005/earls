import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { calcStandardDelivery, calcExpressDelivery, VAT_RATE } from './newData';

const SUPABASE_URL = 'https://nytevdjawjoxqfkafwxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dGV2ZGphd2pveHFma2Fmd3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDc3OTQsImV4cCI6MjA5NjQ4Mzc5NH0.wHh0rIioMpwtHWGnYeZn51IMCs5cK1Rohd7QXuc2DNY';

function imageToJpegBlob(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob returned null')), 'image/jpeg', 0.85);
    };
    img.onerror = () => reject(new Error('Image load failed for ' + src?.substring(0, 40)));
    img.src = src;
  });
}

async function uploadToStorage(blob, path) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/order-images/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': blob.type,
    },
    body: blob,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    console.error('Storage upload failed:', res.status, err);
    throw new Error('Upload failed: ' + res.status);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/order-images/${path}`;
}

export default function CheckoutView() {
  const { cartItems, cartTotalPrice, isCheckoutOpen, setIsCheckoutOpen, updateQuantity, removeFromCart, clearCart } = useCart();

  // Form state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Delivery scales with the largest item, for standard and express alike.
  const standardDelivery = cartItems.length
    ? Math.max(...cartItems.map(i => calcStandardDelivery(i.longestEdgeCm || 0)))
    : 0;
  const expressDelivery = cartItems.length
    ? Math.max(...cartItems.map(i => calcExpressDelivery(i.longestEdgeCm || 0)))
    : 0;
  const shippingCost = shippingMethod === 'express' ? expressDelivery : standardDelivery;
  // Prices are VAT-inclusive throughout, so the order total already contains VAT.
  const orderTotal = cartTotalPrice + shippingCost;
  const vatIncluded = orderTotal - orderTotal / (1 + VAT_RATE);

  const isFormValid = email && firstName && lastName && address && city && postcode;

  const handlePayment = async () => {
    if (!isFormValid) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      const imageUrls = {};
      for (const item of cartItems) {
        imageUrls[item.id] = {};
        const uid = crypto.randomUUID();
        try {
          if (item.image && (item.image.startsWith('data:') || item.image.startsWith('blob:'))) {
            const previewBlob = await imageToJpegBlob(item.image);
            imageUrls[item.id].preview = await uploadToStorage(previewBlob, `previews/${uid}.jpg`);
          }
        } catch (e) {
          console.error('Preview upload failed:', e);
        }
        try {
          if (item.rawImageFile) {
            const ext = item.rawImageFile.name.split('.').pop() || 'jpg';
            imageUrls[item.id].raw = await uploadToStorage(item.rawImageFile, `originals/${uid}.${ext}`);
          }
        } catch (e) {
          console.error('Raw image upload failed:', e);
        }
      }

      // Send authoritative selection IDs (not prices). The server recomputes
      // every price from the catalogue and ignores anything price-related here.
      const lines = cartItems.map(i => ({
        name: i.frameName,
        description: `${i.dimensions}${i.mount ? ' + ' + i.mount + ' mount' : ''}`,
        dims: i.dimensions,
        mount: i.mount,
        quantity: i.quantity,
        selection: i.selection,
        spec: {
          ...(i.spec || {}),
          previewImageUrl: imageUrls[i.id]?.preview || null,
          rawImageUrl: imageUrls[i.id]?.raw || null,
        },
      }));

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email,
          customer: { email, phone, firstName, lastName },
          shipping: { address, apt, city, postcode },
          shippingMethod,
          lines,
        }),
      });

      // Parse defensively — a non-JSON/empty body (e.g. 404 or a server error
      // page) must not surface as a raw "Unexpected end of JSON input".
      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error((data && data.error) || 'We couldn’t reach the payment service. Please try again in a moment.');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Payment could not be started. Please try again.');
      }
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="co-overlay">
      {/* Left Pane — Form */}
      <div className="co-left">
        <div className="co-left-inner">

          {/* Header with Earl's branding */}
          <header className="co-header">
            <div className="co-header-brand">
              <img src={`${import.meta.env.BASE_URL}earls_logo.png`} alt="Earl's Frames London" className="co-header-logo" />
              <span className="co-header-name">EARL'S FRAMES LONDON</span>
            </div>
          </header>

          {/* Page Title */}
          <h1 className="co-heading">Checkout</h1>

          {/* 1. Customer Information */}
          <div className="co-section">
            <h2 className="co-section-title">1. Customer Information</h2>
            <div className="co-row">
              <input type="email" placeholder="Email *" className="co-input" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="tel" placeholder="Phone" className="co-input" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="co-section">
            <h2 className="co-section-title">2. Shipping Address</h2>
            <div className="co-row">
              <input type="text" placeholder="First Name *" className="co-input" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              <input type="text" placeholder="Last Name *" className="co-input" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="co-row">
              <input type="text" placeholder="Street Address *" className="co-input co-grow" value={address} onChange={e => setAddress(e.target.value)} required />
              <input type="text" placeholder="Apt" className="co-input co-small" value={apt} onChange={e => setApt(e.target.value)} />
            </div>
            <div className="co-row">
              <input type="text" placeholder="City *" className="co-input" value={city} onChange={e => setCity(e.target.value)} required />
              <input type="text" placeholder="Postcode *" className="co-input" value={postcode} onChange={e => setPostcode(e.target.value)} required />
            </div>
          </div>

          {/* 3. Shipping Method */}
          <div className="co-section">
            <h2 className="co-section-title">3. Shipping Method</h2>
            <div className="co-shipping-toggle">
              <button
                className={`co-ship-btn ${shippingMethod === 'standard' ? 'active' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                <span>Standard</span>
                <span className="co-ship-detail">10–12 working days</span>
                <span className="co-ship-price">£{standardDelivery.toFixed(2)}</span>
              </button>
              <button
                className={`co-ship-btn ${shippingMethod === 'express' ? 'active' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                <span>Express</span>
                <span className="co-ship-detail">3–5 working days</span>
                <span className="co-ship-price">£{expressDelivery.toFixed(2)}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '14px', margin: '0 0 16px' }}>
              {error}
            </div>
          )}

          {/* Footer */}
          <footer className="co-footer">
            <div className="co-footer-links">
              <a href="#">Privacy Policy</a>
              <span className="co-footer-dot">·</span>
              <a href="#">Terms &amp; Conditions</a>
              <span className="co-footer-dot">·</span>
              <a href="#">Contact Us</a>
            </div>
            <p className="co-footer-copy">© {new Date().getFullYear()} Earl's Frames London. All rights reserved.</p>
          </footer>
        </div>
      </div>

      {/* Right Pane — Order Summary (Dark) */}
      <div className="co-right">
        <div className="co-right-inner">

          {/* Order Items */}
          <h3 className="co-order-title">Your Order</h3>

          <div className="co-order-items">
            {cartItems.map(item => (
              <div key={item.id} className="co-order-item">
                <div className="co-order-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.frameName} />
                  ) : (
                    <div className="co-order-thumb-ph" />
                  )}
                </div>
                <div className="co-order-info">
                  <h4>{item.frameName}</h4>
                  <p>{item.dimensions}</p>
                  {/* Quantity stepper */}
                  <div className="co-qty">
                    <button
                      className="co-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span className="co-qty-val">{item.quantity}</span>
                    <button
                      className="co-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  {/* Remove button */}
                  <button
                    className="co-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className="co-order-price">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="co-totals">
            <div className="co-totals-row">
              <span>Items Total</span>
              <span>£{cartTotalPrice.toFixed(2)}</span>
            </div>
            <div className="co-totals-row">
              <span>{shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'}</span>
              <span>£{shippingCost.toFixed(2)}</span>
            </div>
            <div className="co-totals-row">
              <span>Includes VAT</span>
              <span>£{vatIncluded.toFixed(2)}</span>
            </div>
            <div className="co-totals-row co-totals-final">
              <span>Order Total:</span>
              <span className="co-grand-total">£{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="co-pay-btn-dark"
            onClick={handlePayment}
            disabled={isProcessing}
            style={{ opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
          >
            {isProcessing ? 'Redirecting to payment...' : 'Make Payment'}
          </button>

          {/* Trust Badges */}
          <div className="co-trust">
            <p className="co-trust-label">SECURE CHECKOUT</p>
            <p className="co-trust-sub">Free Returns &amp; Expert Framing Guarantee</p>
          </div>

          <button className="co-back" onClick={() => setIsCheckoutOpen(false)} style={{ marginTop: '20px', alignSelf: 'flex-end', color: '#FFFFFF' }}>
            ← Back to Framing
          </button>
        </div>
      </div>
    </div>
  );
}
