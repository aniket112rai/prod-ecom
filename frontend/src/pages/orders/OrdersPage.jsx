// frontend/src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://prod-ecom-backend.onrender.com/api/orders", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper to make status look pretty (Visual only, no logic change)
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("deliver") || s.includes("complete")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("pending") || s.includes("process")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s.includes("cancel") || s.includes("fail")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-100"; // Default
  };

  // 1. Loading State
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );

  // 2. Empty State
  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛍️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 mb-8">
            You haven't placed any orders yet. Start shopping to see them here!
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

  // 3. Main List
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your purchases.</p>
          </div>
          <Link
            to="/"
            className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition"
          >
            <span>←</span> Back to Home
          </Link>
        </div>
        
        {/* Orders Grid */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Side: Order Info */}
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center justify-between md:justify-start md:gap-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Order ID
                  </span>
                  <span className="font-mono text-gray-800 font-medium bg-gray-100 px-2 py-0.5 rounded text-sm">
                    #{order.id}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                   {/* Price */}
                  <div className="text-xl font-bold text-gray-900">
                    ${order.total}
                  </div>
                  
                  {/* Divider */}
                  <span className="text-gray-300 hidden md:inline">|</span>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <div className="md:flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <Link
                  to={`/orders/${order.id}`}
                  className="block w-full md:w-auto text-center bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-6 py-2.5 rounded-xl font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation (Optional extra back button) */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Need help with an order? <a href="#" className="text-indigo-500 hover:underline">Contact Support</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;