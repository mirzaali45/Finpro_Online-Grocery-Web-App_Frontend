import React from "react";
import DealsPageContent from "@/components/customer-discount/DealsContent";
import FeaturedDiscountCarousel from "@/components/customer-discount/FeaturedDealCarousel";
import { Metadata } from "next";

// Export metadata for the page
export const metadata: Metadata = {
  title: "Deals & Discounts",
  description:
    "Explore all the latest deals and discounts available on our platform",
};

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Deals & Discounts
          </h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto">
            Discover exclusive discounts from our partner stores and save on
            your favorite products
          </p>
        </div>

        {/* Featured Discounts Carousel */}
        <FeaturedDiscountCarousel />

        {/* Category Quick Select */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700">
            All Discounts
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700">
            Fashion
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700">
            Electronics
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700">
            Home & Living
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-700">
            Beauty
          </button>
        </div>

        {/* Notification Banner */}
        <div className="mb-10 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="hidden sm:block p-2 bg-purple-500 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">
                Get notified about new deals!
              </h3>
              <p className="text-purple-200 text-sm mt-1">
                Subscribe to receive notifications when new discounts are
                available.
              </p>
            </div>
          </div>
          <button className="bg-white text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>

        {/* Main Discount Component */}
        <h2 className="text-2xl font-bold mb-6 text-white">All Discounts</h2>
        <DealsPageContent />
      </div>
    </main>
  );
}
