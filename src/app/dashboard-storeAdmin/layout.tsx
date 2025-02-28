"use client";

import StoreSideBar from "@/components/sidebarStoreAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
