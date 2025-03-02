"use client";

import React from "react";
import UserManagement from "@/components/user-management/UserManagement";

export default function UserAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto p-6">
        <UserManagement />
      </main>
      </div>
  );
}

