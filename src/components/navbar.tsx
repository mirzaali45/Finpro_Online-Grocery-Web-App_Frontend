"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X } from "lucide-react";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Text */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/hp.png"
                  alt="TechElite Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
                <span className="text-xl font-bold">TechElite</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="hover:text-gray-300 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="hover:text-gray-300 transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/gadgets"
                  className="hover:text-gray-300 transition-colors"
                >
                  Gadgets
                </Link>
                <Link
                  href="/deals"
                  className="hover:text-gray-300 transition-colors"
                >
                  Deals
                </Link>
                <Link
                  href="/Login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <button
                className="hover:text-gray-300 transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>
              <button
                className="hover:text-gray-300 transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-gray-100/95 mx-auto mt-20 rounded-lg shadow-lg max-w-2xl transition-transform duration-300 transform ${
            isSearchOpen ? "translate-y-0" : "-translate-y-10"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Products
              </h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                autoFocus
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <div
        className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-96 bg-white shadow-lg">
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-6">
              <p className="text-gray-500 text-center mt-8">
                Your cart is empty
              </p>
            </div>

            <div className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
