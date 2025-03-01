"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import StoreSideBar from "@/components/sidebarStoreAdmin";

export default function DiscountStore() {
  const [formData, setFormData] = useState({
    discountName: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    description: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Discount data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <StoreSideBar />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-[10vh]">
        <h1 className="text-2xl font-bold mb-6">Create New Discount</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="discountName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount Name
            </label>
            <input
              id="discountName"
              name="discountName"
              type="text"
              value={formData.discountName}
              onChange={handleInputChange}
              placeholder="Summer Sale 2025"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount Percentage (%)
            </label>
            <input
              id="discountPercentage"
              name="discountPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              placeholder="20"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minPurchaseAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Minimum Purchase Amount ($)
              </label>
              <input
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                type="number"
                min="0"
                value={formData.minPurchaseAmount}
                onChange={handleInputChange}
                placeholder="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="maxDiscountAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Discount Amount ($)
              </label>
              <input
                id="maxDiscountAmount"
                name="maxDiscountAmount"
                type="number"
                min="0"
                value={formData.maxDiscountAmount}
                onChange={handleInputChange}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter discount details and terms..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
