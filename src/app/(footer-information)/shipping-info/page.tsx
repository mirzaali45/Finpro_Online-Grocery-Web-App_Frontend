"use client";

import React, { useState } from "react";

// Define the CourierOption type
interface CourierOption {
  shipping_name: string;
  shipping_cost: number;
  value: string;
  label: string;
  estimated_days: string;
}

export default function ShippingInformation(): JSX.Element {
  // Your existing shipping options
  const options: CourierOption[] = [
    {
      shipping_name: "Economy Delivery",
      shipping_cost: 10000,
      value: "economy",
      label: "Economy Delivery (2-3 days) - Rp 10,000",
      estimated_days: "2-3 days",
    },
    {
      shipping_name: "Regular Delivery",
      shipping_cost: 20000,
      value: "regular",
      label: "Regular Delivery (1-2 days) - Rp 20,000",
      estimated_days: "1-2 days",
    },
    {
      shipping_name: "Same Day Delivery",
      shipping_cost: 40000,
      value: "sameday",
      label: "Same Day Delivery - Rp 40,000",
      estimated_days: "Today",
    },
  ];

  const [expandedOption, setExpandedOption] = useState<string>(
    options[0].value
  );

  const toggleExpand = (option: string): void => {
    setExpandedOption(expandedOption === option ? "" : option);
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

  // Function to get shipping option color scheme
  const getColorScheme = (value: string) => {
    switch (value) {
      case "economy":
        return {
          border: "border-green-600",
          shadow: "shadow-green-500/20",
          bg: "bg-green-900",
          text: "text-green-300",
          price: "text-green-400",
        };
      case "regular":
        return {
          border: "border-blue-600",
          shadow: "shadow-blue-500/20",
          bg: "bg-blue-900",
          text: "text-blue-300",
          price: "text-blue-400",
        };
      case "sameday":
        return {
          border: "border-purple-600",
          shadow: "shadow-purple-500/20",
          bg: "bg-purple-900",
          text: "text-purple-300",
          price: "text-purple-400",
        };
      default:
        return {
          border: "border-gray-600",
          shadow: "shadow-gray-500/20",
          bg: "bg-gray-900",
          text: "text-gray-300",
          price: "text-gray-400",
        };
    }
  };

  // Function to get appropriate icon for shipping method
  const getShippingIcon = (value: string) => {
    switch (value) {
      case "economy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "regular":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.05A2.5 2.5 0 0011 5H8.05A2.5 2.5 0 005 7h-.05A1 1 0 004 8v1a1 1 0 001 1h1a1 1 0 001-1v-1h2v3H4a1 1 0 00-1 1v2a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-1a1 1 0 00-1-1H8.05a2.5 2.5 0 00-4.9 0H3V4z" />
          </svg>
        );
      case "sameday":
        return (
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
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-16">
      {" "}
      {/* Added pt-20 for navbar spacing */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Shipping Information
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            <p className="mt-4 text-gray-300">
              Choose the shipping method that best suits your needs.
            </p>
          </header>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Available Shipping Methods
            </h2>

            {/* Dynamic Shipping Options */}
            <div className="space-y-6">
              {options.map((option) => {
                const colors = getColorScheme(option.value);

                return (
                  <div key={option.value}>
                    <div
                      className={`border ${colors.border} rounded-lg bg-gray-750 shadow-lg ${colors.shadow} overflow-hidden`}
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleExpand(option.value)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center mr-3`}
                          >
                            <div className={colors.text}>
                              {getShippingIcon(option.value)}
                            </div>
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${colors.text}`}>
                              {option.shipping_name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Estimated: {option.estimated_days}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-xl font-bold ${colors.price} mr-3`}
                          >
                            {formatRupiah(option.shipping_cost)}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                              expandedOption === option.value
                                ? "rotate-180"
                                : ""
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

                      {expandedOption === option.value && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className={`${colors.text} font-medium mb-2`}>
                                Shipping Details
                              </h4>
                              {option.value === "economy" && (
                                <ul className="space-y-1 text-gray-300">
                                  <li className="flex items-center">
                                    <span className="text-green-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Delivery time 2-3 business days
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-green-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Basic insurance up to {formatRupiah(500000)}
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-green-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Standard packaging
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-green-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Fuel-efficient route selection
                                  </li>
                                </ul>
                              )}
                              {option.value === "regular" && (
                                <ul className="space-y-1 text-gray-300">
                                  <li className="flex items-center">
                                    <span className="text-blue-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Delivery time 1-2 business days
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-blue-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Insurance up to {formatRupiah(1000000)}
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-blue-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Real-time tracking
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-blue-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Priority handling
                                  </li>
                                </ul>
                              )}
                              {option.value === "sameday" && (
                                <ul className="space-y-1 text-gray-300">
                                  <li className="flex items-center">
                                    <span className="text-purple-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Same day delivery
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-purple-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Insurance up to {formatRupiah(2000000)}
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-purple-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Detailed real-time tracking
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-purple-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Premium priority
                                  </li>
                                  <li className="flex items-center">
                                    <span className="text-purple-400 mr-2">
                                      ✓
                                    </span>{" "}
                                    Delivery guarantee
                                  </li>
                                </ul>
                              )}
                            </div>

                            <div>
                              <h4 className={`${colors.text} font-medium mb-2`}>
                                Service Areas
                              </h4>
                              {option.value === "economy" && (
                                <div>
                                  <p className="text-gray-300">
                                    Available for Java, Bali, and Sumatra
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    Remote areas may require additional time
                                  </p>
                                </div>
                              )}
                              {option.value === "regular" && (
                                <div>
                                  <p className="text-gray-300">
                                    Available throughout Indonesia
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    Including all major islands
                                  </p>
                                </div>
                              )}
                              {option.value === "sameday" && (
                                <div>
                                  <p className="text-gray-300">
                                    Available for major cities
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    Jakarta, Bandung, Surabaya, Semarang, Medan,
                                    Makassar, Denpasar
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    Orders must be placed before 12:00
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Policies */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Shipping Policies
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Order Processing
                </h3>
                <p className="text-gray-300">
                  Orders are typically processed within 24 hours. Orders placed
                  after 2PM local time may be processed the following business
                  day.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Tracking Information
                </h3>
                <p className="text-gray-300">
                  Tracking numbers are automatically emailed once your order
                  ships. You can also view tracking information in your account
                  dashboard.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Delivery Delays
                </h3>
                <p className="text-gray-300">
                  Weather conditions and high-volume periods may affect delivery
                  estimates. We'll notify you of any known delays affecting your
                  shipment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Delivery Guarantee
                </h3>
                <p className="text-gray-300">
                  We are committed to delivering your order on time. If your
                  Same Day delivery is late, you are entitled to a full refund
                  of the shipping cost.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Questions About Shipping?
            </h2>
            <p className="text-gray-300 mb-4">
              Our customer service team is available to assist with any
              shipping-related inquiries.
            </p>
            <div className="flex items-center text-blue-400">
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
          </div>
        </div>
      </div>
    </div>
  );
}
