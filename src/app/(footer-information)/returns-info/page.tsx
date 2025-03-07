"use client";

import React, { useState } from "react";

// Define the ReturnReason type
interface ReturnReason {
  reason: string;
  description: string;
  process: string[];
  requirements: string[];
  timeframe: string;
  refund_type: string;
  icon: React.ReactNode;
}

export default function ReturnsInformation(): JSX.Element {
  const reasons: ReturnReason[] = [
    {
      reason: "Defective Product",
      description: "Item arrived damaged or doesn't function properly",
      process: [
        "Submit return request with photos of the defect",
        "Receive return approval and shipping label",
        "Ship the item back using provided label",
        "Refund processed upon receipt and inspection",
      ],
      requirements: [
        "Original packaging if possible",
        "All accessories and components included",
        "Clear photos of the defect",
      ],
      timeframe: "30 days from delivery date",
      refund_type: "Full refund including shipping",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      reason: "Wrong Item Received",
      description: "Item received doesn't match what was ordered",
      process: [
        "Submit return request with order number and photos",
        "Receive return approval and shipping label",
        "Ship the item back using provided label",
        "Correct item shipped or full refund processed",
      ],
      requirements: [
        "Item in original condition",
        "Original packaging",
        "Photo of item received vs item ordered",
      ],
      timeframe: "14 days from delivery date",
      refund_type: "Replacement or full refund including shipping",
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
    },
    {
      reason: "Changed My Mind",
      description: "Item no longer wanted or needed",
      process: [
        "Submit return request within timeframe",
        "Receive return approval and instructions",
        "Ship the item back at your expense",
        "Refund processed upon receipt and inspection",
      ],
      requirements: [
        "Item in new, unused condition",
        "Original packaging intact",
        "All accessories, manuals, and tags included",
      ],
      timeframe: "14 days from delivery date",
      refund_type: "Original payment method minus shipping fees",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const [expandedReason, setExpandedReason] = useState<string>(
    reasons[0].reason
  );

  const toggleExpand = (reason: string): void => {
    setExpandedReason(expandedReason === reason ? "" : reason);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-16">
      {" "}
      {/* Added pt-20 for navbar spacing */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Returns & Refunds
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            <p className="mt-4 text-gray-300">
              Our hassle-free return policy makes it easy to return items if
              you re not completely satisfied.
            </p>
          </header>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Return Reasons
            </h2>

            {/* Dynamic Return Reasons */}
            <div className="space-y-6">
              {reasons.map((item) => {
                // Different color schemes based on reason type
                let colors = { border: "", bg: "", text: "", accent: "" };

                if (item.reason === "Defective Product") {
                  colors = {
                    border: "border-red-600",
                    bg: "bg-red-900",
                    text: "text-red-300",
                    accent: "text-red-400",
                  };
                } else if (item.reason === "Wrong Item Received") {
                  colors = {
                    border: "border-yellow-600",
                    bg: "bg-yellow-900",
                    text: "text-yellow-300",
                    accent: "text-yellow-400",
                  };
                } else {
                  colors = {
                    border: "border-blue-600",
                    bg: "bg-blue-900",
                    text: "text-blue-300",
                    accent: "text-blue-400",
                  };
                }

                return (
                  <div key={item.reason}>
                    <div
                      className={`border ${colors.border} rounded-lg bg-gray-750 shadow-lg shadow-${colors.bg}/20 overflow-hidden`}
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleExpand(item.reason)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center mr-3`}
                          >
                            <div className={colors.text}>{item.icon}</div>
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${colors.text}`}>
                              {item.reason}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium ${colors.accent} mr-3`}
                          >
                            {item.timeframe}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                              expandedReason === item.reason ? "rotate-180" : ""
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

                      {expandedReason === item.reason && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className={`${colors.text} font-medium mb-2`}>
                                Return Process
                              </h4>
                              <ol className="space-y-1 text-gray-300 list-decimal list-inside">
                                {item.process.map((step, index) => (
                                  <li key={index} className="pl-1">
                                    {step}
                                  </li>
                                ))}
                              </ol>

                              <h4
                                className={`${colors.text} font-medium mt-4 mb-2`}
                              >
                                Refund Type
                              </h4>
                              <p className="text-gray-300">
                                {item.refund_type}
                              </p>
                            </div>

                            <div>
                              <h4 className={`${colors.text} font-medium mb-2`}>
                                Requirements
                              </h4>
                              <ul className="space-y-1 text-gray-300">
                                {item.requirements.map((req, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className={`${colors.accent} mr-2`}>
                                      ✓
                                    </span>{" "}
                                    {req}
                                  </li>
                                ))}
                              </ul>
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

          {/* Return Instructions */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              How to Initiate a Return
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
                  Sign in to your Tech Lite account and navigate to your order
                  history.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <span className="text-purple-300 text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Submit Return Request
                </h3>
                <p className="text-gray-300">
                  Select the item you want to return, choose a reason, and
                  provide required details.
                </p>
              </div>

              <div className="bg-gray-750 p-5 rounded-lg border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <span className="text-purple-300 text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Ship the Item
                </h3>
                <p className="text-gray-300">
                  Package the item securely and ship it using the provided label
                  or instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Return Policies */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-purple-300">
              Return Policies
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Non-Returnable Items
                </h3>
                <p className="text-gray-300">
                  The following items cannot be returned once opened or used:
                </p>
                <ul className="mt-2 space-y-1 text-gray-300 list-disc list-inside pl-2">
                  <li>Software and digital downloads</li>
                  <li>Gift cards and prepaid cards</li>
                  <li>Custom-configured computers and components</li>
                  <li>
                    Personal audio devices (earbuds, headphones) for hygiene
                    reasons
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Return Shipping Costs
                </h3>
                <p className="text-gray-300">
                  For defective items or if we sent the wrong item, return
                  shipping is free. For returns due to change of mind or other
                  non-defect reasons, the customer is responsible for return
                  shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Refund Processing Time
                </h3>
                <p className="text-gray-300">
                  Refunds are typically processed within 3-5 business days after
                  we receive and inspect the returned item. The time it takes
                  for the refund to appear in your account depends on your
                  payment method and financial institution.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">
                  Damaged During Return Shipping
                </h3>
                <p className="text-gray-300">
                  Items damaged during return shipping might not be eligible for
                  a full refund. Please package returns securely to prevent
                  damage during transit.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">
              Need Help with Returns?
            </h2>
            <p className="text-gray-300 mb-4">
              Our customer service team is available to assist with any return
              or refund questions.
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
