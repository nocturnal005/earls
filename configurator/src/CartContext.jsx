import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'earls_configurator_cart';

// Restore the basket from a previous visit. The customer's raw uploaded File
// can't be serialised, so it won't survive a reload — but the configuration,
// price and framed preview do, and the server re-prices from the selection at
// checkout regardless, so a restored basket is always charged correctly.
function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Persist the basket so it survives a refresh / coming back later.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // File objects can't be JSON-serialised — drop rawImageFile from storage.
    const persistable = cartItems.map(({ rawImageFile, ...rest }) => rest);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // Quota exceeded (large preview data URLs) — retry without the images so
      // at least the configuration + price survive.
      try {
        const slim = persistable.map(({ image, ...rest }) => rest);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
      } catch {
        /* storage unavailable — basket still works in-memory for this session */
      }
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, { ...item, id: Date.now().toString(), quantity: item.quantity || 1 }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartTotalPrice,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
