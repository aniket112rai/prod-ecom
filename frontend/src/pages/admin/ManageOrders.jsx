// frontend/src/pages/admin/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../../components/admin/AdminNav";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("https://prod-ecom-backend.onrender.com/api/orders/all", {
        withCredentials: true,
      });
      console.log("Fetched orders:", data);
      setOrders(Array.isArray(data) ? data : []); // Safety check
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); 
    }
  };

  const handleStatusChange = async (orderId, status) => {
    await axios.put(
      `https://prod-ecom-backend.onrender.com/api/orders/${orderId}/status`,
      { status },
      { withCredentials: true }
    );
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper for status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Admin Header (Consistent with other admin pages) */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Orders</h2>
          <p className="text-slate-500 mt-1">Track and update customer order statuses.</p>
        </div>

        {/* 3. Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <AdminNav />
        </div>

        {/* 4. Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Order History ({orders.length})</h3>
          </div>

          {/* A. Desktop Table (Hidden on Mobile) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-600">#{o.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{o.user?.name || "Guest"}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {["pending", "shipped", "delivered"].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(o.id, s)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all border ${
                              o.status === s
                                ? "bg-slate-800 text-white border-slate-800 shadow-md" // Active state
                                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600" // Inactive state
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* B. Mobile Cards (Hidden on Desktop) */}
          <div className="block lg:hidden bg-slate-50 p-4 space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold">Order ID</span>
                    <p className="font-mono font-medium text-slate-700">#{o.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <span className="text-xs text-slate-400 uppercase font-bold">Customer</span>
                  <p className="font-bold text-slate-800 text-lg">{o.user?.name || "Guest"}</p>
                </div>

                {/* Actions */}
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold mb-2 block">Update Status</span>
                  <div className="grid grid-cols-3 gap-2">
                    {["pending", "shipped", "delivered"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(o.id, s)}
                        className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                          o.status === s
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900">No orders found</h3>
              <p className="text-slate-500">New orders will appear here.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ManageOrders;