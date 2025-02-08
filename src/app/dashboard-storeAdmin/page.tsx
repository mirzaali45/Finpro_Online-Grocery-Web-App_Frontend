"use client";

import React, { useState } from "react";
import { SalesChart, StockChart } from "@/components/chart-table/Chart";
import StoreSideBar from "@/components/sidebarStoreAdmin";

export default function DashboardStoreAdmin() {
  const [activeTab, setActiveTab] = useState<"sales" | "stock">("sales");
  const [selectedMonth, setSelectedMonth] = useState("January");

  const salesData = [
    { month: "Jan", total: 3000, electronics: 1500, accessories: 1500 },
    { month: "Feb", total: 4000, electronics: 2000, accessories: 2000 },
  ];

  const stockData = [
    {
      product: "iPhone 13",
      initial: 100,
      additions: 50,
      reductions: 30,
      final: 120,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StoreSideBar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {" "}
        {/* ml-64 matches sidebar width */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
          </select>
        </div>
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("sales")}
              className={`pb-4 px-2 font-medium text-sm relative ${
                activeTab === "sales"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`pb-4 px-2 font-medium text-sm relative ${
                activeTab === "stock"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Stock Report
            </button>
          </nav>
        </div>
        {/* Sales Report Content */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {/* Monthly Sales Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">
                Monthly Sales Overview
              </h2>
              <SalesChart data={salesData} />
            </div>

            {/* Sales by Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Sales by Category</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Electronics
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        $15,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        150
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Accessories
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        $8,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        200
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Stock Report Content */}
        {activeTab === "stock" && (
          <div className="space-y-6">
            {/* Stock Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Stock Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Initial Stock
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Additions
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reductions
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Final Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stockData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {item.initial}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                          +{item.additions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                          -{item.reductions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {item.final}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Movement Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">
                Stock Movement Timeline
              </h2>
              <StockChart data={stockData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
