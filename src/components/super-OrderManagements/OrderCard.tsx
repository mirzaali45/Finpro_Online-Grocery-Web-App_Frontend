"use client"; // Menandakan bahwa komponen ini dijalankan di sisi klien

import React from "react";
import { Order } from "@/types/orderSuperAdmin-types"; // Pastikan tipe ini sudah didefinisikan
import { ChevronRight, X } from "lucide-react"; // Mengimpor icon Lucide

interface OrderCardProps {
  order: Order;
  onUpdateShippingStatus: (orderId: number) => void; // Fungsi untuk mengupdate status pengiriman
  onCancelOrder: (orderId: number) => void; // Fungsi untuk membatalkan pesanan
  formattedTotalPrice: string; // Add this line to accept formatted price
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateShippingStatus,
  onCancelOrder,
  formattedTotalPrice, // Destructure this prop
}) => {
  // Fungsi untuk menangani tombol konfirmasi status pengiriman menjadi "shipped"
  const handleUpdateShippingStatus = () => {
    onUpdateShippingStatus(order.order_id);
  };

  // Fungsi untuk menangani pembatalan pesanan
  const handleCancelOrder = () => {
    onCancelOrder(order.order_id);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <h2 className="text-2xl font-semibold text-blue-400">
        Order #{order.order_id}
      </h2>
      <h3 className="text-lg font-medium text-white mt-2">
        Store: {order.store?.store_name || "Unknown Store"}
      </h3>
      <div className="mt-2 text-white">
        <p>Status Order: {order.order_status}</p>
        <p>Total Price: {formattedTotalPrice}</p>
        <p>Items: {order.OrderItem.length}</p>
        <p>Shipping Status: {order.Shipping[0]?.shipping_status}</p>
      </div>

      {/* Button to update shipping status if the order is completed or shipped, and shipping is pending */}
      {(order.order_status === "completed" ||
        order.order_status === "shipped") &&
        order.Shipping[0]?.shipping_status === "pending" && (
          <button
            onClick={handleUpdateShippingStatus}
            className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md transition duration-300 hover:bg-green-600 flex items-center"
          >
            <ChevronRight className="h-5 w-5 mr-2" />{" "}
            {/* ChevronRight icon from Lucide */}
            Mark as Shipped
          </button>
        )}

      {/* Button to cancel order if shipping is still pending and order status is completed */}
      {(order.order_status === "shipped" || order.order_status === "completed" ) &&
        order.Shipping[0]?.shipping_status === "pending" && (
          <button
            onClick={handleCancelOrder}
            className="mt-2 bg-red-500 text-white px-6 py-3 rounded-md transition duration-300 hover:bg-red-600 flex items-center"
          >
            <X className="h-5 w-5 mr-2" /> {/* X icon from Lucide */}
            Cancel Order
          </button>
        )}
    </div>
  );
};

export default OrderCard;
