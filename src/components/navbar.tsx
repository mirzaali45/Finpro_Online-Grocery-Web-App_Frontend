"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { useSearch } from "@/components/searchContext";
import { productService } from "@/services/product.service";
import debounce from "lodash/debounce";
import { NavbarProps, ModalState, Product } from "@/types/product-types";
import { SearchModal } from "@/components/navbar-comp/SearchModal";
import { CartModal } from "@/components/navbar-comp/CartModal";
import { generateSlug } from "../utils/slugUtils";

export default function Navbar({ className }: NavbarProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false,
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setSearchTerm } = useSearch();
  const modalRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-40 ${
          className ?? ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/hp.png"
                  alt="TechElite Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
                <span className="text-xl font-bold">TechElite</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="hover:text-gray-300 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="hover:text-gray-300 transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/gadgets"
                  className="hover:text-gray-300 transition-colors"
                >
                  Gadgets
                </Link>
                <Link
                  href="/deals"
                  className="hover:text-gray-300 transition-colors"
                >
                  Deals
                </Link>
                <Link
                  href="/login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleSearch(true)}
                className="hover:text-gray-300 transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => toggleCart(true)}
                className="hover:text-gray-300 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

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
