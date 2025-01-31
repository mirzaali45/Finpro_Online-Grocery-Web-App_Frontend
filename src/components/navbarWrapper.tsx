"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Untuk misahin navbar customer dan promotor
  const noNavbarRoutes = [
    "/dashboard-superAdmin",
    "/dashboard-superAdmin/store/create-store",
    "/dashboard-superAdmin/store",
    "/dashboard-superAdmin/user",
    "/dashboard-superAdmin/categories",
    "/dashboard-superAdmin/product",
    "/dashboard-superAdmin/inventory"
  ];

  return noNavbarRoutes.includes(pathname) ? null : <Navbar />;
}
