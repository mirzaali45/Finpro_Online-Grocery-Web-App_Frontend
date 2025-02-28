"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import {
  LayoutDashboard,
  ShoppingBag,
  PercentDiamond,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard-storeAdmin",
    },
    {
      title: "Discount Management",
      icon: <PercentDiamond size={20} />,
      href: "/dashboard-storeAdmin/discount",
    },
    {
      title: "Reports",
      icon: <BarChart3 size={20} />,
      href: "/dashboard-storeAdmin/reports",
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AuthService.logout();
          Swal.fire({
            title: "Logged Out!",
            text: "Successfully logged out",
            icon: "success",
            timer: 1500,
          });
          router.push("/login-store-admin");
        } catch (error) {
          console.error("Logout failed:", error);
          Swal.fire({
            title: "Error!",
            text: error instanceof Error ? error.message : "Failed to logout",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-white border-r shadow-lg
        transition-all duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-64
        w-[280px]
      `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b bg-white">
          <Link
            href="/dashboard-storeAdmin"
            className="flex items-center space-x-2"
          >
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Store Admin</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4 bg-gray-50">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard-storeAdmin/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg
                  text-red-600 hover:bg-red-50 hover:text-red-700
                  transition-all duration-200 group"
              >
                <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
