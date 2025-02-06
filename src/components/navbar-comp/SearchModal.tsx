import React, { useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/types/product-types";
import { SearchResult } from "./SearchResult";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  searchResults: Product[];
}

export const SearchModal = ({
  isOpen,
  onClose,
  onSearch,
  isLoading,
  searchResults,
}: SearchModalProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Search products"
      className="fixed inset-x-0 top-0 z-50 bg-gray-100/95 mx-auto mt-20 rounded-lg shadow-lg max-w-2xl transition-all transform"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Products
          </h2>
          <button
            onClick={onClose}
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
            onChange={onSearch}
          />
          {isLoading ? (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
            </div>
          ) : (
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={18}
            />
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <SearchResult
                  key={product.product_id}
                  product={product}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
