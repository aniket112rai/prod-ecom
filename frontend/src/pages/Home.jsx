// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import Filters from "../components/Filters";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(
        `https://prod-ecom-backend.onrender.com/api/products?${params}`
      );
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("https://prod-ecom-backend.onrender.com/api/auth/me", {
        withCredentials: true,
      });
      setUser(data);
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      
      {/* ------------------------------------------------------- */}
      {/* ✅ Responsive Navbar */}
      {/* ------------------------------------------------------- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-16">
            
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold text-indigo-600 tracking-tighter hover:opacity-80 transition"
              >
                ChorBazar
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  {/* Orders */}
                  <Link
                    to="/orders"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                    title="My Orders"
                  >
                    {/* Icon always visible */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {/* Text hidden on mobile, visible on medium screens+ */}
                    <span className="hidden md:block font-medium text-sm">Orders</span>
                  </Link>

                  {/* Addresses */}
                  <Link
                    to="/addresses"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                    title="Addresses"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden md:block font-medium text-sm">Addresses</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition flex items-center gap-2"
                    title="Wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="hidden md:block font-medium text-sm">Wishlist</span>
                  </Link>

                  {/* Cart - Highlighted */}
                  <Link
                    to="/cart"
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition flex items-center gap-2"
                    title="Cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden md:block font-bold text-sm">Cart</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={async () => {
                      await axios.post(
                        "https://prod-ecom-backend.onrender.com/api/auth/logout",
                        {},
                        { withCredentials: true }
                      );
                      setUser(null);
                    }}
                    className="p-2 ml-1 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden md:block font-medium text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------- */}
      {/* Main Content */}
      {/* ------------------------------------------------------- */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Discover Our <span className="text-indigo-600">Collection</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Hand-picked items just for you. Browse our latest arrivals and find your perfect match today.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-10">
          <Filters onFilter={fetchProducts} />
        </div>

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center px-6">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
                alt="empty shop"
                className="w-24 h-24 opacity-50 grayscale"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Shop is empty 😔
            </h3>
            <p className="text-gray-500">
              We couldn't find any products right now. Check back later!
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
             <ProductList products={products} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} StoreName. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;