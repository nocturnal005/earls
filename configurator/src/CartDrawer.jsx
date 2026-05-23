import React from 'react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, setIsCheckoutOpen, removeFromCart, updateQuantity, cartTotalPrice } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="cart-backdrop"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Basket</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your basket is empty.</p>
              <button className="start-btn" onClick={() => setIsCartOpen(false)}>Start Framing</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.image ? (
                    <img src={item.image} alt={item.frameName} />
                  ) : (
                    <div className="cart-item-placeholder">No Image</div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.frameName}</h3>
                  <p className="cart-item-desc">{item.dimensions}</p>
                  {item.mount && <p className="cart-item-desc">+ {item.mount} mount</p>}
                  <p className="cart-item-price">£{item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span className="cart-price">£{cartTotalPrice.toFixed(2)}</span>
            </div>
            <p className="cart-vat-note">Shipping & taxes calculated at checkout</p>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Checkout
            </button>
            <button className="continue-framing-btn" onClick={() => setIsCartOpen(false)}>
              Continue Framing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
