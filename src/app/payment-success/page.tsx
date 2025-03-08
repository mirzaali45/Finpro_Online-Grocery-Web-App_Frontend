// app/payment-success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { getAuthToken } from "@/utils/forAuth";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { Order } from "@/types/orders-types";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Get order_id from URL query parameters
  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  const fetchOrderDetails = async () => {
    if (!orderId) {
      toast.error("Order ID is missing");
      router.push("/orders");
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();

      if (!token) {
        toast.error("Authentication error");
        router.push("/login");
        return;
      }

      // Fetch order details
      const response = await orderService.getMyOrders(token);

      // Find the specific order - we need to check data directly
      if (response && response.data) {
        // Find the specific order
        const orderDetails = response.data.find(
          (o) => o.order_id.toString() === orderId
        );

        if (orderDetails) {
          setOrder(orderDetails);
          console.log("Order details:", orderDetails);

          // Log the order status specifically
          console.log(`Order status: ${orderDetails.status}`);

          // Additional logging for debugging payment flow
          console.log(`Payment success page loaded for order ${orderId}`);
          console.log(
            `Transaction status from URL: ${
              transactionStatus || "Not provided"
            }`
          );
          console.log(`Status code from URL: ${statusCode || "Not provided"}`);

          // If order is still in awaiting_payment status, we might want to trigger a status check
          if (orderDetails.status === "awaiting_payment") {
            console.log(
              `⚠️ Warning: Order ${orderId} is still in awaiting_payment status after successful payment redirect`
            );
          }
        } else {
          toast.error("Order not found");
          router.push("/orders");
        }
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, router, statusCode, transactionStatus]);

  // Function to manually check and update payment status
  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      setCheckingStatus(true);
      toast.loading("Checking payment status...");

      // Use the API base URL from your environment
      const API_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;
      const response = await fetch(
        `${API_URL}/payments/public/${orderId}/check-status`
      );
      const data = await response.json();

      if (data.success) {
        if (data.previous_status !== data.current_status) {
          toast.success(
            `Payment status updated from ${data.previous_status} to ${data.current_status}`
          );
          // Refresh order details
          fetchOrderDetails();
        } else {
          toast.success("Payment status verified, no update needed");
        }
      } else {
        toast.error(data.message || "Failed to check payment status");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Failed to check payment status");
    } finally {
      setCheckingStatus(false);
      toast.dismiss();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-white">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-300">
              Your order has been placed and payment has been received.
            </p>

            {/* Order Status */}
            {order && (
              <div className="mt-3">
                <span className="text-gray-300">Order Status: </span>
                <span
                  className={`font-medium ${
                    order.status === "shipped"
                      ? "text-green-400"
                      : order.status === "awaiting_payment"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            )}

            {/* Check Status Button - Only show if status is still awaiting_payment */}
            {order && order.status === "awaiting_payment" && (
              <button
                onClick={checkPaymentStatus}
                disabled={checkingStatus}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {checkingStatus ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  "Update Payment Status"
                )}
              </button>
            )}

            {/* Transaction details */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg w-full max-w-md">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-400 text-left">Order ID:</div>
                <div className="font-medium text-right">{orderId}</div>

                <div className="text-gray-400 text-left">Status:</div>
                <div className="font-medium text-green-400 text-right">
                  {transactionStatus === "settlement"
                    ? "Completed"
                    : transactionStatus === "capture"
                    ? "Captured"
                    : transactionStatus || "Completed"}
                </div>

                {order && (
                  <>
                    <div className="text-gray-400 text-left">Amount:</div>
                    <div className="font-medium text-right">
                      Rp {order.total_price.toLocaleString("id-ID")}
                    </div>

                    <div className="text-gray-400 text-left">Date:</div>
                    <div className="font-medium text-right">
                      {new Date().toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push(`/order-detail/${orderId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              View Order Details
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
