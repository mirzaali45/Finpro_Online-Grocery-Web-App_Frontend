"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { productService } from "@/services/product.service";
import debounce from "lodash/debounce";
import { NavbarProps, ModalState, Product, } from "@/types/product-types";
import { SearchModal } from "@/components/navbar-comp/SearchModal";
import { CartModal } from "@/components/navbar-comp/CartModal";
import { generateSlug } from "../utils/slugUtils";
import { motion, AnimatePresence } from "framer-motion";
import { NavLogo } from "./navbar-comp/NavbarLogo";
import { NavLinks } from "./navbar-comp/NavbarLink";
import { ActionButtons } from "./navbar-comp/ActionButton";
import { Menu, X } from "lucide-react"; // Icon untuk mobile menu


export default function Navbar({ className }: NavbarProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false,
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mobile menu
  const modalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
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
        setIsMenuOpen(false); // Tutup menu saat klik di luar
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
    hidden: { opacity: 0, y: -100, transition: { duration: 0.5 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, boxShadow: "0 10px 30px -10px rgba(255,255,255,0.1)" },
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
            className={`fixed top-0 left-0 right-0 z-50 ${className ?? ""}`}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[1px] w-full origin-left bg-gradient-to-r from-rose-500/50 via-purple-500/50 to-blue-500/50"
            />
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.2 : 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 blur-2xl"
              />
              <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-lg" />

              <div className="relative max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                  <NavLogo />
                  {/* Mobile Menu Toggle */}
                  <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                    </button>
                  </div>
                  {/* Links hanya muncul di layar lg ke atas */}
                  <div className="hidden lg:flex">
                    <NavLinks />
                  </div>
                  <ActionButtons toggleSearch={toggleSearch} toggleCart={toggleCart} />
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-16 left-0 w-full bg-neutral-900/95 backdrop-blur-lg p-4 flex flex-col gap-3 items-center lg:hidden"
                >
                  <NavLinks />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      <div ref={modalRef}>
        <SearchModal isOpen={modalState.isSearchOpen} onClose={() => toggleSearch(false)} onSearch={handleSearchInput} isLoading={isLoading} searchResults={searchResults} />
        <CartModal isOpen={modalState.isCartOpen} onClose={() => toggleCart(false)} />
      </div>
    </>
  );
}