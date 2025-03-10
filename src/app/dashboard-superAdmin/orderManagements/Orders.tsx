"use client"; // Menandakan bahwa komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { Order } from "@/types/orderSuperAdmin-types"; // Pastikan tipe ini sudah didefinisikan
import OrderCard from "@/components/super-OrderManagements/OrderCard"; // Komponen untuk setiap pesanan
import Pagination from "@/components/super-OrderManagements/Pagination"; // Pagination component
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]); // State untuk menyimpan data pesanan
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1); // Halaman saat ini
  const [pageSize, setPageSize] = useState<number>(20); // Jumlah item per halaman
  const [totalOrders, setTotalOrders] = useState<number>(0); // Total jumlah pesanan

  const [filters, setFilters] = useState({
    status: "",
    order_id: "",
    store_id: "", // Menambahkan filter store_id
    date: "",
  });

  useEffect(() => {
    fetchOrders(); // Panggil fungsi untuk mengambil pesanan
  }, [page, filters, pageSize]); // Jalankan fungsi ini ketika page atau filters berubah

  // Fungsi untuk mengambil pesanan berdasarkan filter dan pagination
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, user might not be authenticated.");
      setLoading(false);
      toast.error("Authentication failed. Please log in again."); // Display error toast
      return;
    }

    try {
      const query = new URLSearchParams();

      if (filters.status) query.append("status", filters.status);
      if (filters.order_id) query.append("order_id", filters.order_id);
      if (filters.store_id) query.append("store_id", filters.store_id); // Filter berdasarkan store_id
      if (filters.date) query.append("date", filters.date);
      query.append("page", page.toString());
      query.append("pageSize", pageSize.toString());

      const response = await fetch(
        `${BASE_URL}/super-ordermanagements?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token untuk autentikasi
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.data); // Menyimpan data pesanan
        setTotalOrders(data.total); // Menyimpan total pesanan
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders. Please try again later."); // Error toast
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengupdate shipping status menjadi "shipped"
  const updateShippingStatus = async (orderId: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/super-ordermanagements/update-shipping-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh orders setelah status pengiriman diperbarui
        toast.success("Shipping status updated to 'shipped'."); // Success toast
      } else {
        toast.error("Failed to update shipping status."); // Error toast
      }
    } catch (err) {
      console.error("Failed to update shipping status", err);
      toast.error("Failed to update shipping status. Please try again."); // Error toast
    }
  };

  // Fungsi untuk membatalkan pesanan
  const cancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/super-ordermanagements/cancel-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh orders setelah pesanan dibatalkan
        toast.success("Order cancelled successfully."); // Success toast
      } else {
        toast.error("Failed to cancel order."); // Error toast
      }
    } catch (err) {
      console.error("Failed to cancel order", err);
      toast.error("Failed to cancel order. Please try again."); // Error toast
    }
  };

  // Helper function to format price in IDR currency
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReload = () => {
    fetchOrders(); // Panggil ulang fetchOrders untuk memuat ulang data
  };

  return (
    <div className="container mx-auto p-6">
      {/* Toast Container */}
      <ToastContainer /> {/* Add ToastContainer here to display toasts */}
      <h1 className="text-3xl font-bold text-center mb-6">📦 Manage Orders</h1>
      {/* Tombol untuk reload data pesanan */}
      <div className="mb-6 text-right">
        <button
          onClick={handleReload}
          className="bg-gray-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-gray-600"
        >
          Reload
        </button>
      </div>
      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between">
        <input
          type="text"
          placeholder="Order ID"
          value={filters.order_id}
          onChange={(e) => setFilters({ ...filters, order_id: e.target.value })}
          className="border p-2 rounded-md w-full sm:w-64 lg:w-1/4"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded-md w-full sm:w-64 lg:w-1/4"
        />
        <input
          type="text"
          placeholder="Store ID"
          value={filters.store_id}
          onChange={(e) => setFilters({ ...filters, store_id: e.target.value })}
          className="border p-2 rounded-md w-full sm:w-64 lg:w-1/4"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded-md w-full sm:w-64 lg:w-1/4"
        >
          <option value="">Select Status</option>
          <option value="awaiting_payment">Awaiting Payments</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => fetchOrders()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 transition duration-300 hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {/* Display Loading, Error, and Orders */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {/* Orders List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order.order_id}
            order={order}
            onUpdateShippingStatus={updateShippingStatus} // Menangani tombol "Mark as Shipped"
            onCancelOrder={cancelOrder} // Menangani tombol "Cancel Order"
            // Display the price in IDR format for each order
            formattedTotalPrice={formatIDR(order.total_price)} // Pass the formatted price
          />
        ))}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={totalOrders}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default Orders;
