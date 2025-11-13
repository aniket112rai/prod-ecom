import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (productId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://prod-ecom-backend.onrender.com/api/reviews/${productId}`,
        { withCredentials: true }
      );
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (productId, rating, comment) => {
    try {
      const { data } = await axios.post(
        `https://prod-ecom-backend.onrender.com/api/reviews`,
        { productId, rating, comment },
        { withCredentials: true }
      );
      setReviews((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding review:", err);
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`https://prod-ecom-backend.onrender.com/api/reviews/${id}`, {
        withCredentials: true,
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <ReviewContext.Provider
      value={{ reviews, loading, fetchReviews, addReview, deleteReview }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => useContext(ReviewContext);


