// frontend/src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`https://prod-ecom-backend.onrender.com/api/orders/${id}`, {
        withCredentials: true,
      });
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Helper for status badge colors
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "paid" || s === "delivered" || s === "confirmed") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending" || s === "processing") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "cancelled" || s === "failed") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // 1. Loading State
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading order details...</p>
      </div>
    );

  // 2. Error/Empty State
  if (!order)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <Link to="/orders" className="text-indigo-600 hover:underline font-medium">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );

  // 3. Main Content
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Back Link */}
        <div className="mb-6">
          <Link to="/orders" className="text-sm text-gray-500 hover:text-indigo-600 transition flex items-center gap-1 mb-4">
            <span>←</span> Back to My Orders
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Summary</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          
          {/* Top Section: ID & Statuses */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order ID</p>
                <p className="text-lg font-mono font-semibold text-gray-800 break-all">#{order.id}</p>
              </div>
              
              <div className="flex gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.payment?.status)}`}>
                  Payment: {order.payment?.status || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Items Purchased</h3>
            <div className="space-y-0 divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600">
                      📦
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.product?.name || "Unknown Product"}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-indigo-50/30 p-6 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Shipping Address</h3>
                <p className="text-gray-600 leading-relaxed">
                  {order.address?.line1 || "No address provided"}
                </p>
              </div>
            </div>
          </div>

        </div>

        
        
      </div>
    </div>
  );
};

export default OrderDetails;