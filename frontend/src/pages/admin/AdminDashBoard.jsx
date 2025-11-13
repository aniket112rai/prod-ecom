// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../../components/admin/StatsCard";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/admin/AdminNav";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Backend will validate the admin via cookie-based auth
        const [users, orders, products] = await Promise.all([
          axios.get("https://prod-ecom-backend.onrender.com/api/users", { withCredentials: true }),
          axios.get("https://prod-ecom-backend.onrender.com/api/orders/all", { withCredentials: true }),
          axios.get("https://prod-ecom-backend.onrender.com/api/products", { withCredentials: true }),
        ]);

        setStats({
          users: users.data.users.length,
          orders: orders.data.length,
          products: products.data.length,
        });
        
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        navigate("/login"); // not authenticated or not admin
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Top Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.9-1.8a2 2 0 10-3.58-1.79l-1 2-1-2a2 2 0 10-3.58 1.79l.9 1.8H5a2 2 0 01-2-2V5zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
          <div className="text-sm text-slate-500">
            Logged in as Admin
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Page Title & Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening in your store today.</p>
        </div>

        {/* 3. Navigation Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Quick Actions</p>
          <AdminNav /> 
          {/* Assuming AdminNav handles its own internal styling, 
              but this container ensures it looks like a toolbar */}
        </div>
        
        

        {/* 4. Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* We wrap StatsCard in a div to ensure grid layout works even if StatsCard is simple */}
          
          {/* Users Card Wrapper */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
            </div>
            <div className="relative z-10">
               {/* Passing icon/color as props in case you update StatsCard later, otherwise title/value work fine */}
              <StatsCard title="Total Users" value={stats.users} icon="users" color="blue" />
            </div>
          </div>

          {/* Orders Card Wrapper */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
            </div>
            <div className="relative z-10">
              <StatsCard title="Total Orders" value={stats.orders} icon="cart" color="green" />
            </div>
            {console.log(stats.orders)}
          </div>

          {/* Products Card Wrapper */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
            </div>
            <div className="relative z-10">
              <StatsCard title="Total Products" value={stats.products} icon="box" color="purple" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;