"use client";

import React from "react";
import UserManagement from "@/components/user-management/UserManagement";
import Sidebar from "@/components/sidebarSuperAdmin";
import { useState } from "react";

export default function UserAdmin() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
           <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
      <main className="container mx-auto p-6">
        <UserManagement />
      </main>
    </div>
  );
}
