'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebarSuperAdmin';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  PieChart,
  ShoppingCart,
  DollarSign,
  Users
} from 'lucide-react';

export default function DashboardSuperAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const statistics = [
    { 
      title: 'Total Users', 
      value: '1,234', 
      change: '+12%',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    { 
      title: 'Total Orders', 
      value: '456', 
      change: '+8%',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    { 
      title: 'Revenue', 
      value: '$12,345', 
      change: '+15%',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    { 
      title: 'Active Sessions', 
      value: '89', 
      change: '+5%',
      icon: <PieChart className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <Link
                      href="/"
                      className="block px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

          {/* Statistics Grid */}
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
                <div className="flex items-center">
                  <span className="text-green-500 text-sm font-medium">
                    {stat.change}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {/* Activity items would go here */}
                <p className="text-gray-600">No recent activity to display.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}