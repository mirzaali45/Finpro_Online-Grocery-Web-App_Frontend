"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { productService } from "@/services/product.service";
import debounce from "lodash/debounce";
import { NavbarProps, ModalState, Product } from "@/types/product-types";
import { SearchModal } from "@/components/navbar-comp/SearchModal";
import { CartModal } from "@/components/navbar-comp/CartModal";
import { generateSlug } from "../utils/slugUtils";
import { motion, AnimatePresence } from "framer-motion";
import { NavLogo } from "./navbar-comp/NavbarLogo";
import { NavLinks } from "./navbar-comp/NavbarLink";
import { ActionButtons } from "./navbar-comp/ActionButton";
import { Menu, X } from "lucide-react";

export default function Navbar({ className }: NavbarProps) {
  // State management
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false,
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Search functionality
  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await productService.getProducts();
      const filtered = response.products
        .filter((product: Product) => {
          const name = product.name.toLowerCase();
          const searchTerm = term.toLowerCase();
          if (name.includes(searchTerm)) {
            const index = name.indexOf(searchTerm);
            product.slug = generateSlug(product.name);
            product.highlightedName = (
              <>
                {name.slice(0, index)}
                <span className="bg-yellow-200 text-black font-medium rounded px-1">
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

  // Modal toggles
  const toggleSearch = (isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, isSearchOpen: isOpen }));
    if (isOpen) setIsMenuOpen(false);
  };

  const toggleCart = (isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, isCartOpen: isOpen }));
    if (isOpen) setIsMenuOpen(false);
  };

  // Scroll and outside click handlers
  useEffect(() => {
    // Throttle the scroll handler to improve performance
    let isThrottled = false;

    const handleScroll = () => {
      if (isThrottled) return;
      isThrottled = true;

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Check if scrolled past threshold for styling (but don't re-render if unchanged)
        if (currentScrollY > 20 !== isScrolled) {
          setIsScrolled(currentScrollY > 20);
        }

        // Only hide on significant downward scroll, show immediately on upward scroll
        if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 100) {
          setIsNavbarVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          setIsNavbarVisible(true);
        }

        lastScrollY.current = currentScrollY;
        isThrottled = false;
      });
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
        setIsMenuOpen(false);
      }
    };

    // Handle ESC key press
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalState({ isSearchOpen: false, isCartOpen: false });
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              y: -100,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className={`fixed top-0 left-0 right-0 z-50 ${
              isScrolled
                ? "bg-neutral-900/90 backdrop-blur-lg shadow-lg"
                : "bg-neutral-900/80 backdrop-blur-md"
            } transition-all duration-300 ${className ?? ""}`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 relative">
              {/* Logo */}
              <NavLogo />

              {/* Mobile Menu Toggle */}
              <motion.button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? (
                      <X className="w-6 h-6 text-white" />
                    ) : (
                      <Menu className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Navbar Links (Desktop) */}
              <div className="hidden lg:flex items-center justify-center flex-1 px-4">
                <NavLinks className="flex flex-row items-center justify-center" />
              </div>

              {/* Action Buttons */}
              <ActionButtons
                toggleSearch={toggleSearch}
                toggleCart={toggleCart}
              />
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: { duration: 0.3 },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.2 },
                  }}
                  className="lg:hidden overflow-hidden bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800"
                >
                  <div className="max-w-6xl mx-auto px-4 py-4">
                    <NavLinks
                      className="flex flex-col space-y-1"
                      isMobile={true}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Modals */}
      <div ref={modalRef} className="z-50">
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
