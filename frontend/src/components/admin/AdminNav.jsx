// frontend/src/components/admin/AdminNav.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const AdminNav = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Optional: Used to highlight active tab
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = async () => {
        try {
          await axios.post("https://prod-ecom-backend.onrender.com/api/auth/logout", {}, { withCredentials: true });
        //   setIsAuthenticated(false); 
          navigate("/login");
        } catch (err) {
          console.error("Logout failed:", err);
        }
    };

    // Navigation Configuration
    const navItems = [
        { label: "Dashboard", path: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { label: "Products", path: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
        { label: "Orders", path: "/admin/orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
        { label: "Categories", path: "/admin/categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
        { label: "Users", path: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    ];

    return (
        <div className="w-full">
            {/* Navigation Container */}
            <nav className="flex flex-wrap items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
                
                {/* Map through menu items */}
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                                isActive 
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                                : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    );
                })}

                {/* Logout Button - Pushed to the right on desktop */}
                <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0 border-t md:border-t-0 border-slate-200 md:border-l pt-2 md:pt-0 md:pl-2">
                    <button
                        onClick={handleLogout}
                        className="w-full md:w-auto flex justify-center items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default AdminNav;