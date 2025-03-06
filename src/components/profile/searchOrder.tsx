// pages/index.tsx
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Orders</h1>

      {/* Jika token tidak ada */}
      {error && !loading && <div className="text-red-500">{error}</div>}

      <div className="mb-4">
        {/* Input untuk orderId */}
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
          className="border p-2 rounded mr-2"
        />
        {/* Input untuk orderDate */}
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        {/* Tombol untuk memulai pencarian */}
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Search
        </button>
      </div>

      {/* Menampilkan status loading */}
      {loading && <div>Loading...</div>}

      {/* Menampilkan hasil pencarian */}
      <div className="mt-4">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div
              key={order.order_id}
              className="bg-white p-4 mb-2 rounded shadow"
            >
              <p className="font-semibold">Order No: {order.order_id}</p>
              <p>Status: {order.order_status}</p>
              <p>
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <div>
                <p className="font-semibold">Order Items:</p>
                {order.OrderItem.map((item: any) => (
                  <div key={item.orderitem_id}>
                    <p>Product ID: {item.product_id}</p>
                    <p>Quantity: {item.qty}</p>
                    <p>Price: {item.price}</p>
                    <p>Total Price: {item.total_price}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold">Shipping Details:</p>
                {order.Shipping.map((shipping: any) => (
                  <div key={shipping.shipping_id}>
                    <p>Shipping Cost: {shipping.shipping_cost}</p>
                    <p>Shipping Address: {shipping.shipping_address}</p>
                    <p>Status: {shipping.shipping_status}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default SearchOrder;
