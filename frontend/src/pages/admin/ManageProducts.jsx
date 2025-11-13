// frontend/src/pages/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../components/admin/ProductForm";
import AdminNav from "../../components/admin/AdminNav";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/products", {
        withCredentials: true,
      });
      console.log("Fetched products:", data);
      setProducts(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]); // prevents crash
    }
  };

  const handleEdit = (product) => setEditingProduct(product);
  
  const handleDelete = async (id) => {
    // Note: Added a window.confirm for safety, as this is a destructive action.
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`, {
          withCredentials: true,
        });
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Top Header Section (Consistent with Dashboard) */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Products</h2>
          <p className="text-slate-500 mt-1">Add, edit, and delete store products.</p>
        </div>

        {/* 3. Navigation Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <AdminNav />
        </div>

        {/* 4. Main Content Grid (Form + List) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT COL: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h3>
              <ProductForm 
                fetchProducts={fetchProducts} 
                editingProduct={editingProduct} 
                setEditingProduct={setEditingProduct} 
              />
            </div>
          </div>

          {/* RIGHT COL: Product List */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Existing Products ({products.length})</h3>

            {/* A. Desktop Table (Hidden on Mobile) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="p-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="p-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                    <th className="p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-sm text-slate-700 font-medium">{p.name}</td>
                      <td className="p-3 text-sm text-slate-600">${p.price}</td>
                      <td className="p-3 text-sm text-slate-600">{p.stock}</td>
                      <td className="p-3 text-center space-x-2">
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* B. Mobile Card List (Hidden on Desktop) */}
            <div className="block lg:hidden space-y-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-slate-800">{p.name}</span>
                    <span className="font-bold text-indigo-600 text-lg">${p.price}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.stock} in stock
                    </span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-slate-500 font-medium">No products found.</p>
                    <p className="text-sm text-slate-400">Use the form to add one.</p>
                </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageProducts;