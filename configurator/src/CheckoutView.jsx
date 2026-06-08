import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { FLAT_VAT, PACKING_DELIVERY } from './newData';

export default function CheckoutView() {
  const { cartItems, cartTotalPrice, isCheckoutOpen, setIsCheckoutOpen, updateQuantity, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');

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

  const shippingCost = PACKING_DELIVERY;
  const tax = FLAT_VAT;
  const orderTotal = cartTotalPrice + shippingCost + tax;

  return (
    <div className="co-overlay">
      {/* Left Pane — Form */}
      <div className="co-left">
        <div className="co-left-inner">

          {/* Header with Earl's branding */}
          <header className="co-header">
            <div className="co-header-brand">
              <img src={`${import.meta.env.BASE_URL}earls_logo.png`} alt="Earl's Picture Framing" className="co-header-logo" />
              <span className="co-header-name">EARL'S PICTURE FRAMING</span>
            </div>
          </header>

          {/* Page Title */}
          <h1 className="co-heading">Checkout</h1>

          {/* 1. Customer Information */}
          <div className="co-section">
            <h2 className="co-section-title">1. Customer Information</h2>
            <div className="co-row">
              <input type="email" placeholder="Email" className="co-input" />
              <input type="tel" placeholder="Phone" className="co-input" />
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="co-section">
            <h2 className="co-section-title">2. Shipping Address</h2>
            <div className="co-row">
              <input type="text" placeholder="First Name" className="co-input" />
              <input type="text" placeholder="Last Name" className="co-input" />
            </div>
            <div className="co-row">
              <input type="text" placeholder="Street Address" className="co-input co-grow" />
              <input type="text" placeholder="Apt" className="co-input co-small" />
            </div>
            <div className="co-row">
              <input type="text" placeholder="City" className="co-input" />
              <input type="text" placeholder="Postcode" className="co-input" />
            </div>
          </div>

          {/* 3. Packing & Delivery */}
          <div className="co-section">
            <h2 className="co-section-title">3. Packing &amp; Delivery</h2>
            <div className="co-shipping-toggle">
              <button className="co-ship-btn active" style={{ cursor: 'default' }}>
                Standard <span className="co-ship-price">£{PACKING_DELIVERY.toFixed(2)}</span>
              </button>
            </div>
          </div>


          {/* Footer */}
          <footer className="co-footer">
            <div className="co-footer-links">
              <a href="#">Privacy Policy</a>
              <span className="co-footer-dot">·</span>
              <a href="#">Terms &amp; Conditions</a>
              <span className="co-footer-dot">·</span>
              <a href="#">Contact Us</a>
            </div>
            <p className="co-footer-copy">© {new Date().getFullYear()} Earl's Picture Framing. All rights reserved.</p>
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
              <span>Packing &amp; Delivery</span>
              <span>£{shippingCost.toFixed(2)}</span>
            </div>
            <div className="co-totals-row">
              <span>VAT</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="co-totals-row co-totals-final">
              <span>Order Total:</span>
              <span className="co-grand-total">£{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="co-pay-btn-dark">
            Make Payment
          </button>

          {/* Trust Badges */}
          <div className="co-trust">
            <p className="co-trust-label">SECURE CHECKOUT</p>
            <p className="co-trust-sub">Free Returns &amp; Expert Framing Guarantee</p>
          </div>

          <button className="co-back" onClick={() => setIsCheckoutOpen(false)} style={{ marginTop: '20px', alignSelf: 'flex-end' }}>
            ← Back to Configurator
          </button>
        </div>
      </div>
    </div>
  );
}
