// frontend/src/components/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setForm({ ...editingProduct });
    }
  }, [editingProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("https://prod-ecom-backend.onrender.com/api/categories", {
          withCredentials: true,
        });
        setCategories(data.categories || data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await axios.put(
          `https://prod-ecom-backend.onrender.com/api/products/${editingProduct.id}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post("https://prod-ecom-backend.onrender.com/api/products", form, {
          withCredentials: true,
        });
      }

      setForm({
        name: "",
        price: "",
        stock: "",
        images: "",
        categoryId: "",
        description: "",
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      images: "",
      categoryId: "",
      description: "",
    });
    setEditingProduct(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Headphones"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          required
        />
      </div>

      {/* Price & Stock Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Stock Qty
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Category
        </label>
        <div className="relative">
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-all"
            required
          >
            <option value="">Select Category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product details..."
          rows="3"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
          Image URL
        </label>
        <input
          type="text"
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Paste a direct link to an image.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-white shadow-md transition-all active:scale-95 ${
            editingProduct
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
          }`}
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;