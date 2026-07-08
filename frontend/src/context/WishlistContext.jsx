/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setLoading(false);
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://prod-ecom-backend.onrender.com/api/wishlist",
        {
          withCredentials: true,
        }
      );

      setWishlist(data);
    } catch (err) {
      setWishlist([]);

      if (err.response?.status !== 401) {
        console.error("Failed to fetch wishlist:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        "https://prod-ecom-backend.onrender.com/api/wishlist",
        { productId },
        { withCredentials: true }
      );

      setWishlist(data);
    } catch (err) {
      if (err.response?.status === 401) {
        clearWishlist();
        return;
      }

      console.error("Failed to add to wishlist:", err);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const { data } = await axios.delete(
        `https://prod-ecom-backend.onrender.com/api/wishlist/${wishlistId}`,
        { withCredentials: true }
      );

      setWishlist(data);
    } catch (err) {
      if (err.response?.status === 401) {
        clearWishlist();
        return;
      }

      console.error("Failed to remove from wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);