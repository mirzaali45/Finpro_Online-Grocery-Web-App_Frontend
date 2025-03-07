// pages/order-confirmation.tsx
import { useState } from "react";

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token is missing");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE!}/orders/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Order confirmed successfully!");
      } else {
        setMessage(data.msg || "Failed to confirm order");
      }
    } catch (error) {
      setMessage("Failed to confirm order");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Confirm Order
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default OrderConfirmation;
