"use client";

import React from "react";
import UserManagement from "@/components/user-management/UserManagement";
import Sidebar from "@/components/sidebarSuperAdmin";
import { useState } from "react";
import HeaderSuperAdmin from "@/components/headerSuperAdmin";

export default function UserAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className={`${isSidebarOpen ? "" : ""}`}>
      <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      <HeaderSuperAdmin setIsSidebarOpen={setIsSidebarOpen} setIsProfileDropdownOpen={setIsProfileDropdownOpen} isProfileDropdownOpen={isProfileDropdownOpen} />
      <main className="container mx-auto">
        <UserManagement />
      </main>
      </div>
    </div>
  );
}
