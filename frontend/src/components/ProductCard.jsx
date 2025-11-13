// frontend/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlist.some(
    (item) => item.product?.id === product.id
  );

  const toggleWishlist = (e) => {
    // Prevent navigation to product details when clicking the heart
    e.preventDefault(); 
    const wishlistItem = wishlist.find(
      (item) => item.product?.id === product.id
    );
    if (isWishlisted && wishlistItem) removeFromWishlist(wishlistItem.id);
    else addToWishlist(product.id);
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 w-full">
      
      {/* Image Container with Hover Zoom */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.images}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
             <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button (Floating) */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all duration-200 z-20 group/btn"
        >
          {isWishlisted ? (
            // Solid Heart (Active)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            // Outline Heart (Inactive)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <Link to={`/products/${product.id}`}>
            <h2 className="font-bold text-gray-800 text-lg mb-1 truncate hover:text-indigo-600 transition-colors">
            {product.name}
            </h2>
        </Link>

        {/* Rating & Price Row */}
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium bg-yellow-50 px-2 py-0.5 rounded-md">
                <span>⭐</span>
                <span className="text-gray-700">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
            </div>
            <p className="text-lg font-bold text-indigo-600">
                ${product.price.toFixed(2)}
            </p>
        </div>

        {/* Action Button */}
        <Link
          to={`/products/${product.id}`}
          className="mt-auto w-full block text-center bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-600 transition-colors shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;