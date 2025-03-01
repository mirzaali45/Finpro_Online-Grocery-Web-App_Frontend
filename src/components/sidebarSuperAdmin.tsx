"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  LogOut,
  StoreIcon,
  X,
  Menu,
  FolderKanban,
  Boxes,
  PackageOpen,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSession } from "next-auth/react";
import ProfileServices from "@/services/profile/services1";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = ProfileServices();

  const [activeLink, setActiveLink] = useState(pathname);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard-superAdmin/",
    },
    {
      title: "My Store",
      icon: <StoreIcon className="h-5 w-5" />,
      href: "/dashboard-superAdmin/store",
    },
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard-superAdmin/user",
    },
    {
      title: "Categories",
      icon: <FolderKanban className="h-5 w-5" />,
      href: "/dashboard-superAdmin/categories",
    },
    {
      title: "Product",
      icon: <Boxes className="h-5 w-5" />,
      href: "/dashboard-superAdmin/product",
    },
    {
      title: "Inventory",
      icon: <PackageOpen className="h-5 w-5" />,
      href: "/dashboard-superAdmin/inventory",
    },
  ]?.filter((v: any) => v !== false);

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
          router.push("/login-super-admin");
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
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-full shadow-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mt-10 sm:mt-10 md:mt-10 lg:mt-0 xl:mt-0 2xl:mt-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                SA
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                Super Admin
              </h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400"
              aria-label="Close Sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarLinks.map((link: any) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  activeLink === link.href
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${
                    activeLink === link.href
                      ? "text-white transform -translate-x-1"
                      : "group-hover:transform group-hover:-translate-x-1"
                  }`}
                >
                  {link.icon}
                </div>
                <span className="font-medium">{link.title}</span>
                {activeLink === link.href && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 group"
            >
              <LogOut className="h-5 w-5 group-hover:animate-pulse" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
