import React from "react";
import FeaturedDiscountCarousel from "@/components/customer-discount/FeaturedDealCarousel";
import DiscountsList from "@/components/customer-discount/DiscountVoucher";
import DiscountProductsContainer from "@/components/customer-discount/DiscountProductContainer";
import { Bell } from "lucide-react";

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Savings Hub
          </h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto">
            Discover personalized deals tailored just for you. Save smarter,
            shop better.
          </p>
        </header>

        <section className="mb-10">
          <FeaturedDiscountCarousel />
        </section>

        <div className="mb-10 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="hidden sm:block p-2 bg-purple-500 rounded-full mr-4">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Never Miss a Deal!</h3>
              <p className="text-purple-200 text-sm mt-1">
                Get instant notifications about new discounts.
              </p>
            </div>
          </div>
          <button className="bg-white text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-white">Claim Discount Voucher Now !</h2>
          <DiscountsList />
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Highlighted Product Deals
          </h2>
          <DiscountProductsContainer />
        </section>
      </div>
    </main>
  );
}
