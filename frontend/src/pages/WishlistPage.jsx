// frontend/src/pages/WishlistPage.jsx
import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  // 1. Pretty Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your favorites...</p>
      </div>
    );
  }

  // 2. Pretty Empty State
  if (wishlist.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items yet. Start browsing to find your new favorites!
          </p>
          <Link
            to="/"
            className="inline-block w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );

  // 3. Main Wishlist Grid
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Your Wishlist <span className="text-pink-500">❤️</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Saved items you want to buy later.
            </p>
          </div>
          
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            <span>←</span> Continue Shopping
          </Link>
        </div>

        {/* Product Grid */}
        {/* Uses the same responsive grid logic as Home */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>

        {/* Bottom Action (Mobile Friendly) */}
        <div className="text-center border-t border-gray-200 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
          >
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;