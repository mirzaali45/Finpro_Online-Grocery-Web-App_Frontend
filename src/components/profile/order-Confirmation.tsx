import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import CardOrderItems from "./CardOrderItems";
import { Order, OrderItem, OrderStatus } from "@/types/orders-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

const OrderConfirmation = () => {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [modalDetail, setModalDetail] = useState(false); // state modal detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // state untuk order yang dipilih
  const [isConfirming, setIsConfirming] = useState(false); // flag untuk mencegah klik berulang

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, user might not be authenticated.");
        return;
      }

      const response = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("Invalid data format received from API");
      }

      setOrdersData(result.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrdersData([]);
      toast.error("Failed to fetch orders. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmDelivery = async (orderId: number) => {
    if (isConfirming) return; // mencegah klik berulang

    setIsConfirming(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      // Pastikan orderId menjadi string sebelum dikirim ke API
      const stringifiedOrderId = String(orderId); // Mengubah menjadi string

      // Mengirim POST request ke API backend untuk konfirmasi pengiriman
      const response = await fetch(`${BASE_URL}/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: stringifiedOrderId, // Mengirimkan order_id sebagai string
        }),
      });

      const result = await response.json();

      // Menangani response sukses dan error dari API
      if (response.ok) {
        const toastStatus = sessionStorage.getItem("toastShown");

        // Jika toast belum ditampilkan, tampilkan dan simpan status
        if (!toastStatus) {
          console.log("Displaying toast");
          toast.success(result.msg, {
            autoClose: 2000, // Toast hanya muncul selama 2 detik
            hideProgressBar: true, // Menyembunyikan progress bar
          });

          sessionStorage.setItem("toastShown", "true");
        }

        setTimeout(() => {
          fetchOrders(); // Refresh data setelah konfirmasi berhasil
        }, 2000);
      } else {
        toast.error(result.msg, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("An error occurred while confirming delivery.", {
        autoClose: 2000,
      });
      console.error(error);
    } finally {
      setIsConfirming(false); // reset flag setelah proses selesai
    }
  };

  // Fungsi untuk membuka modal dan mengatur order yang dipilih
  const openModalWithOrderDetails = (order: Order) => {
    setSelectedOrder(order); // Menyimpan order yang dipilih
    setModalDetail(true); // Membuka modal
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
      />

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Your Orders</h1>
        <p className="text-gray-600 mt-2">
          Track and manage your orders effortlessly
        </p>
      </div>

      <section className="mt-10 max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-300 opacity-30 rounded-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Order Overview
            </h2>
            <Button
              onClick={fetchOrders}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Refresh Orders
            </Button>
          </div>

          <div className="space-y-6">
            {ordersData.length === 0 ? (
              <div className="text-center text-gray-500">
                You have no active orders.
              </div>
            ) : (
              ordersData.map((order) => (
                <motion.div
                  key={order.order_id}
                  className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Order ID: {order.order_id}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">
                      Total:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(order.total_price)}
                    </span>
                    <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">
                      Items: {order.items.length}
                    </span>
                    <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">
                      Order Status: {OrderStatus[order.status]}
                    </span>
                    {order.shipping && (
                      <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">
                        Shipping Status: {order.shipping.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    {(order.status === "shipped" ||
                      order.status === "completed") &&
                      order.shipping?.status === "shipped" && (
                        <Button
                          onClick={() => handleConfirmDelivery(order.order_id)} // Konfirmasi pengiriman
                          className="bg-green-500 hover:bg-green-600 text-white"
                          disabled={isConfirming}
                        >
                          {isConfirming ? "Confirming..." : "Confirm Delivery"}
                        </Button>
                      )}

                    {(order.status === "pending" ||
                      order.status === "awaiting_payment") && (
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        Proceed to Payment
                      </Button>
                    )}

                    <Button
                      onClick={() => openModalWithOrderDetails(order)} // Memilih order untuk modal detail
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal untuk Menampilkan Detail Pesanan */}
      <Modal
        isOpen={modalDetail}
        onClose={() => setModalDetail(false)}
        title="Order Items"
      >
        {selectedOrder && (
          <CardOrderItems
            dataItems={selectedOrder.items}
            orderStatus={selectedOrder.status} // Menambahkan status dari getMyOrders
            totalPrice={selectedOrder.total_price} // Menambahkan total price dari getMyOrders
            totalItems={selectedOrder.total_items} // Menambahkan total items dari getMyOrders
          />
        )}
      </Modal>
    </>
  );
};

export default OrderConfirmation;
