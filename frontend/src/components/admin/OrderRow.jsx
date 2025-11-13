// frontend/src/components/admin/OrderRow.jsx
import React from "react";

const OrderRow = ({ order, handleStatusChange }) => {
  return (
    <tr>
      <td className="p-2 border">{order.id}</td>
      <td className="p-2 border">{order.user?.name || "Unknown"}</td>
      <td className="p-2 border">{order.status}</td>
      <td className="p-2 border space-x-2">
        {["pending", "shipped", "delivered"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(order.id, s)}
            className={`px-3 py-1 rounded text-white ${
              s === "pending"
                ? "bg-yellow-500"
                : s === "shipped"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          >
            {s}
          </button>
        ))}
      </td>
    </tr>
  );
};

export default OrderRow;
