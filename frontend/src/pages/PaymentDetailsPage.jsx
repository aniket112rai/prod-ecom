import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PaymentDetailsPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const { data } = await axios.get(
          `https://prod-ecom-backend.onrender.com/api/payments/${id}`,
          { withCredentials: true }
        );
        setPayment(data);
      } catch (err) {
        console.error("Error fetching payment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading payment details...</p>;

  if (!payment)
    return (
      <div className="text-center mt-10 text-red-500">
        <p>Payment not found 😔</p>
        <Link to="/" className="text-blue-500 underline block mt-3">
          Go back home
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Payment Details</h1>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Payment ID:</strong> {payment.id}
        </p>
        <p>
          <strong>Order ID:</strong> {payment.orderId}
        </p>
        <p>
          <strong>Provider:</strong> {payment.provider}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              payment.status === "completed" ? "text-green-600" : "text-red-500"
            }`}
          >
            {payment.status}
          </span>
        </p>
        <p>
          <strong>Amount:</strong> ${payment.amount.toFixed(2)}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(payment.createdAt).toLocaleString()}
        </p>
      </div>

      {payment.order && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <p>
            <strong>Status:</strong> {payment.order.status}
          </p>
          <p>
            <strong>Total:</strong> ${payment.order.total.toFixed(2)}
          </p>
        </div>
      )}

      <Link
        to="/orders"
        className="inline-block mt-6 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        ← Back to Orders
      </Link>
    </div>
  );
};

export default PaymentDetailsPage;
