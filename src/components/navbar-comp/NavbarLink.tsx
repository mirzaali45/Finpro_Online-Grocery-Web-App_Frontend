"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Menu, X } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Swal from "sweetalert2";

interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

export const NavLinks = () => {
  const [isCustomer, setIsCustomer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<CustomJwtPayload>(token);
          setIsCustomer(decoded?.role === "customer");
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsCustomer(false);
        }
      } else {
        setIsCustomer(false);
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);

    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      background: "#1a1a1a",
      color: "#fff",
      heightAuto: false,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("is_login");
      localStorage.removeItem("user_id");

      await Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.assign("/login-user-customer");
    }
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Brands", path: "/brands" },
    { name: "Deals", path: "/deals" },
    ...(isCustomer
      ? [
          { name: "Profile", path: "/profile", icon: User },
          {
            name: "Logout",
            icon: LogOut,
            onClick: handleLogout,
            isLogout: true,
          },
        ]
      : [{ name: "Login", path: "/login-user-customer" }]),
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (onClick?: () => void, path?: string) => {
    if (onClick) {
      onClick();
    }
    setMobileMenuOpen(false);

    // If a path is provided, navigate to that path
    if (path) {
      window.location.href = path;
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="flex items-center gap-8">
          {navigationItems.map((item) => (
            <React.Fragment key={item.name}>
              {item.onClick ? (
                <motion.button
                  onClick={item.onClick}
                  className={`relative group flex items-center gap-2 ${
                    item.isLogout
                      ? "px-4 py-1.5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-lg border border-rose-500/20 hover:from-rose-500/30 hover:to-purple-500/30"
                      : ""
                  }`}
                >
                  <motion.span
                    whileHover={{
                      scale: 1.05,
                      background: item.isLogout
                        ? "none"
                        : "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                      backgroundClip: item.isLogout ? "none" : "text",
                      color: item.isLogout ? "#f43f5e" : "transparent",
                      transition: { duration: 0.3 },
                    }}
                    className={`flex items-center gap-2 ${
                      item.isLogout
                        ? "text-rose-500 hover:text-rose-400"
                        : "text-neutral-400 hover:text-neutral-200"
                    } transition-colors`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </motion.span>
                  {!item.isLogout && (
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                    />
                  )}
                </motion.button>
              ) : (
                <Link
                  href={item.path}
                  className="relative group flex items-center gap-2"
                >
                  <motion.span
                    whileHover={{
                      scale: 1.05,
                      background:
                        "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                      backgroundClip: "text",
                      color: "transparent",
                      transition: { duration: 0.3 },
                    }}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </motion.span>
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                  />
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="block md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-neutral-200 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 pt-20"
          >
            {/* Gradient Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 blur-2xl"
            />

            {/* Background Layer */}
            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-lg" />

            <div
              className="relative container mx-auto px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-6">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.onClick ? (
                      <button
                        onClick={() => handleMobileNavClick(item.onClick)}
                        className={`w-full text-left py-4 px-2 border-b border-neutral-800 flex items-center justify-between ${
                          item.isLogout ? "text-rose-500" : "text-white"
                        }`}
                      >
                        <span className="flex items-center gap-3 text-lg">
                          {item.icon && <item.icon className="w-5 h-5" />}
                          {item.name}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleMobileNavClick(undefined, item.path)
                        }
                        className="block w-full text-left py-4 px-2 border-b border-neutral-800 text-white items-center justify-between"
                      >
                        <span className="flex items-center gap-3 text-lg">
                          {item.icon && <item.icon className="w-5 h-5" />}
                          {item.name}
                        </span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
