"use client";

import StoreSideBar from "@/components/sidebarStoreAdmin";
import { withAuth } from "@/components/high-ordered-component/AdminGuard"; // Import the HOC
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreSideBar />
      <div
        className="transition-all duration-300 
        p-4 
        sm:p-6 
        lg:p-8 
        lg:ml-64
        w-full
        overflow-x-hidden
      "
      >
        {children}
      </div>
    </div>
  );
}

export default withAuth(DashboardLayout, {
  allowedRoles: ["store_admin"],
  redirectPath: "/not-authorized-storeadmin", 
});

