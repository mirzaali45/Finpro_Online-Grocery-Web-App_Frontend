import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import CardOrderItems from "./CardOrderItems";
import { Order, OrderItem, OrderStatus } from "@/types/orders-types"; // Ensure OrderStatus is imported

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
const Section3 = () => {
  const [ordersData, setOrdersData] = useState<Order[]>([]); // State to hold orders data
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<OrderItem[]>([]);

  // Assuming you have another method or service to fetch orders data
  // This is a placeholder for where you would actually fetch your data
  useEffect(() => {
    async function fetchOrders() {
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
    }

    fetchOrders();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div className="mt-10 text-center text-white">
        <h1 className="text-2xl font-bold">📦 My Orders</h1>
      </div>

      <section className="mt-5 max-w-5xl text-white py-5 mx-auto px-8 pt-8 pb-16 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">🚀 Track Your Orders</h1>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 w-full">
          {ordersData.map((order, index) => (
            <div
              key={index}
              className="bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <h1 className="text-lg font-semibold">
                <i className="bi bi-postage-fill mr-3"></i>
                Order #{order.order_id}
              </h1>

              <div className="flex justify-between items-end my-3">
                <div className="flex flex-wrap gap-3">
                  <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
                    💰{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0, // Hapus angka desimal
                    }).format(order.total_price)}
                  </p>
                  <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
                    📦 x{order.items.length}
                  </p>
                  <p className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm">
                    🔄 {OrderStatus[order.status]}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalDetail(true);
                    setDataDetail(order.items);
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded-md transition duration-300 hover:bg-blue-600 hover:scale-105"
                >
                  🔍 View
                </button>
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

export default Section3;
