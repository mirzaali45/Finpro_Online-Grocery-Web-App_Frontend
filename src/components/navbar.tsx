"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { productService } from "@/services/product.service";
import debounce from "lodash/debounce";
import { NavbarProps, ModalState, Product } from "@/types/product-types";
import { SearchModal } from "@/components/navbar-comp/SearchModal";
import { CartModal } from "@/components/navbar-comp/CartModal";
import { generateSlug } from "../utils/slugUtils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ className }: NavbarProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false,
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const products = await productService.getProducts();
      const filtered = products
        .filter((product) => {
          const name = product.name.toLowerCase();
          const searchTerm = term.toLowerCase();
          if (name.includes(searchTerm)) {
            const index = name.indexOf(searchTerm);
            product.slug = generateSlug(product.name);
            product.highlightedName = (
              <>
                {name.slice(0, index)}
                <span className="bg-yellow-200 text-black">
                  {name.slice(index, index + searchTerm.length)}
                </span>
                {name.slice(index + searchTerm.length)}
              </>
            );
            return true;
          }
          return false;
        })
        .slice(0, 5);
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      handleSearch(term);
    }, 300),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const toggleSearch = (isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, isSearchOpen: isOpen }));
  };

  const toggleCart = (isOpen: boolean) =>
    setModalState((prev) => ({ ...prev, isCartOpen: isOpen }));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalState((prev) => ({
          ...prev,
          isSearchOpen: false,
          isCartOpen: false,
        }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const navVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px -10px rgba(255,255,255,0.1)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.nav
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navVariants}
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
              fixed top-0 left-0 right-0 z-40 
              ${className ?? ""}
            `}
          >
            {/* Animated Gradient Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[1px] w-full origin-left bg-gradient-to-r from-rose-500/50 via-purple-500/50 to-blue-500/50"
            />

            {/* Navbar content with enhanced glass effect */}
            <div className="relative">
              {/* Animated Background Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.2 : 0.1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 blur-2xl"
              />

              {/* Glass Background */}
              <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-lg" />

              <div className="relative max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                  {/* Logo section with hover effect */}
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="flex items-center gap-3 group"
                      aria-label="Home"
                    >
                      <motion.div
                        whileHover={{
                          rotate: [0, -5, 5, 0],
                          scale: 1.1,
                          transition: { duration: 0.4 },
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src="/hp.png"
                          alt="TechElite Logo"
                          width={40}
                          height={40}
                          className="relative object-contain"
                          priority
                        />
                      </motion.div>
                      <motion.span
                        whileHover={{
                          background:
                            "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                          backgroundClip: "text",
                          color: "transparent",
                          transition: { duration: 0.3 },
                        }}
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400"
                      >
                        TechElite
                      </motion.span>
                    </Link>
                  </div>

                  {/* Navigation links with interactive effects */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-8">
                      {["Home", "Products", "Gadgets", "Deals", "Login"].map(
                        (item) => (
                          <Link
                            key={item}
                            href={
                              item === "Home" ? "/" : `/${item.toLowerCase()}`
                            }
                            className="relative group"
                          >
                            <motion.span
                              whileHover={{
                                scale: 1.05,
                                background:
                                  "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                                backgroundClip: "text",
                                color: "transparent",
                                transition: { duration: 0.3 },
                              }}
                              className="text-neutral-400 hover:text-neutral-200 transition-colors"
                            >
                              {item}
                            </motion.span>
                            <motion.span
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                              className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                            />
                          </Link>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action buttons with interactive hover */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        color: "#3b82f6", // blue-500
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => toggleSearch(true)}
                      className="relative group p-2 rounded-lg"
                      aria-label="Open search"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-blue-500/0 group-hover:from-rose-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300" />
                      <Search className="relative w-5 h-5 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
                    </motion.button>

                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        color: "#f43f5e", // rose-500
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => toggleCart(true)}
                      className="relative group p-2 rounded-lg"
                      aria-label="Open cart"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-blue-500/0 group-hover:from-rose-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300" />
                      <ShoppingCart className="relative w-5 h-5 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div ref={modalRef}>
        <SearchModal
          isOpen={modalState.isSearchOpen}
          onClose={() => toggleSearch(false)}
          onSearch={handleSearchInput}
          isLoading={isLoading}
          searchResults={searchResults}
        />
        <CartModal
          isOpen={modalState.isCartOpen}
          onClose={() => toggleCart(false)}
        />
      </div>
    </>
  );
}
