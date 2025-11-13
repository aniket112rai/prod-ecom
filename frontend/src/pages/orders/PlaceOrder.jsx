import React, { useState } from "react";
import axios from "axios";

const PlaceOrder = () => {
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/orders",
        { items, addressId, paymentMethod },
        { withCredentials: true }
      );
      alert("Order placed successfully!");
      console.log(data);
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Place New Order</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => {
                const updated = [...items];
                updated[index].productId = e.target.value;
                setItems(updated);
              }}
              className="border p-2 w-2/3 rounded"
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const updated = [...items];
                updated[index].quantity = parseInt(e.target.value);
                setItems(updated);
              }}
              className="border p-2 w-1/3 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-600 text-sm mb-4"
        >
          + Add another item
        </button>

        <input
          type="text"
          placeholder="Address ID"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="CARD">Card Payment</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
