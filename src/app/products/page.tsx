"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product-types";
import { productService } from "@/services/product.service";
import { ProductList } from "@/components/product-list/ProductList";
import { Pagination } from "@/components/product-list/Pagination";
import ToastContainerElement from "@/components/ToastContainerElement";

export default function ProductPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            {/* Loading animation */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-neutral-700 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-neutral-600 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-neutral-500 animate-spin-slower"></div>
            </div>
            <p className="text-lg text-neutral-400 animate-pulse">
              Loading Products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 animate-gradient-x"></div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
              Discover Our Collection
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Explore our carefully curated selection of premium products
              designed to elevate your lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
              Our Products
            </h2>
            <p className="text-neutral-500">
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, products.length)} of{" "}
              {products.length} products
            </p>
          </div>

          {/* Add any filters or sorting options here */}
        </div>

        {/* Product Grid */}
        <div className="relative">
          {/* Grid background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/0 to-neutral-900/50 pointer-events-none"></div>

          <ProductList products={currentProducts} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="relative">
              {/* Pagination glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 blur-lg rounded-full opacity-50"></div>

              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            transform: translateX(-50%);
          }
          50% {
            transform: translateX(50%);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-spin-slower {
          animation: spin 4s linear infinite;
        }
      `}</style>
      <ToastContainerElement />
    </div>
  );
}
