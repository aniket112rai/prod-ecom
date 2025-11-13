import React, { useState } from "react";
import axios from "axios";

const UpdateOrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      alert("Order status updated!");
      console.log(data);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Update Order Status (Admin)</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="text"
          placeholder="New Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update Status
        </button>
      </form>
    </div>
  );
};

export default UpdateOrderStatus;
