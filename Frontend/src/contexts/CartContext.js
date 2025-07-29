// filepath: c:\Users\HP\OneDrive\Desktop\Work\Iproject1\login-frontend\src\contexts\CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});

  const addToCart = (product) => {
    setCart(prevCart => {
      if (!prevCart.find(item => item.id === product.id)) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
    setCartQuantities(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    setCartQuantities(prev => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const updateQuantity = (productId, delta, fromCart = false) => {
    const currentQty = cartQuantities[productId] || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartQuantities(prev => ({
      ...prev,
      [productId]: newQty
    }));

    if (fromCart) {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartQuantities({});
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartQuantities,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};