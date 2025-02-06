"use client";
import Link from "next/link";
import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import MiniCart from "./minicart";
import { useCart } from "../context/cartcontext";

const Navbar = () => {
  const { totalQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center relative">
      <Link href="/" className="text-2xl font-bold">
        ShopLogo
      </Link>

      <div className="flex items-center space-x-6">
        <Link href="/products" className="hover:text-gray-400">Shop</Link>
        <Link href="/about" className="hover:text-gray-400">About</Link>

        {/* 🔹 Container untuk Hover & Click */}
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* 🔹 Klik Ikon Cart untuk ke halaman "/cart" */}
          <Link href="/cart" className="relative">
            <TiShoppingCart className="w-8 h-8" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* 🔹 Mini Cart Dropdown */}
          {isOpen && <MiniCart isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
