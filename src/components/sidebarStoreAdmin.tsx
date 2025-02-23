"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import {
  LayoutDashboard,
  ShoppingBag,
  PercentDiamond,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";

export default function StoreSideBar() {
  const pathname = usePathname();
  const router = useRouter();
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
    <div className="flex flex-col h-screen w-64 bg-white border-r fixed left-0">
      {/* Logo Section */}
      <div className="p-6 border-b">
        <Link
          href="/dashboard-storeAdmin"
          className="flex items-center space-x-2"
        >
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">Store Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard-storeAdmin/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 group"
            >
              <LogOut className="h-5 w-5 group-hover:animate-pulse" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
