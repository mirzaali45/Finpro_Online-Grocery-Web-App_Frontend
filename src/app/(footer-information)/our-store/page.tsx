"use client";

import { useState } from "react";
import { useStores } from "@/components/hooks/useGetStore";

export default function AllStores() {
  const { stores, loading, error, pagination, goToPage, setItemsPerPage } =
    useStores({ page: 1, limit: 9 });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-6 py-4 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error Occurred</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-amber-900/30 border border-amber-700 text-amber-400 px-6 py-4 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">No Stores Found</h3>
          <p>There are currently no stores available to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Store Directory
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our collection of partner stores offering a wide range of
            products and services
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 border border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-start mb-5">
                  {/* Avatar with gradient fallback - larger and square */}
                  <div className="mr-5 flex-shrink-0">
                    {store.User?.avatar ? (
                      <div className="h-24 w-24 rounded-lg overflow-hidden shadow-lg ring-2 ring-indigo-500/30">
                        <img
                          src={store.User.avatar}
                          alt={`${store.User?.username || "Store owner"}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg ring-2 ring-indigo-500/30">
                        <span className="text-white text-3xl font-medium">
                          {store.User?.first_name?.charAt(0) ||
                            store.User?.username?.charAt(0) ||
                            store.store_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Store name and owner */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {store.store_name}
                    </h2>
                    {store.User && (
                      <p className="text-gray-400 text-sm">
                        {store.User.first_name && store.User.last_name
                          ? `${store.User.first_name} ${store.User.last_name}`
                          : store.User.username || "Store Administrator"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Store location info with subtle divider */}
                <div className="mb-5 pb-5 border-b border-gray-700">
                  <div className="flex items-center text-gray-400 mb-1">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <p className="text-sm truncate">{store.address}</p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      ></path>
                    </svg>
                    <p className="text-sm">
                      {store.city}, {store.province} {store.postcode}
                    </p>
                  </div>
                </div>

                {/* Product info and creation date */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-indigo-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m-8 4l8-4"
                      ></path>
                    </svg>
                    <span className="text-sm font-medium">
                      {store.Product?.length || 0} products
                    </span>
                  </div>

                  <div className="text-gray-500 text-xs">
                    {store.created_at && (
                      <>
                        Established{" "}
                        {new Date(store.created_at).toLocaleDateString()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant Pagination Controls */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col items-center justify-center space-y-6 mt-12">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  pagination.page <= 1
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    // Logic to show pages around current page
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${
                          pagination.page === pageNum
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  pagination.page >= pagination.pages
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-500 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <div className="inline-flex items-center h-8 rounded-md bg-gray-800 px-1">
                <span className="text-gray-400 text-sm px-2">Show</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-gray-800 text-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none"
                >
                  {[12, 24, 36, 48].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
