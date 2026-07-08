// frontend/src/pages/Home.jsx
import React, { useCallback, useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import Filters from "../components/Filters";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const defaultFilters = {
  search: "",
  category: "",
  priceMin: "",
  priceMax: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const { clearCart, fetchCart } = useCart();
  const { clearWishlist, fetchWishlist } = useWishlist();
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const fetchProducts = useCallback(async (nextFilters, page = 1) => {
    try {
      const params = new URLSearchParams({
        ...nextFilters,
        page,
        limit: pagination.limit,
      }).toString();

      const { data } = await axios.get(
        `https://prod-ecom-backend.onrender.com/api/products?${params}`
      );

      setProducts(Array.isArray(data) ? data : data.products || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }, [pagination.limit]);

  const handleFilter = (nextFilters) => {
    setFilters(nextFilters);
    fetchProducts(nextFilters, 1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchProducts(filters, page);
  };

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://prod-ecom-backend.onrender.com/api/auth/me",
        { withCredentials: true }
      );

      setUser(data);
      await Promise.all([fetchCart(), fetchWishlist()]);
    } catch (err) {
      setUser(null);
      clearCart();
      clearWishlist();

      if (err.response?.status !== 401) {
        console.log(err);
      }
    }
  }, [clearCart, clearWishlist, fetchCart, fetchWishlist]);

  useEffect(() => {
    fetchProducts(defaultFilters, 1);
    fetchUser();
  }, [fetchProducts, fetchUser]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-600 tracking-tighter hover:opacity-80 transition"
              >
                ChorBazar
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                    title="My Orders"
                  >
                    <span className="hidden md:block font-medium text-sm">Orders</span>
                  </Link>

                  <Link
                    to="/addresses"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                    title="Addresses"
                  >
                    <span className="hidden md:block font-medium text-sm">Addresses</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition flex items-center gap-2"
                    title="Wishlist"
                  >
                    <span className="hidden md:block font-medium text-sm">Wishlist</span>
                  </Link>

                  <Link
                    to="/cart"
                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition flex items-center gap-2"
                    title="Cart"
                  >
                    <span className="hidden md:block font-bold text-sm">Cart</span>
                  </Link>

                  <button
                    onClick={async () => {
                      await axios.post(
                        "https://prod-ecom-backend.onrender.com/api/auth/logout",
                        {},
                        { withCredentials: true }
                      );
                      setUser(null);
                      clearCart();
                      clearWishlist();
                    }}
                    className="p-2 ml-1 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                    title="Logout"
                  >
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

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Discover Our <span className="text-indigo-600">Collection</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Hand-picked items just for you. Browse our latest arrivals and find
            your perfect match today.
          </p>
        </div>

        <div className="mb-10">
          <Filters onFilter={handleFilter} />
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center px-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Shop is empty
            </h3>
            <p className="text-gray-500">
              We couldn't find any products right now. Check back later!
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <ProductList products={products} />

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ·{" "}
                  {pagination.total} products
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ChorBazar. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;