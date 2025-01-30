"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import Link from "next/link";

// Interface for store data
interface Store {
  store_id: number;
  store_name: string;
  address: string;
  city: string;
}

export default function StoreDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stores, setStores] = useState<Store[]>([]); // State to hold store data
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${base_url_be}/store`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }

        const data: Store[] = await response.json();
        setStores(data); // Set the store data in the state
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchStores(); // Call the function to fetch stores
  }, []);

  // Show loading message while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading stores...</p>
      </div>
    );
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Store Management
              </h1>
              <p className="text-gray-600">Overview of all your stores</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Store
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {store.store_name || "No name available"}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Address:</strong>{" "}
                {store.address || "No address available"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>City:</strong> {store.city || "No city available"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Store
            </h2>

            {/* Form for adding new store */}
            <form>
              <div className="mb-4">
                <label
                  htmlFor="storeName"
                  className="block text-sm text-gray-600"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter store name"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm text-gray-600"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter store address"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm text-gray-600">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter city"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
