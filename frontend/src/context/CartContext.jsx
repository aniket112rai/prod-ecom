// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Automatically send cookies with every request
  axios.defaults.withCredentials = true;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/cart");
      setCart(data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/cart", {
        productId,
        quantity,
      });
      setCart(data?.items || []);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`http://localhost:3000/api/cart/${itemId}`, {
        quantity,
      });
      setCart(data?.items || []);
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`http://localhost:3000/api/cart/${itemId}`);
      setCart(data?.items || []);
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
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
