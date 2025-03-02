"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { UserManagementService } from "@/services/user-management.service";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";

import {
  PieChart,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";

function DashboardSuperAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStoreAdmin, setStoreAdmin] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        setIsLoading(true);
        const users = await UserManagementService.getAllUsers();
        setTotalUsers(users.length);
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        console.error("Failed to load total users:", err);
      }
    };

    fetchTotalUsers();
  }, []);

  useEffect(() => {
    const fetchTotalStoreAdmin = async () => {
      try {
        setIsLoading(true);
        const users = await UserManagementService.getAllStoreAdmin();
        setStoreAdmin(users.length);
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        console.error("Failed to load store admins:", err);
      }
    };

    fetchTotalStoreAdmin();
  }, []);

  useEffect(() => {
    const fetchTotalCustomer = async () => {
      try {
        setIsLoading(true);
        const users = await UserManagementService.getAllCustomer();
        setTotalCustomer(users.length);
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        console.error("Failed to load customers:", err);
      }
    };

    fetchTotalCustomer();
  }, []);

  const statistics = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Store Admin",
      value: totalStoreAdmin.toLocaleString(),
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Total Customer",
      value: totalCustomer.toLocaleString(),
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Active Sessions",
      value: "89",
      icon: <PieChart className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="loader-dominoes-container">
          <div className="loader-dominoes"></div>
          <p className="loading-text">Loading Dashboard . . .</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className={`${isSidebarOpen ? "md:ml-64" : ""}`}>
        <main className="p-4 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 space-y-6">
          <h1 className="text-2xl mt-16 font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">No recent activity to display.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(DashboardSuperAdmin, {
  allowedRoles: ["super_admin"],
  redirectPath: "/not-authorized-superadmin",
});