// frontend/src/pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, loading } = useCart();

  // 1. Loading State
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your cart...</p>
      </div>
    );

  // 2. Empty State
  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything yet. Go ahead and explore our products!
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

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 3. Main Cart Layout
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Shopping Cart <span className="text-gray-400 text-lg font-medium">({cart.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                <span>←</span> <span className="ml-2">Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 mb-2">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:shadow-xl"
              >
                Proceed to Checkout
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure Checkout - SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;