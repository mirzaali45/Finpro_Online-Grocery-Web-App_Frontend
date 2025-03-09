"use client"; // Menandakan bahwa komponen ini dijalankan di sisi klien

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/orderStoreAdmin-types"; // Menggunakan tipe yang sudah didefinisikan untuk Store Admin // Pagination component
import PaginationStr from "@/components/store-Ordermanagements/paginationStr";
import OrderCardStr from "@/components/store-Ordermanagements/orderCarsStr";

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
    date: "",
  });

  useEffect(() => {
    fetchOrders(); // Panggil fungsi untuk mengambil pesanan
  }, [page, filters, pageSize]);

  // Fungsi untuk mengambil pesanan berdasarkan filter dan pagination
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    // Ambil token dari localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, user might not be authenticated.");
      setLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams();

      if (filters.status) query.append("status", filters.status);
      if (filters.order_id) query.append("order_id", filters.order_id); // Filter berdasarkan store_id
      if (filters.date) query.append("date", filters.date);
      query.append("page", page.toString());
      query.append("pageSize", pageSize.toString());

      const response = await fetch(
        `${BASE_URL}/store-ordermanagements?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Menggunakan token untuk autentikasi
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📦 Manage Orders</h1>

      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap gap-4 justify-between">
        <input
          type="text"
          placeholder="Order ID"
          value={filters.order_id}
          onChange={(e) => setFilters({ ...filters, order_id: e.target.value })}
          className="border p-2 rounded w-full sm:w-64"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded w-full sm:w-64"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded w-full sm:w-64"
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
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
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
          <OrderCardStr key={order.order_id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      <PaginationStr
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
