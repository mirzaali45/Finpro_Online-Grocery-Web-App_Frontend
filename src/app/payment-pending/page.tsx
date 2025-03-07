"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from URL
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-white">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            {/* Pending Icon */}
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-2">Payment Pending</h1>
            <p className="text-gray-300">
              Your payment is being processed. Please wait for confirmation.
            </p>

            {/* Order details */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg w-full max-w-md">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-400 text-left">Order ID:</div>
                <div className="font-medium text-right">{orderId || "N/A"}</div>

                <div className="text-gray-400 text-left">Status:</div>
                <div className="font-medium text-yellow-400 text-right">
                  Pending
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <p>
                  If you ve already completed the payment, please wait for the
                  system to update. This may take a few minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push("/orders")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              View Orders
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
