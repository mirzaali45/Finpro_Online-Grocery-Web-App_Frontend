// components/super-OrderManagements/OrderCard.tsx
"use client";

import React from "react";
import { Order } from "@/types/orderStoreAdmin-types"; // Pastikan tipe ini sudah didefinisikan

interface OrderCardProps {
  order: Order;
  formattedTotalPrice: string; // Add this line to accept formatted price
}

const OrderCardStr: React.FC<OrderCardProps> = ({
  order,
  formattedTotalPrice,
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold text-blue-400">
        Order #{order.order_id}
      </h2>
      <h3 className="text-lg font-medium text-white">
        Store: {order.store?.store_name || "Unknown Store"}
      </h3>
      <p className="text-white">Status: {order.order_status}</p>
      <p className="text-white">Total Price: {formattedTotalPrice}</p>
      <p className="text-white">Items: {order.OrderItem.length}</p>
      <p className="text-white">
        Shipping Status: {order.Shipping[0]?.shipping_status}
      </p>
    </div>
  );
};

export default OrderCardStr;
