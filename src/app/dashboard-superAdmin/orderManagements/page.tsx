// app/dashboard-superAdmin/store/page.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import untuk OrderManagements agar di-render hanya di client-side
const DynamicOrderManagements = dynamic(
  () => import("@/app/dashboard-superAdmin/orderManagements/Orders"),
  {
    ssr: false, // Disable server-side rendering untuk komponen ini
  }
);

export default function OrderManagementsPage() {
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link
            href="/dashboard-superAdmin"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2">›</span>
          <span className="text-blue-600">Order Managements</span>
        </div>
      </div>

      <DynamicOrderManagements />
    </>
  );
}
