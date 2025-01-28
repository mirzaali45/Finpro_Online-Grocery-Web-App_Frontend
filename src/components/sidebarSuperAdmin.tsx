"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  LogOut,
  StoreIcon,
  X,
  FolderKanban,
  Boxes,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard-superAdmin",
      active: true,
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
          router.push("/login-super-admin");
        } catch (error) {
          console.error("Logout failed:", error); // Using the error variable
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
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 bg-white border-r border-gray-200 w-64`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                link.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              <span>{link.title}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
