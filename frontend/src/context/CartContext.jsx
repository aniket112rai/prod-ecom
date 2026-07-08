// frontend/src/context/CartContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Automatically send cookies with every request
  axios.defaults.withCredentials = true;

  const clearCart = useCallback(() => {
    setCart([]);
    setLoading(false);
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://prod-ecom-backend.onrender.com/api/cart");
      setCart(data?.items || []);
    } catch (err) {
      setCart([]);
      if (err.response?.status !== 401) {
        console.error("Error fetching cart:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post("https://prod-ecom-backend.onrender.com/api/cart", {
        productId,
        quantity,
      });
      setCart(data?.items || []);
    } catch (err) {
      if (err.response?.status === 401) {
        clearCart();
        return;
      }
      console.error("Error adding to cart:", err);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`https://prod-ecom-backend.onrender.com/api/cart/${itemId}`, {
        quantity,
      });
      setCart(data?.items || []);
    } catch (err) {
      if (err.response?.status === 401) {
        clearCart();
        return;
      }
      console.error("Error updating cart item:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`https://prod-ecom-backend.onrender.com/api/cart/${itemId}`);
      setCart(data?.items || []);
    } catch (err) {
      if (err.response?.status === 401) {
        clearCart();
        return;
      }
      console.error("Error removing cart item:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        clearCart,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
