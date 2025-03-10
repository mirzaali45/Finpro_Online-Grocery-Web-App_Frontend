"use client"; // Menandakan bahwa komponen ini dijalankan di sisi klien

import { useEffect, useState } from "react";

const SearchOrder = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cek token dari localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("Token is missing");
    }
  }, [token]);

  // Fungsi untuk melakukan pencarian pesanan
  const fetchOrders = async () => {
    if (!token) {
      setError("Token is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (orderId) query.append("order_id", orderId);
      if (orderDate) query.append("order_date", orderDate);

      const res = await fetch(
        `${process.env
          .NEXT_PUBLIC_BASE_URL_BE!}/orders/Query?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders(data.data); // Menyimpan data pesanan yang didapatkan
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err: any) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format price in IDR format
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 sm:p-8 md:p-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Search Orders</h1>

      {/* Jika token tidak ada */}
      {error && !loading && (
        <div className="bg-red-100 text-red-500 p-4 rounded-md shadow-sm mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row justify-center gap-4">
        {/* Input untuk orderId */}
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
          className="border p-3 rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Input untuk orderDate */}
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          className="border p-3 rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Tombol untuk memulai pencarian */}
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Menampilkan status loading */}
      {loading && (
        <div className="text-center text-gray-600">
          <div className="animate-spin inline-block w-8 h-8 border-t-4 border-blue-600 rounded-full border-4 border-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {/* Menampilkan hasil pencarian */}
      <div className="mt-8">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div
              key={order.order_id}
              className="bg-white p-6 mb-6 rounded-lg shadow-lg transition-all hover:scale-105 duration-300 ease-in-out"
            >
              <p className="font-semibold text-lg text-gray-800">Order No: {order.order_id}</p>
              <p className="text-gray-600">Status: {order.order_status}</p>
              <p className="text-gray-600">
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <p className="font-semibold">Order Items:</p>
                {order.OrderItem.map((item: any) => (
                  <div key={item.orderitem_id} className="ml-4">
                    <p className="text-gray-600">Product ID: {item.product_id}</p>
                    <p className="text-gray-600">Quantity: {item.qty}</p>
                    <p className="text-gray-600">Price: {formatIDR(item.price)}</p> {/* Format price in IDR */}
                    <p className="text-gray-600">Total Price: {formatIDR(item.total_price)}</p> {/* Format total price in IDR */}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="font-semibold">Shipping Details:</p>
                {order.Shipping.map((shipping: any) => (
                  <div key={shipping.shipping_id} className="ml-4">
                    <p className="text-gray-600">Shipping Cost: {formatIDR(shipping.shipping_cost)}</p> {/* Format shipping cost in IDR */}
                    <p className="text-gray-600">Shipping Address: {shipping.shipping_address}</p>
                    <p className="text-gray-600">Status: {shipping.shipping_status}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default SearchOrder;
