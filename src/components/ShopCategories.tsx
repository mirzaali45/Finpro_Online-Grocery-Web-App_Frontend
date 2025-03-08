"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { categoryService } from "@/services/category-admin.service";
import { Category, PaginatedResponse } from "@/types/category-types";

export default function BrandShowcase() {
  const [brands, setBrands] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands(pagination.currentPage);
  }, []);

  const fetchBrands = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await categoryService.getCategories(page);
      setBrands(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch brands");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchBrands(page);
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-purple-600 animate-spin mb-8"></div>
            <span className="inline-block text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 animate-pulse">
              Loading Brand Collection...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 text-center">
          <div className="py-20 flex flex-col items-center">
            <svg
              className="w-20 h-20 text-red-500 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 via-[#0c0c15] to-neutral-950 py-20 overflow-hidden relative">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-3xl"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 relative z-10">
        {/* Heading with enhanced style */}
        <div className="mb-20 text-center">
          <h3 className="inline-block text-sm uppercase tracking-wider font-medium text-indigo-400 mb-4">
            Discover Excellence
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 mb-6">
            Featured Brands
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.category_id}
              className="group relative h-[340px] rounded-2xl overflow-hidden animate-fadeIn transition-all duration-700 hover:scale-[1.02]"
            >
              {/* Card base with enhanced glass effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-700/30 shadow-[0_0_40px_rgba(66,71,148,0.15)] transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(79,70,229,0.3)]"></div>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-purple-600/0 to-pink-600/0 opacity-0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>

              {/* Light effect */}
              <div className="absolute -inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(120,119,238,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Animated border */}
              <div className="absolute inset-[1px] rounded-2xl z-0 before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-transparent before:via-indigo-500/50 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-xl bg-neutral-900/90 rounded-2xl"></div>
              </div>

              {/* Content container */}
              <div className="relative h-full p-8 flex flex-col items-center justify-between z-10">
                {/* Brand name */}
                <div className="w-full">
                  <span className="inline-block px-4 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-sm font-medium text-indigo-300 mb-2">
                    Premium
                  </span>
                </div>

                {/* Logo container with enhanced effects */}
                <div className="relative w-4/5 aspect-square mb-4 transform transition-all duration-500 group-hover:scale-105">
                  {/* Multi-layered glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-600/10 to-purple-600/10 group-hover:from-indigo-600/20 group-hover:to-purple-600/20 transition-all duration-700"></div>

                  <div className="absolute inset-0 rounded-full flex items-center justify-center p-4 backdrop-blur-sm bg-neutral-900/40 border border-neutral-800/50 overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                    <Image
                      src={brand.category_thumbnail || "/placeholder.jpg"}
                      alt={`${brand.category_name} brand logo`}
                      fill
                      className="object-contain p-6 transition-all duration-700 group-hover:p-5"
                    />
                  </div>
                </div>

                {/* Brand details */}
                <div className="w-full text-center">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-500 mb-2">
                    {brand.category_name}
                  </h3>

                  <p className="text-sm text-neutral-400 mb-4 group-hover:text-indigo-300 transition-all duration-500">
                    Premium Collection
                  </p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-all duration-500">
                      {Math.floor(Math.random() * 100) + 10} Products Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="relative z-10 py-20 flex flex-col items-center">
            <svg
              className="w-20 h-20 text-neutral-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              ></path>
            </svg>
            <p className="text-center text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 to-neutral-600">
              No brands available at the moment
            </p>
          </div>
        )}

        {/* Enhanced Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="relative z-10 flex justify-center mt-16 space-x-3">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-5 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                pagination.currentPage === 1
                  ? "bg-neutral-800/40 text-neutral-500 cursor-not-allowed backdrop-blur-sm"
                  : "bg-neutral-800/40 text-neutral-300 hover:bg-indigo-600/80 hover:text-white backdrop-blur-sm border border-neutral-700/50 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
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
              <span>Previous</span>
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-base font-medium transition-all duration-300 ${
                    pagination.currentPage === page
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                      : "bg-neutral-800/40 text-neutral-300 hover:bg-indigo-600/40 hover:text-white backdrop-blur-sm border border-neutral-700/50 hover:border-indigo-500"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-5 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-neutral-800/40 text-neutral-500 cursor-not-allowed backdrop-blur-sm"
                  : "bg-neutral-800/40 text-neutral-300 hover:bg-indigo-600/80 hover:text-white backdrop-blur-sm border border-neutral-700/50 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              }`}
            >
              <span>Next</span>
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
        )}
      </div>
    </section>
  );
}
