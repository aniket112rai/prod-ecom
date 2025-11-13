// frontend/src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, selectedAddress, paymentMethod: checkoutMethod } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(checkoutMethod || "COD");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);

  const handlePayment = async () => {
    if (!cartItems || !selectedAddress) {
      alert("Checkout details missing!");
      navigate("/checkout");
      return;
    }

    try {
      setLoading(true);

      // 🧾 Step 1: Create order directly (simulate payment success)
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        addressId: selectedAddress,
        paymentMethod,
        paymentStatus: "Paid", // ✅ directly mark paid
        status: "Confirmed",
      };

      const orderRes = await axios.post(
        "https://prod-ecom-backend.onrender.com/api/orders",
        orderPayload,
        { withCredentials: true }
      );

      const newOrder = orderRes.data;
      setOrder(newOrder);

      // 🧾 Step 2: Simulate payment success (no real API call)
      const fakePayment = {
        id: "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        method: paymentMethod,
        status: "Success",
      };

      setPayment(fakePayment);

      // 🧾 Step 3: Redirect after short delay
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      console.error("Order creation or payment failed:", err);
      alert("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render icons based on method
  const getMethodIcon = (method) => {
    switch (method) {
      case "COD": return "💵";
      case "UPI": return "📱";
      case "CARD": return "💳";
      default: return "💰";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {!payment ? (
          /* ------------------ PAYMENT FORM ------------------ */
          <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4">
                🔒
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Secure Payment</h1>
              <p className="text-sm text-gray-500 mt-1">Complete your purchase securely.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                
                {/* Visual Selection Grid instead of native select */}
                <div className="grid grid-cols-3 gap-3">
                  {["COD", "UPI", "CARD"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === method
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm scale-[1.02]"
                          : "border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl mb-1">{getMethodIcon(method)}</span>
                      <span className="text-xs font-bold">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              

              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all ${
                  loading 
                    ? "bg-indigo-400 cursor-wait" 
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay with ${paymentMethod}`
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                <span className="mr-1">🔒</span> 256-bit SSL Encrypted Payment
              </p>
            </div>
          </div>
        ) : (
          /* ------------------ SUCCESS STATE ------------------ */
          <div className="bg-white py-10 px-6 shadow-xl rounded-3xl sm:px-10 text-center border border-gray-100">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500 mb-8">
              Thank you for your purchase. Your order is being processed.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Payment ID</span>
                <span className="text-gray-900 font-mono font-medium text-sm truncate ml-4">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Order ID</span>
                <span className="text-gray-900 font-mono font-medium text-sm">{order?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Method</span>
                <span className="text-gray-900 font-medium text-sm flex items-center gap-1">
                  {getMethodIcon(payment.method)} {payment.method}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              View My Orders
            </button>
            
            <p className="text-xs text-gray-400 mt-4">
              Redirecting automatically...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;