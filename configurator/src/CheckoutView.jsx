import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function CheckoutView() {
  const { cartItems, cartTotalPrice, isCheckoutOpen, setIsCheckoutOpen, updateQuantity, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');

  if (!isCheckoutOpen) return null;

  const shippingCost = shippingMethod === 'express' ? 30 : 15;
  const tax = cartTotalPrice * 0.20;
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
            <button className="co-back" onClick={() => setIsCheckoutOpen(false)}>
              ← Back to Configurator
            </button>
          </header>

          {/* Progress Bar */}
          <div className="co-progress">
            <div className="co-progress-step done"></div>
            <div className="co-progress-step active"></div>
          </div>

          {/* Page Title */}
          <h1 className="co-heading">Checkout</h1>

          {/* 1. Customer Information */}
          <div className="co-section">
            <h2 className="co-section-title">1. Customer Information</h2>
            <input type="text" placeholder="Full Name" className="co-input" />
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

          {/* 3. Shipping Method */}
          <div className="co-section">
            <h2 className="co-section-title">3. Shipping Method</h2>
            <div className="co-shipping-toggle">
              <button
                className={`co-ship-btn ${shippingMethod === 'standard' ? 'active' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                Standard <span className="co-ship-price">£15</span>
              </button>
              <button
                className={`co-ship-btn ${shippingMethod === 'express' ? 'active' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                Express <span className="co-ship-price">£30</span>
              </button>
            </div>
          </div>

          {/* 4. Payment */}
          <div className="co-section">
            <h2 className="co-section-title">4. Payment</h2>

            <div className="co-pay-tabs">
              <button
                className={`co-pay-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                Credit Card
              </button>
              <button
                className={`co-pay-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                PayPal
              </button>
              <button
                className={`co-pay-tab ${paymentMethod === 'googlepay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('googlepay')}
              >
                Google Pay
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="co-card-fields">
                <input type="text" placeholder="Cardholder Name" className="co-input" />
                <input type="text" placeholder="Card Number" className="co-input" />
                <div className="co-row">
                  <input type="text" placeholder="Expiry" className="co-input" />
                  <input type="text" placeholder="CVV" className="co-input" />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="co-alt-pay-msg">
                You will be redirected to PayPal to complete payment.
              </div>
            )}

            {paymentMethod === 'googlepay' && (
              <div className="co-alt-pay-msg">
                You will be redirected to Google Pay to complete payment.
              </div>
            )}
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

          {/* Frame Gallery — show user's actual ordered frames, max 3 */}
          <div className="co-frame-gallery">
            {cartItems.slice(0, 3).map((item, i) => (
              <div key={`hero-${i}`} className="co-frame-card">
                {item.image ? (
                  <img src={item.image} alt={item.frameName} />
                ) : (
                  <div className="co-frame-card-ph" />
                )}
              </div>
            ))}
          </div>

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
              <span>Shipping</span>
              <span>£{shippingCost.toFixed(2)}</span>
            </div>
            <div className="co-totals-row">
              <span>Tax</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="co-totals-row co-totals-final">
              <span>Order Total:</span>
              <span className="co-grand-total">£{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Button — directly beneath the total */}
          <button className="co-pay-btn-dark">
            Pay Now &nbsp;→
          </button>
          <p className="co-secure-text-dark">🔒 Proceed Securely</p>

          {/* Trust Badges */}
          <div className="co-trust">
            <p className="co-trust-label">SECURE CHECKOUT</p>
            <p className="co-trust-sub">Free Returns &amp; Expert Framing Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
