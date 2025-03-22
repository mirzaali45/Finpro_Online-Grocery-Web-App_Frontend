import { useEffect, useRef, useState } from "react";

const SearchOrder = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetched = useRef(false); // Untuk mencegah auto-refresh berulang kali

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setError("Token is missing");
    }
  }, [token]);

  const isSearchValid = () => {
    return (
      orderId.trim() !== "" ||
      orderDate.trim() !== "" ||
      productName.trim() !== ""
    );
  };

  const fetchOrders = async () => {
    if (!token) {
      setError("Token is missing");
      return;
    }

    if (!isSearchValid()) {
      setError(null);
      setOrders([]); // Kosongkan hasil jika pencarian tidak valid
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (orderId.trim()) query.append("order_id", orderId);
      if (orderDate.trim()) query.append("order_date", orderDate);
      if (productName.trim()) query.append("product_name", productName);

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
        setOrders(data.data);

        // Auto-refresh hanya sekali setelah fetch pertama kali
        if (!hasFetched.current) {
          hasFetched.current = true;
          setTimeout(() => {
            fetchOrders(); // Memanggil kembali sekali setelah 5 detik
          }, 5000);
        }
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err: any) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchOrders();
    }
  };

  useEffect(() => {
    if (!isSearchValid()) {
      setOrders([]);
    }
  }, [orderId, orderDate, productName]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 sm:p-8 md:p-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Search Orders
      </h1>

      {error && !loading && (
        <div className="bg-red-100 text-red-500 p-4 rounded-md shadow-sm mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row justify-center gap-4">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Order ID"
          className="border p-3 rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-3 rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Product Name"
          className="border p-3 rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={fetchOrders}
          disabled={!isSearchValid()}
          className={`p-3 rounded-lg shadow-md transition duration-300 ease-in-out w-full sm:w-auto ${
            isSearchValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-600">
          <div className="animate-spin inline-block w-8 h-8 border-t-4 border-blue-600 rounded-full border-4 border-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      <div className="mt-8">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div
              key={order.order_id}
              className="bg-white p-6 mb-6 rounded-lg shadow-lg transition-all hover:scale-105 duration-300 ease-in-out"
            >
              <p className="font-semibold text-lg text-gray-800">
                Order No: {order.order_id}
              </p>
              <p className="text-gray-600">
                Order status: {order.order_status}
              </p>
              <p className="text-gray-600">
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-600 font-semibold">
                Total Items: {order.total_items}
              </p>
              <p className="text-gray-600 font-semibold">
                Total Price: {formatIDR(order.total_price)}
              </p>

              <div className="mt-4">
                <p className="font-semibold">Order Items:</p>
                {order.OrderItem.map((item: any) => {
                  const priceBeforeDiscount = item.product?.price || 0; // use const
                  let priceAfterDiscount = priceBeforeDiscount;

                  if (item.product?.Discount?.length > 0) {
                    const discount = item.product.Discount[0];

                    if (discount.discount_type === "percentage") {
                      priceAfterDiscount =
                        priceBeforeDiscount -
                        (priceBeforeDiscount * discount.discount_value) / 100;
                    } else if (discount.discount_type === "point") {
                      priceAfterDiscount =
                        priceBeforeDiscount - discount.discount_value;
                    }
                  }

                  return (
                    <div
                      key={item.orderitem_id}
                      className="ml-4 border-b pb-2 mb-2"
                    >
                      <p className="text-gray-600">
                        <span className="font-semibold">Product Name:</span>{" "}
                        {item.product?.name || "Unknown"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Quantity:</span>{" "}
                        {item.qty}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-semibold">Original Price:</span>{" "}
                        <span className="line-through text-red-500">
                          {formatIDR(priceBeforeDiscount)}
                        </span>
                      </p>

                      {priceBeforeDiscount !== priceAfterDiscount && (
                        <p className="text-green-600">
                          <span className="font-semibold">
                            Discounted Price:
                          </span>{" "}
                          {formatIDR(priceAfterDiscount)}
                        </p>
                      )}

                      <p className="text-gray-600 font-semibold">
                        <span className="font-semibold">Total Price:</span>{" "}
                        {formatIDR(priceAfterDiscount * item.qty)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <p className="font-semibold">Shipping Details:</p>
                {order.Shipping.map((shipping: any) => (
                  <div
                    key={shipping.shipping_id}
                    className="ml-4 border-b pb-2 mb-2"
                  >
                    <p className="text-gray-600">
                      <span className="font-semibold">Shipping Status:</span>{" "}
                      {shipping.shipping_status}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Shipping Cost:</span>{" "}
                      {formatIDR(shipping.shipping_cost)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Shipping Address:</span>{" "}
                      {shipping.shipping_address}
                    </p>
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
