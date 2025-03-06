import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service"; // Pastikan ini benar
import { Order } from "@/types/orders-types"; // Pastikan tipe Order diimport dengan benar

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil Bearer token dari localStorage, cookie, atau tempat penyimpanan lainnya
  const token = localStorage.getItem("access_token"); // Ganti dengan cara Anda mendapatkan token

  useEffect(() => {
    const fetchOrders = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setError("Token is missing");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const ordersData = await orderService.getMyOrders(token); // Kirim token Bearer
        setOrders(ordersData.data); // Ambil data pesanan dari response
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4 text-white">My Orders</h1>
        <div className="space-y-4 ">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-4 shadow-md rounded-md"
            >
              <p className="font-medium">Order ID: {order.order_id}</p>
              <p>
                Status:
                <span
                  className={`inline-block px-2 py-1 mt-1 rounded-md ${
                    order.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
