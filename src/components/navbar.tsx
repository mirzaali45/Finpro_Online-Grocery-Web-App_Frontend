"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [setIsSearchOpen] = useState(false);
  const [setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('')

  function decodeToken(token) {
    const [header, payload] = token.split('.').slice(0, 2);
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
    };
  }
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isLogin = localStorage.getItem("is_login");
      setIsLoggedIn(!!(token && isLogin));
    }
    
    if (localStorage.getItem("is_login") && localStorage.getItem("token")) {
      const decoded = decodeToken(localStorage.getItem('token'));
      setRole(decoded.payload.role);
    }
  }, []);

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
                <span className="text-xl font-bold">
                  Tech<span className="text-sky-400">Elite</span>
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className={`hover:text-white transition-colors ${
                    pathname === "/"
                      ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                      : "text-gray-300"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`hover:text-white transition-colors ${
                    pathname === "/products"
                      ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                      : "text-gray-300"
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/deals"
                  className={`hover:text-white transition-colors ${
                    pathname === "/deals"
                      ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                      : "text-gray-300"
                  }`}
                >
                  Deals
                </Link>
                <Link
                  href="/login-user-customer"
                  className={`hover:text-white ${!isLoggedIn ? "flex" : "hidden"} transition-colors ${
                    pathname === "/login-user-customer"
                      ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                      : "text-gray-300"
                  }`}
                >
                  Login
                </Link>
                {isLoggedIn && (role && role === "customer")  ? (
                    <Link
                      href="/profile"
                      className={`hover:text-white transition-colors ${
                        pathname === "/profile"
                          ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                          : "text-gray-300"
                      }`}
                    >
                      Profile
                    </Link>
                ) : isLoggedIn && (role && role === "store_admin") ? (
                    <Link
                      href="/dashboard-storeAdmin"
                      className={`hover:text-white transition-colors ${
                        pathname === "/dashboard"
                          ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                          : "text-gray-300"
                      }`}
                    >
                      Dashboard
                    </Link>
                  ) : isLoggedIn && (role && role === "super_admin") ? (
                    <Link
                      href="/dashboard-superAdmin"
                      className={`hover:text-white transition-colors ${
                        pathname === "/dashboard"
                          ? "text-white bg-gray-800 py-2 px-4 rounded-md"
                          : "text-gray-300"
                      }`}
                    >
                      Dashboard
                    </Link>
                  ) : ""}
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
    </>
  );
}
