"use client"
import React from "react";
import { Store, Settings, Users, TrendingUp, AlertCircle } from "lucide-react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { useState } from "react";
import Link from "next/link";

interface Store {
  id: number;
  name: string;
  location: string;
  status: "active" | "maintenance" | "inactive";
  monthlyRevenue: number;
  totalProducts: number;
  activeUsers: number;
  lastUpdated: string;
}

export default function StoreDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const stores: Store[] = [
    {
      id: 1,
      name: "Downtown Electronics",
      location: "123 Main St, New York, NY",
      status: "active",
      monthlyRevenue: 45000,
      totalProducts: 1200,
      activeUsers: 850,
      lastUpdated: "2024-01-28",
    },
    {
      id: 2,
      name: "Tech Hub Central",
      location: "456 Tech Ave, San Francisco, CA",
      status: "active",
      monthlyRevenue: 38000,
      totalProducts: 950,
      activeUsers: 720,
      lastUpdated: "2024-01-27",
    },
    {
      id: 3,
      name: "Gadget World",
      location: "789 Innovation Blvd, Austin, TX",
      status: "maintenance",
      monthlyRevenue: 32000,
      totalProducts: 800,
      activeUsers: 650,
      lastUpdated: "2024-01-28",
    },
    {
      id: 4,
      name: "Digital Dreams",
      location: "321 Smart St, Seattle, WA",
      status: "active",
      monthlyRevenue: 41000,
      totalProducts: 1100,
      activeUsers: 780,
      lastUpdated: "2024-01-28",
    },
  ];

  function getStatusColor(status: Store["status"]): string {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Store Management
              </h1>
              <p className="text-gray-600">Overview of all your stores</p>
            </div>
            <Link href="/dashboard-superAdmin/store/create-store">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Store className="w-4 h-4" />
                Add New Store
              </button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{store.name}</h2>
                    <p className="text-gray-600 text-sm">{store.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      store.status
                    )} capitalize`}
                  >
                    {store.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Monthly Revenue
                      </span>
                    </div>
                    <p className="text-lg font-semibold">
                      ${store.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Products</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {store.totalProducts.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Active Users
                      </span>
                    </div>
                    <p className="text-lg font-semibold">
                      {store.activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                    </div>
                    <p className="text-lg font-semibold">
                      {new Date(store.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-6 pt-6 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Manage
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
