"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { useEffect } from "react";

export default function NavbarWrapper() {
  const pathname = usePathname();
  useEffect(() => {
    const checkAndResetLocalStorageEveryDay = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      
      console.log('now going in new version web application')

      const lastReset = localStorage.getItem("last_reset_date");
      // console.log(today)
      if (lastReset !== today || !localStorage.getItem('first_new_update2')) {
        console.log("Resetting localStorage for a new day...");
        localStorage.clear();
        localStorage.removeItem('first_new_update')
        localStorage.setItem('first_new_update2', "true")
        localStorage.setItem("last_reset_date", today); // Simpan tanggal reset terbaru
      }
    };

    checkAndResetLocalStorageEveryDay()
  })

  // Untuk misahin navbar customer dan promotor
  const noNavbarRoutes = [
    "/dashboard-superAdmin",
    "/dashboard-superAdmin/store/create-store",
    "/dashboard-superAdmin/store",
    "/dashboard-superAdmin/user",
    "/dashboard-superAdmin/categories",
    "/dashboard-superAdmin/product",
    "/dashboard-superAdmin/inventory",
    "/dashboard-storeAdmin",
  ];

  return noNavbarRoutes.includes(pathname) ? null : <Navbar />;
}
