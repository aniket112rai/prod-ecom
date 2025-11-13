// frontend/src/pages/admin/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryForm from "../../components/admin/CategoryForm";
import AdminNav from "../../components/admin/AdminNav";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/categories", {
        withCredentials: true,
      });
      console.log("Fetched categories:", data);
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]); // prevent crash
    }
  };

  const handleEdit = (category) => setEditingCategory(category);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
        await axios.delete(`http://localhost:3000/api/categories/${id}`, {
          withCredentials: true,
        });
        fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Categories</h2>
          <p className="text-slate-500 mt-1">Organize your products into categories.</p>
        </div>

        {/* 3. Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <AdminNav />
        </div>

        {/* 4. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                {editingCategory ? "✏️ Edit Category" : "➕ Add Category"}
              </h3>
              {/* Wraps the form component with some spacing */}
              <div className="space-y-4">
                 <CategoryForm 
                    fetchCategories={fetchCategories} 
                    editingCategory={editingCategory} 
                    setEditingCategory={setEditingCategory} 
                 />
              </div>
            </div>
          </div>

          {/* RIGHT COL: Categories List */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Category List ({categories.length})</h3>
                </div>

                {/* A. Desktop Table */}
                <table className="w-full hidden sm:table">
                    <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category Name</th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-700">{c.name}</td>
                        <td className="p-4 text-right space-x-2">
                            <button 
                                onClick={() => handleEdit(c)} 
                                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(c.id)} 
                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                            >
                                Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* B. Mobile List (Stacked) */}
                <div className="block sm:hidden divide-y divide-slate-100">
                    {categories.map((c) => (
                        <div key={c.id} className="p-4 flex justify-between items-center">
                            <span className="font-medium text-slate-800">{c.name}</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(c)} 
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(c.id)} 
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Empty State */}
                {categories.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">📂</span>
                        </div>
                        <p className="text-slate-500 text-sm">No categories found. Add one to get started.</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageCategories;