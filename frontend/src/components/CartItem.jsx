// frontend/src/components/CartItem.jsx
import React from "react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={item.product.images}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.product.name}
          </h3>
          <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateCartItem(item.id, Number(e.target.value))}
          className="border rounded px-3 py-1 w-16 text-center"
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
