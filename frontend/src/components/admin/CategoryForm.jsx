// frontend/src/components/admin/CategoryForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryForm = ({ fetchCategories, editingCategory, setEditingCategory }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingCategory) setName(editingCategory.name);
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      await axios.put(`http://localhost:3000/api/categories/${editingCategory.id}`, { name }, {withCredentials: true,});
    } else {
      await axios.post("http://localhost:3000/api/categories", { name }, { withCredentials: true, });
    }
    setName("");
    setEditingCategory(null);
    fetchCategories();
  };

  // Helper to clear form if user wants to cancel editing
  const handleCancel = () => {
    setEditingCategory(null);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Input Field */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Category Name
        </label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Electronics" 
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button 
          type="submit" 
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
            editingCategory 
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
          }`}
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>

        {editingCategory && (
          <button 
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;