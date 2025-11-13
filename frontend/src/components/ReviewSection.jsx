import React, { useEffect, useState } from "react";
import { useReview } from "../context/ReviewContext";

const ReviewSection = ({ productId, currentUser }) => {
  const { reviews, loading, fetchReviews, addReview, deleteReview } = useReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (productId) fetchReviews(productId);
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert("Please add rating and comment");
      return;
    }
    addReview(productId, rating, comment);
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Reviews</h2>

      {/* Add Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <label className="font-medium text-gray-700">Your Rating:</label>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`text-2xl ${
                  num <= rating ? "text-yellow-400" : "text-gray-400"
                } hover:scale-110 transition`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-4">
          Please login to write a review.
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">
                  {review.user?.name || "Anonymous"}
                </p>
                <div className="text-yellow-400 text-lg">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(review.createdAt).toLocaleString()}
              </p>

              {/* Delete for owner or admin */}
              {currentUser &&
                (currentUser.role === "admin" || currentUser.id === review.userId) && (
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Delete
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
