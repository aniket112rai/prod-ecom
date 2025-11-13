// frontend/src/pages/AddressPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    id: null,
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // ✅ Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/addresses", {
        withCredentials: true,
      });
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update address
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        // Update existing address
        await axios.put(
          `http://localhost:3000/api/addresses/${form.id}`,
          form,
          { withCredentials: true }
        );
      } else {
        // Add new address
        await axios.post("http://localhost:3000/api/addresses", form, {
          withCredentials: true,
        });
      }

      setForm({
        id: null,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal: "",
        country: "",
      });
      setEditing(false);
      fetchAddresses();
    } catch (err) {
      console.error("Error saving address:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/addresses/${id}`, {
        withCredentials: true,
      });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  // ✅ Edit address
  const handleEdit = (address) => {
    setForm(address);
    setEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Manage Addresses</h1>
            <p className="text-gray-500 mt-1">Add or update your shipping locations.</p>
          </div>
          <Link
            to="/"
            className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition"
          >
            <span>←</span> Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                {editing ? "✏️ Edit Address" : "➕ Add New Address"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="line1"
                    value={form.line1}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="line2"
                    value={form.line2}
                    onChange={handleChange}
                    placeholder="Address Line 2 (Optional)"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                   <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="postal"
                    value={form.postal}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-md transition-all ${
                      editing 
                        ? "bg-indigo-600 hover:bg-indigo-700" 
                        : "bg-gray-900 hover:bg-gray-800"
                    } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading
                      ? "Saving..."
                      : editing
                      ? "Update"
                      : "Save Address"}
                  </button>
                  
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          id: null,
                          line1: "",
                          line2: "",
                          city: "",
                          state: "",
                          postal: "",
                          country: "",
                        });
                      }}
                      className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Address List */}
          <div className="lg:col-span-2">
             <h2 className="text-xl font-bold text-gray-800 mb-5 px-1">Saved Locations</h2>
            
            {addresses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                 <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📍</span>
                 </div>
                <p className="text-gray-500 font-medium">No addresses saved yet.</p>
                <p className="text-sm text-gray-400">Fill out the form to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="relative bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-900 font-bold text-lg leading-tight mb-1">{a.line1}</p>
                      {a.line2 && <p className="text-gray-500 text-sm mb-1">{a.line2}</p>}
                      <p className="text-gray-600 text-sm">
                        {a.city}, {a.state} <span className="text-gray-300 mx-1">|</span> {a.postal}
                      </p>
                      <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mt-2">{a.country}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => handleEdit(a)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 py-2 rounded-lg hover:bg-indigo-100 transition"
                      >
                         <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-600 bg-red-50 py-2 rounded-lg hover:bg-red-100 transition"
                      >
                         <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;