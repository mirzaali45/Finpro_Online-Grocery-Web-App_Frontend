// components/navbar-comp/NavbarLink.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Swal from "sweetalert2";
import ProfileServices from "@/services/profile/services1";
import { usePathname } from "next/navigation";

interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

interface NavLinksProps {
  className?: string;
  isMobile?: boolean;
}

// Define icon props type
interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  [key: string]: any;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  className = "",
  isMobile = false,
}) => {
  const [isCustomer, setIsCustomer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { profile } = ProfileServices();
  const pathname = usePathname();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      background: "#1a1a1a",
      color: "#fff",
      heightAuto: false,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("is_login");
      localStorage.removeItem("user_id");
      localStorage.removeItem("exp_token");

      await Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.assign("/login-user-customer");
    }
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: (props: IconProps) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      name: "Products",
      path: "/products",
      icon: (props: IconProps) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      name: "About Us",
      path: "/about",
      icon: (props: IconProps) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
    },
    {
      name: "Deals",
      path: "/deals",
      icon: (props: IconProps) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M2 9c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
          <path d="m15 5-2-3H9L7 5" />
          <path d="M13 14v-4" />
          <path d="M7 12h.01" />
          <path d="M17 12h.01" />
        </svg>
      ),
    },
    ...(profile &&
    profile.userId &&
    profile.verified &&
    profile.password_reset_token === null
      ? [
          { name: "Profile", path: "/profile", icon: User },
          {
            name: "Logout",
            icon: LogOut,
            onClick: handleLogout,
            isLogout: true,
          },
        ]
      : [
          {
            name: "Login",
            path: "/login-user-customer",
            icon: (props: IconProps) => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...props}
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
        ]),
  ];

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const lineVariants = {
    initial: { width: "0%" },
    hover: { width: "100%", transition: { duration: 0.3 } },
  };

  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div
      className={`${className} ${
        isMobile ? "w-full py-2" : "flex flex-row items-center space-x-6"
      }`}
    >
      {navigationItems.map((item, index) => {
        const active = item.path ? isActive(item.path) : false;

        return (
          <div
            key={item.name}
            className={`
              ${
                isMobile
                  ? "w-full py-3 px-2 hover:bg-neutral-800/50 rounded transition-colors"
                  : "relative"
              }
            `}
          >
            {item.onClick ? (
              <motion.button
                onClick={item.onClick}
                whileTap={{ scale: 0.97 }}
                className={`
                  flex items-center gap-2 w-full
                  ${isMobile ? "justify-start" : "justify-center"}
                  ${
                    item.isLogout
                      ? `${
                          isMobile
                            ? "text-rose-500"
                            : "px-4 py-1.5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-lg border border-rose-500/20 hover:from-rose-500/30 hover:to-purple-500/30"
                        }`
                      : ""
                  }
                `}
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`
                    flex items-center gap-2 font-medium
                    ${
                      item.isLogout
                        ? "text-rose-500 hover:text-rose-400"
                        : "text-neutral-400 hover:text-neutral-200"
                    }
                  `}
                >
                  {item.icon && (
                    <item.icon
                      className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`}
                    />
                  )}
                  <span
                    className={`${
                      isMobile ? "text-lg" : "text-base font-medium"
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </motion.button>
            ) : (
              <Link
                href={item.path}
                className={`
                  relative group flex items-center gap-2 w-full
                  ${isMobile ? "justify-start" : "justify-center"}
                `}
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`
                    flex items-center gap-2 font-medium transition-colors
                    ${
                      active
                        ? "text-white"
                        : "text-neutral-400 hover:text-neutral-200"
                    }
                  `}
                >
                  {item.icon && (
                    <item.icon
                      className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`}
                    />
                  )}
                  <span
                    className={`${
                      isMobile ? "text-lg" : "text-base font-medium"
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>

                {!isMobile && (
                  <motion.div
                    variants={lineVariants}
                    initial="initial"
                    animate={active ? "hover" : "initial"}
                    whileHover="hover"
                    className={`
                      absolute -bottom-1 left-0 h-0.5 rounded-full
                      ${
                        active
                          ? "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                          : "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 opacity-80"
                      }
                    `}
                  />
                )}

                {isMobile && active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-500" />
                )}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
