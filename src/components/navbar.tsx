"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, X } from "lucide-react";
import { useSearch } from "@/components/searchContext";
import { productService } from "@/components/hooks/useProductAdmin";
import { Product as ProductType } from "@/types/product-types";
import debounce from 'lodash/debounce';

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

interface Product extends ProductType {
  highlightedName?: React.ReactNode;
}

interface ModalState {
  isSearchOpen: boolean;
  isCartOpen: boolean;
}

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setSearchTerm } = useSearch();
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 1) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const products = await productService.getProducts();
      const filtered = products
        .filter(product => {
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
    setModalState(prev => ({ ...prev, isSearchOpen: isOpen }));
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const toggleCart = (isOpen: boolean) => 
    setModalState(prev => ({ ...prev, isCartOpen: isOpen }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalState(prev => ({ ...prev, isSearchOpen: false, isCartOpen: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const memoizedSearchResults = useMemo(() => 
    searchResults.map((product) => {
      const slug = generateSlug(product.name);
      return (
        <Link
          key={product.product_id}
          href={`/products/slug/${slug}`}
          className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
          onClick={() => toggleSearch(false)}
        >
          <div className="relative w-12 h-12 mr-3">
            <Image
              src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover rounded"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = "/product-placeholder.jpg";
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {product.highlightedName || product.name}
            </h3>
            <p className="text-sm text-gray-500">
              Rp.{product.price.toLocaleString()}
            </p>
          </div>
        </Link>
      );
    }),
    [searchResults]
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-40 ${className ?? ''}`}>
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
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="hover:text-gray-300 transition-colors">
                  Products
                </Link>
                <Link href="/gadgets" className="hover:text-gray-300 transition-colors">
                  Gadgets
                </Link>
                <Link href="/deals" className="hover:text-gray-300 transition-colors">
                  Deals
                </Link>
                <Link href="/login" className="hover:text-gray-300 transition-colors">
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

      {/* Search Modal */}
      {modalState.isSearchOpen && (
        <div 
          ref={modalRef}
          role="dialog"
          aria-label="Search products"
          className="fixed inset-x-0 top-0 z-50 bg-gray-100/95 mx-auto mt-20 rounded-lg shadow-lg max-w-2xl transition-all transform"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Search Products</h2>
              <button 
                onClick={() => toggleSearch(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="search"
                role="searchbox"
                aria-label="Search products"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                onChange={handleSearchInput}
              />
              {isLoading ? (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
                </div>
              ) : (
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              )}

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {memoizedSearchResults}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {modalState.isCartOpen && (
        <div 
          ref={modalRef}
          role="dialog"
          aria-label="Shopping cart"
          className="fixed inset-y-0 right-0 z-50 h-full w-96 bg-white shadow-lg transition-transform"
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <button 
                onClick={() => toggleCart(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-6">
              <p className="text-gray-500 text-center mt-8">Your cart is empty</p>
            </div>

            <div className="mt-auto border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">$0.00</span>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}