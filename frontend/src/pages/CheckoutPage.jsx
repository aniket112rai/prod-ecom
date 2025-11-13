// frontend/src/pages/orders/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("https://prod-ecom-backend.onrender.com/api/addresses", {
          withCredentials: true,
        });
        setAddresses(res.data);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await axios.get("https://prod-ecom-backend.onrender.com/api/cart", {
          withCredentials: true,
        });
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchAddresses();
    fetchCart();
  }, []);

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      // Using a simple alert for now, but a toast would be better in a real app
      alert("Please select an address");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/payment", {
      state: {
        cartItems,
        selectedAddress,
        paymentMethod,
      },
    });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Address Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Shipping Address
                </h2>
                <Link to="/addresses" className="text-indigo-600 text-sm font-medium hover:underline">
                  + Add New
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-3">You have no saved addresses.</p>
                  <Link to="/addresses" className="text-indigo-600 font-semibold hover:underline">
                    Add an Address
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center h-5 mt-1">
                         <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-gray-900 mb-1">{addr.line1}</p>
                         {addr.line2 && <p className="text-gray-600 text-sm mb-1">{addr.line2}</p>}
                         <p className="text-gray-500 text-sm">
                           {addr.city}, {addr.state} {addr.postal}, {addr.country}
                         </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* COD Option */}
                <label 
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "COD" 
                    ? "border-indigo-500 bg-indigo-50/50" 
                    : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === "COD"} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="hidden"
                  />
                  <span className="text-2xl">💵</span>
                  <span className="font-bold text-gray-700">Cash on Delivery</span>
                </label>

                {/* UPI Option */}
                <label 
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "UPI" 
                    ? "border-indigo-500 bg-indigo-50/50" 
                    : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI" 
                    checked={paymentMethod === "UPI"} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="hidden"
                  />
                  <span className="text-2xl">📱</span>
                  <span className="font-bold text-gray-700">UPI</span>
                </label>

                {/* Card Option */}
                <label 
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "CARD" 
                    ? "border-indigo-500 bg-indigo-50/50" 
                    : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="CARD" 
                    checked={paymentMethod === "CARD"} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    className="hidden"
                  />
                  <span className="text-2xl">💳</span>
                  <span className="font-bold text-gray-700">Card</span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex gap-3">
                            {/* Optional: Add small image if available in product object */}
                             <div className="font-medium text-gray-700">
                                <span className="text-gray-900 block">{item.product.title}</span>
                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                             </div>
                        </div>
                        <span className="font-semibold text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <button
                        onClick={handleProceedToPayment}
                        disabled={cartItems.length === 0}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Place Order
                    </button>
                    
                    <p className="text-xs text-gray-400 text-center mt-3">
                        By placing this order, you agree to our Terms of Service.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;