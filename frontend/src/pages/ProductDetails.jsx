// frontend/src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cart, addToCart } = useCart();

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/products/${id}`, {
          withCredentials: true,
        });
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/reviews/${id}`, {
        withCredentials: true,
      });
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ✅ Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      setReviewLoading(true);
      await axios.post(
        "http://localhost:3000/api/reviews",
        { productId: id, rating, comment: reviewText },
        { withCredentials: true }
      );
      setReviewText("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Error adding review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  // ✅ Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        withCredentials: true,
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  // ✅ Wishlist & Cart sync
  useEffect(() => {
    if (!product) return;
    setIsWishlisted(wishlist.some((item) => item.product?.id === product.id));
    setIsInCart(cart.some((item) => item.product?.id === product.id));
  }, [wishlist, cart, product]);

  const toggleWishlist = () => {
    if (!product) return;
    const wishlistItem = wishlist.find((item) => item.product?.id === product.id);
    if (isWishlisted && wishlistItem) removeFromWishlist(wishlistItem.id);
    else addToWishlist(product.id);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    await addToCart(product.id, 1);
  };

  // --- UI STATES ---

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading product...</p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            ← Go back home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      
      {/* Breadcrumb / Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition flex items-center gap-1">
           <span>←</span> Back to Products
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            {/* Left: Image Area */}
            <div className="relative bg-gray-100 aspect-square md:aspect-auto flex items-center justify-center p-6 md:p-12 group">
               {/* Floating Wishlist Button */}
               <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md z-10 hover:scale-110 transition-transform"
              >
                {isWishlisted ? (
                  <span className="text-2xl leading-none">❤️</span>
                ) : (
                  <span className="text-2xl leading-none opacity-40">🤍</span>
                )}
              </button>

              <img
                src={product.images}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Details Area */}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              
              {/* Stock Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  product.stock > 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400 text-lg">
                   <span>⭐</span>
                </div>
                <span className="font-medium text-gray-900">
                  {product.rating ? product.rating.toFixed(1) : "New"}
                </span>
                <span className="text-gray-400 mx-1">•</span>
                <span className="text-gray-500 underline cursor-pointer hover:text-indigo-600">
                  {reviews.length} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                {product.description || "No description available for this product."}
              </div>

              {/* Desktop Actions (Hidden on Mobile) */}
              <div className="hidden md:flex gap-4">
                 {isInCart ? (
                  <button 
                    onClick={() => navigate("/cart")} 
                    className="flex-1 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 px-8 py-4 rounded-xl font-bold shadow-lg transition ${
                      product.stock === 0 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                    }`}
                  >
                    {product.stock === 0 ? "Sold Out" : "Add to Cart"}
                  </button>
                )}
                
                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-4 rounded-xl font-bold border-2 transition ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isWishlisted ? "Saved" : "Save"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleAddReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars {r === 5 ? "(Excellent)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How was the product?"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px]"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={reviewLoading} 
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                           {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{r.user?.name || "Anonymous"}</h4>
                          <div className="flex text-yellow-400 text-sm">
                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-4 text-gray-600 leading-relaxed">{r.comment}</p>

                    {/* Delete Button (Conditional) */}
                    {currentUser && (r.userId === currentUser.id || currentUser.role === "admin") && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                        <button 
                          onClick={() => handleDeleteReview(r.id)} 
                          className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden z-50 flex gap-3">
         {isInCart ? (
            <button 
              onClick={() => navigate("/cart")}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-transform"
            >
              Go to Cart
            </button>
         ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition active:scale-95 ${
                 product.stock === 0 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-indigo-600 text-white shadow-indigo-200"
              }`}
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
         )}
         <button
            onClick={toggleWishlist}
            className={`px-4 rounded-xl border-2 flex items-center justify-center active:scale-95 transition ${
                isWishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400"
            }`}
         >
            <span className="text-xl">{isWishlisted ? "❤️" : "🤍"}</span>
         </button>
      </div>

    </div>
  );
};

export default ProductDetails;