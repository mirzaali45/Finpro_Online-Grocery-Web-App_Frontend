"use client";

import Sidebar from "@/components/sidebarSuperAdmin";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";
import { ReactNode, useState } from "react";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : ""}`}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mt-14 md:mt-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(SuperAdminLayout, {
  allowedRoles: ["super_admin"],
  redirectPath: "/not-authorized-superadmin", 
});