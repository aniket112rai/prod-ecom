import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist once on mount
  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/wishlist", {
        withCredentials: true,
      });
      setWishlist(data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add product
  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/wishlist",
        { productId },
        { withCredentials: true }
      );
      setWishlist(data);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  // Remove product
  const removeFromWishlist = async (wishlistId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/wishlist/${wishlistId}`,
        { withCredentials: true }
      );
      setWishlist(data);
    } catch (err) {
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
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
