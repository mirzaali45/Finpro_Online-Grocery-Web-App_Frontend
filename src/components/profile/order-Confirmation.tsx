// import React, { useEffect, useState } from "react";
// import Modal from "../product-management/Modal";
// import CardOrderItems from "./CardOrderItems";
// import { Order, OrderItem, OrderStatus } from "@/types/orders-types"; // Ensure OrderStatus is imported

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

// const OrderConfirmation = () => {
//   const [ordersData, setOrdersData] = useState<Order[]>([]); // State to hold orders data
//   const [modalDetail, setModalDetail] = useState(false);
//   const [dataDetail, setDataDetail] = useState<OrderItem[]>([]);

//   // Assuming you have another method or service to fetch orders data
//   // This is a placeholder for where you would actually fetch your data
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const token = localStorage.getItem("token"); // Ambil token dari localStorage
//         if (!token) {
//           console.error("No token found, user might not be authenticated.");
//           return;
//         }

//         const response = await fetch(`${BASE_URL}/orders/my-orders`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Tambahkan token di header
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();

//         if (!result.data || !Array.isArray(result.data)) {
//           throw new Error("Invalid data format received from API");
//         }

//         setOrdersData(result.data); // Pastikan hanya menyimpan array ke state
//       } catch (error) {
//         console.error("Failed to fetch orders:", error);
//         setOrdersData([]); // Pastikan state tetap berupa array untuk menghindari error .map()
//       }
//     }

//     fetchOrders();
//   }, []); // Empty dependency array ensures this runs only once on mount

//   return (
//     <>
//       <div className="mt-10 text-center text-white">
//         <h1 className="text-2xl font-bold">📦 My Orders</h1>
//       </div>

//       <section className="mt-5 max-w-5xl text-white py-5 mx-auto px-8 pt-8 pb-16 bg-gray-800 rounded-lg shadow-lg">
//         <div className="flex justify-between">
//           <h1 className="text-lg font-semibold">🚀 Track Your Orders</h1>
//         </div>

//         {/* Grid Layout */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 w-full">
//           {ordersData.map((order, index) => (
//             <div
//               key={index}
//               className="bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
//             >
//               <h1 className="text-lg font-semibold">
//                 <i className="bi bi-postage-fill mr-3"></i>
//                 Order #{order.order_id}
//               </h1>

//               <div className="flex justify-between items-end my-3">
//                 <div className="flex flex-wrap gap-3">
//                   <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
//                     💰{" "}
//                     {new Intl.NumberFormat("id-ID", {
//                       style: "currency",
//                       currency: "IDR",
//                       maximumFractionDigits: 0, // Hapus angka desimal
//                     }).format(order.total_price)}
//                   </p>
//                   <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
//                     📦 x{order.items.length}
//                   </p>
//                   <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
//                     🔄 {OrderStatus[order.status]} {/* Menampilkan order status */}
//                   </p>

//                   {/* Tambahkan status pengiriman */}
//                   {order.shipping && (
//                     <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
//                       🚚 {order.shipping.status} {/* Menampilkan shipping status */}
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => {
//                     setModalDetail(true);
//                     setDataDetail(order.items);
//                   }}
//                   className="bg-blue-500 text-white px-3 py-2 rounded-md transition duration-300 hover:bg-blue-600 hover:scale-105"
//                 >
//                   🔍 View
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal */}
//         <Modal
//           isOpen={modalDetail}
//           onClose={() => setModalDetail(false)}
//           title="Order Items"
//         >
//           <CardOrderItems dataItems={dataDetail} />
//         </Modal>
//       </section>
//     </>
//   );
// };

// export default OrderConfirmation;
import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import CardOrderItems from "./CardOrderItems";
import { Order, OrderItem, OrderStatus } from "@/types/orders-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

const OrderConfirmation = () => {
  const [ordersData, setOrdersData] = useState<Order[]>([]); // State to hold orders data
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<OrderItem[]>([]);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        console.error("No token found, user might not be authenticated.");
        return;
      }

      const response = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Tambahkan token di header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format received from API");
      }

      setOrdersData(result.data); // Pastikan hanya menyimpan array ke state
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrdersData([]); // Pastikan state tetap berupa array untuk menghindari error .map()
    }
  };

  // Function to handle confirming the order
  const confirmOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        console.error("No token found, user might not be authenticated.");
        return;
      }

      const response = await fetch(`${BASE_URL}/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Tambahkan token di header
        },
        body: JSON.stringify({ order_id: orderId }), // Kirim order_id ke server
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.msg); // Tampilkan pesan dari backend
      alert("Order confirmed successfully!");

      // Update state atau refresh data setelah konfirmasi berhasil
      fetchOrders(); // Re-fetch orders data
    } catch (error) {
      console.error("Failed to confirm order:", error);
      alert("Failed to confirm order!");
    }
  };

  // Fetch orders data
  useEffect(() => {
    fetchOrders(); // Panggil fetchOrders saat komponen pertama kali dimuat
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div className="mt-10 text-center text-white">
        <h1 className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent">
          📦 My Orders
        </h1>
      </div>

      <section className="mt-10 max-w-3xl mx-auto px-8 py-12 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">🚀 Track Your Orders</h2>
          <button
            onClick={fetchOrders}
            className="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {ordersData.map((order, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-2xl font-semibold text-blue-400">
                <i className="bi bi-box-fill mr-2"></i>
                Order #{order.order_id}
              </h3>

              <div className="mt-4">
                <div className="flex gap-4 items-center mb-3">
                  <p className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm">
                    💰{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(order.total_price)}
                  </p>
                  <p className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm">
                    📦 x{order.items.length}
                  </p>
                  <p className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm">
                    🔄 {OrderStatus[order.status]}
                  </p>

                  {order.shipping && (
                    <p className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm">
                      🚚 {order.shipping.status}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  {order.status === "completed" && order.shipping?.status === "shipped" && (
                    <button
                      onClick={() => confirmOrder(order.order_id)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      ✅ Confirm Delivery
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setModalDetail(true);
                      setDataDetail(order.items);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    🔍 View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalDetail}
          onClose={() => setModalDetail(false)}
          title="Order Items"
        >
          <CardOrderItems dataItems={dataDetail} />
        </Modal>
      </section>
    </>
  );
};

export default OrderConfirmation;

