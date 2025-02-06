"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product-types";
import { productService } from "@/components/hooks/useProductAdmin";
import { useEffect, useState } from "react";

// Add generateSlug utility function
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

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
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-gray-200">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-20">
          <h2 className="text-2xl font-bold text-gray-200">Our Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700"
            >
              <div className="relative h-48">
                <Image
                  src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-200">
                    Rp.{product.price.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Link 
                      href={`/products/slug/${generateSlug(product.name)}`}
                      className="bg-indigo-600 text-gray-100 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      See More
                    </Link>
                    <button className="bg-indigo-600 text-gray-100 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  currentPage === pageNumber
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}