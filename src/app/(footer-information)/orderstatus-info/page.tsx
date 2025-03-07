"use client";

import React, { useState } from "react";

// Define the Order Status type
interface OrderStatus {
  status: string;
  description: string;
  details: string[];
  estimatedTime: string;
  nextStep: string;
  icon: React.ReactNode;
  color: {
    border: string;
    bg: string;
    text: string;
    accent: string;
  };
}

export default function OrderStatusInformation(): JSX.Element {
  const statuses: OrderStatus[] = [
    {
      status: "Pending",
      description: "Your order has been submitted and is awaiting confirmation",
      details: [
        "Order details registered in our system",
        "Automated inventory check in progress",
        "Order validation in queue",
        "Awaiting initial processing",
      ],
      estimatedTime: "Within 1-2 hours",
      nextStep: "Awaiting Payment",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: {
        border: "border-blue-600",
        bg: "bg-blue-900",
        text: "text-blue-300",
        accent: "text-blue-400",
      },
    },
    {
      status: "Awaiting Payment",
      description: "Your order is confirmed and waiting for payment",
      details: [
        "Order confirmation email sent",
        "Payment link provided",
        "Payment methods activated",
        "Order reserved for 24 hours pending payment",
      ],
      estimatedTime: "Waiting for your payment",
      nextStep: "Processing (after payment received)",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: {
        border: "border-yellow-600",
        bg: "bg-yellow-900",
        text: "text-yellow-300",
        accent: "text-yellow-400",
      },
    },
    {
      status: "Processing",
      description: "Your payment is confirmed and order is being prepared",
      details: [
        "Payment successfully verified",
        "Products allocated from inventory",
        "Order being packaged",
        "Shipping label created",
        "Quality check in progress",
      ],
      estimatedTime: "1-2 business days",
      nextStep: "Shipped",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      color: {
        border: "border-purple-600",
        bg: "bg-purple-900",
        text: "text-purple-300",
        accent: "text-purple-400",
      },
    },
    {
      status: "Shipped",
      description: "Your order is on its way to you",
      details: [
        "Package handed over to shipping carrier",
        "Tracking number assigned",
        "Shipping confirmation email sent",
        "Real-time tracking available",
        "Estimated delivery date provided",
      ],
      estimatedTime: "Depends on shipping method",
      nextStep: "Completed",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.05A2.5 2.5 0 0011 5H8.05A2.5 2.5 0 005 7h-.05A1 1 0 004 8v1a1 1 0 001 1h1a1 1 0 001-1v-1h2v3H4a1 1 0 00-1 1v2a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-1a1 1 0 00-1-1H8.05a2.5 2.5 0 00-4.9 0H3V4z" />
        </svg>
      ),
      color: {
        border: "border-orange-600",
        bg: "bg-orange-900",
        text: "text-orange-300",
        accent: "text-orange-400",
      },
    },
    {
      status: "Completed",
      description: "Your order has been delivered and is now complete",
      details: [
        "Package delivered to specified address",
        "Delivery confirmation recorded",
        "Proof of delivery available",
        "Review product option available",
        "Post-purchase support accessible",
      ],
      estimatedTime: "Completed",
      nextStep: "Order Complete",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: {
        border: "border-green-600",
        bg: "bg-green-900",
        text: "text-green-300",
        accent: "text-green-400",
      },
    },
    {
      status: "Canceled",
      description: "Your order has been canceled",
      details: [
        "Order has been canceled",
        "Cancellation confirmation sent",
        "Payment refund initiated (if applicable)",
        "Products returned to inventory",
        "Reason for cancellation recorded",
      ],
      estimatedTime: "Processed",
      nextStep: "None - Order closed",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: {
        border: "border-red-600",
        bg: "bg-red-900",
        text: "text-red-300",
        accent: "text-red-400",
      },
    },
  ];

  const [expandedStatus, setExpandedStatus] = useState<string>(
    statuses[0].status
  );

  const toggleExpand = (status: string): void => {
    setExpandedStatus(expandedStatus === status ? "" : status);
  };

  // Dummy order for tracking example
  const exampleOrder = {
    orderNumber: "TL-29385746",
    date: "March 5, 2025",
    status: "Processing",
    items: [
      { name: "Wireless Gaming Mouse", price: 450000, quantity: 1 },
      { name: "Mechanical Keyboard", price: 1250000, quantity: 1 },
    ],
    shipping: {
      method: "Regular Delivery",
      address: "Jl. Sudirman No. 123, Jakarta",
      tracking: "JNE-293847563829",
    },
  };

  // Function to format price in Indonesian Rupiah
  const formatRupiah = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate progress percentage based on status
  const getProgressPercentage = (status: string): number => {
    const statusValues = {
      Pending: 10,
      "Awaiting Payment": 20,
      Processing: 40,
      Shipped: 70,
      Completed: 100,
      Canceled: 0,
    };

    return statusValues[status as keyof typeof statusValues] || 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-16">
      {" "}
      {/* Added pt-20 for navbar spacing */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Order Status Information
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            <p className="mt-4 text-gray-300">
              Track your order and understand what each status means.
            </p>
          </header>

          {/* Order Tracking Example */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Example Order Tracking
            </h2>

            <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-blue-300">
                    Order #{exampleOrder.orderNumber}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Placed on {exampleOrder.date}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm font-medium">
                    {exampleOrder.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <h4 className="text-md font-medium text-gray-300 mb-2">
                  Items
                </h4>
                <div className="space-y-2">
                  {exampleOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-blue-400">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <h4 className="text-md font-medium text-gray-300 mb-2">
                  Shipping
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-400">Method:</span>{" "}
                    {exampleOrder.shipping.method}
                  </p>
                  <p>
                    <span className="text-gray-400">Address:</span>{" "}
                    {exampleOrder.shipping.address}
                  </p>
                  <p>
                    <span className="text-gray-400">Tracking:</span>{" "}
                    <span className="text-blue-400">
                      {exampleOrder.shipping.tracking}
                    </span>
                  </p>
                </div>
              </div>

              {/* Tracking Progress Bar */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-300 mb-3">
                  Tracking Progress
                </h4>
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{
                        width: `${getProgressPercentage(exampleOrder.status)}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Pending</span>
                    <span>Awaiting Payment</span>
                    <span className="text-purple-400">Processing</span>
                    <span>Shipped</span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Descriptions */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Order Status Definitions
            </h2>

            <div className="space-y-6">
              {statuses.map((status) => (
                <div key={status.status}>
                  <div
                    className={`border ${status.color.border} rounded-lg bg-gray-750 shadow-lg shadow-${status.color.bg}/20 overflow-hidden`}
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleExpand(status.status)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${status.color.bg} flex items-center justify-center mr-3`}
                        >
                          <div className={status.color.text}>{status.icon}</div>
                        </div>
                        <div>
                          <h3
                            className={`font-bold text-lg ${status.color.text}`}
                          >
                            {status.status}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {status.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${status.color.accent} mr-3`}
                        >
                          {status.estimatedTime}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                            expandedStatus === status.status ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {expandedStatus === status.status && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4
                              className={`${status.color.text} font-medium mb-2`}
                            >
                              What s Happening
                            </h4>
                            <ul className="space-y-1 text-gray-300">
                              {status.details.map((detail, index) => (
                                <li key={index} className="flex items-start">
                                  <span
                                    className={`${status.color.accent} mr-2 mt-1`}
                                  >
                                    •
                                  </span>{" "}
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4
                              className={`${status.color.text} font-medium mb-2`}
                            >
                              Next Step
                            </h4>
                            <p className="text-gray-300">{status.nextStep}</p>

                            {status.status === "Pending" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                You ll receive an email confirmation when your
                                order is verified.
                              </p>
                            )}

                            {status.status === "Awaiting Payment" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                Complete your payment to move your order to
                                processing.
                              </p>
                            )}

                            {status.status === "Processing" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                No action needed. We re preparing your items for
                                shipment.
                              </p>
                            )}

                            {status.status === "Shipped" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                Use your tracking number to monitor your
                                package journey.
                              </p>
                            )}

                            {status.status === "Completed" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                Consider leaving a review for your purchased
                                products.
                              </p>
                            )}

                            {status.status === "Canceled" && (
                              <p className="mt-4 text-gray-400 text-sm">
                                Contact customer service if you have any
                                questions about the cancellation.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Tracking Help */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              How to Track Your Order
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <span className="text-purple-300 text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Login to Your Account
                </h3>
                <p className="text-gray-300">
                  Sign in to your Tech Lite account and go to My Orders
                  section.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <span className="text-purple-300 text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Find Your Order
                </h3>
                <p className="text-gray-300">
                  Locate the order you want to track in your order history list.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <span className="text-purple-300 text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  View Order Details
                </h3>
                <p className="text-gray-300">
                  Click on the order to see its current status and tracking
                  information.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-300">
                    No Account?
                  </h3>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>
                      You can also track your order using your order number and
                      email address from the Track Order page in the footer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Questions About Your Order?
            </h2>
            <p className="text-gray-300 mb-4">
              Our customer service team is available to assist with any
              order-related inquiries.
            </p>
            <div className="flex items-center text-blue-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>finalprojectkel@gmail.com</span>
            </div>
            <div className="flex items-center text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+62 81 1229 82003</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
