"use client";

import { useState, useEffect } from "react";
import { UserManagementService } from "@/services/user-management.service";
import {
  PieChart,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import InventoryCharts from "@/components/super-reports/ChartReport";
import { InventoryReportService } from "@/services/reports-superadmin";
import { InventoryReportData } from "@/types/reports-superadmin-types";

export default function DashboardSuperAdmin() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStoreAdmin, setStoreAdmin] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [inventoryData, setInventoryData] = useState<InventoryReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all data in parallel for better performance
        const [allUsers, storeAdmins, customers, inventoryReport] = await Promise.all([
          UserManagementService.getAllUsers(),
          UserManagementService.getAllStoreAdmin(),
          UserManagementService.getAllCustomer(),
          InventoryReportService.getInventoryReport() // Add inventory report fetch
        ]);
        
        setTotalUsers(allUsers.length);
        setStoreAdmin(storeAdmins.length);
        setTotalCustomer(customers.length);
        setInventoryData(inventoryReport.data);
        
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchData();
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
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="loader-dominoes-container">
          <div className="loader-dominoes"></div>
          <p className="loading-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-red-50 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Failed to load dashboard data</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statistics.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Inventory Charts Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <InventoryCharts data={inventoryData} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </>
  );
}