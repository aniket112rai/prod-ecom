// frontend/src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "../../components/admin/UserRow";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/admin/AdminNav";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/users", {
        withCredentials: true,
      });
  
      console.log("Fetched users:", data);
  
      // handle different response shapes safely
      const usersArray = data.users || data.data || data; 
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      navigate("/login");
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Users</h2>
          <p className="text-slate-500 mt-1">View and manage registered accounts.</p>
        </div>

        {/* 3. Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <AdminNav />
        </div>

        {/* 4. Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Registered Users ({users.length})</h3>
          </div>

          {users.length === 0 ? (
             // Empty State
            <div className="text-center py-16">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900">No users found</h3>
              <p className="text-slate-500">Registered users will appear here.</p>
            </div>
          ) : (
            <>
              {/* A. Desktop Table (Hidden on Mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      {/* Added an empty header for actions if UserRow has buttons */}
                      <th className="p-4"></th> 
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <UserRow key={u.id} user={u} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* B. Mobile List (Hidden on Desktop) */}
              {/* Note: We render div cards here because a <tr> (UserRow) cannot be inside a flex/grid div container easily */}
              <div className="block md:hidden divide-y divide-slate-100">
                {users.map((u) => (
                  <div key={u.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">{u.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {u.email}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;