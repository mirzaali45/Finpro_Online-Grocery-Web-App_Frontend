import { TiShoppingCart } from "react-icons/ti";
import React from "react";

type NavbarProps = {
  cartCount: number;
};

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">ShopNow</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-800 transition">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition">
            Shop
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition">
            Contact
          </a>
        </div>

        {/* Cart Icon */}
        <div className="relative">
          <TiShoppingCart size={28} className="text-gray-800" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
