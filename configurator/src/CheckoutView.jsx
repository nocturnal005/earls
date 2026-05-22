import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function CheckoutView() {
  const { cartItems, cartTotalPrice, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!isCheckoutOpen) return null;

  const vat = cartTotalPrice * 0.20; // 20% VAT
  const shipping = 9.99;
  const finalTotal = cartTotalPrice + vat + shipping;

  return (
    <div className="checkout-overlay">
      <div className="checkout-container">
        
        {/* Header */}
        <header className="checkout-header">
          <div className="checkout-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={`${import.meta.env.BASE_URL}earls_logo.png`} alt="Earl's Picture Framing Logo" style={{ height: '40px' }} />
            <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '0.05em', color: '#2A2725' }}>EARL'S PICTURE FRAMING</span>
          </div>
          <button className="back-btn" onClick={() => setIsCheckoutOpen(false)}>
            ← Back to Configurator
          </button>
        </header>

        <div className="checkout-content">
          {/* Left Column: Forms */}
          <div className="checkout-form-section">
            <h2 className="checkout-title">Checkout</h2>
            
            <div className="form-group">
              <label>Contact Information</label>
              <input type="email" placeholder="Email Address" className="form-input" />
            </div>

            <div className="form-group">
              <label>Shipping Address</label>
              <div className="form-row">
                <input type="text" placeholder="First Name" className="form-input half" />
                <input type="text" placeholder="Last Name" className="form-input half" />
              </div>
              <input type="text" placeholder="Address" className="form-input" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="form-input" />
              <div className="form-row">
                <input type="text" placeholder="City" className="form-input half" />
                <input type="text" placeholder="Postal Code" className="form-input half" />
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="radio-circle"></div>
                  <span>Credit / Debit Card (Visa, Mastercard, etc.)</span>
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="radio-circle"></div>
                  <span>PayPal</span>
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'applepay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('applepay')}
                >
                  <div className="radio-circle"></div>
                  <span>Apple Pay</span>
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'googlepay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('googlepay')}
                >
                  <div className="radio-circle"></div>
                  <span>Google Pay</span>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <input type="text" placeholder="Card Number" className="form-input" />
                  <div className="form-row">
                    <input type="text" placeholder="MM / YY" className="form-input half" />
                    <input type="text" placeholder="CVC" className="form-input half" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="form-input" />
                </div>
              )}
            </div>

            <button className="pay-now-btn">Pay £{finalTotal.toFixed(2)}</button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-section">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-img">
                    {item.image ? <img src={item.image} alt={item.frameName} /> : <div className="placeholder" />}
                    <span className="summary-item-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-details">
                    <h4>{item.frameName}</h4>
                    <p>{item.dimensions}</p>
                  </div>
                  <div className="summary-item-price">
                    £{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>£{cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>£{shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Estimated VAT (20%)</span>
                <span>£{vat.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-price">
                  <span className="currency">GBP</span> £{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
