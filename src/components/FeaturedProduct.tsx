"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { productService } from "@/components/hooks/useProductAdmin";
import { Product } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";

export default function FeaturedProducts() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      const sortedProducts = data.sort((a, b) => b.price - a.price).slice(0, 4);
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-950 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center text-2xl font-bold mb-8 text-neutral-100">
          Featured Products
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 w-full">
                {product.ProductImage?.[0]?.url && (
                  <Image
                    src={product.ProductImage[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                )}
              </div>

              <div className="p-4 text-neutral-100">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-neutral-200">
                    {formatRupiah(product.price)}
                  </span>

                  <button className="bg-neutral-600 text-neutral-100 px-4 py-2 rounded hover:bg-neutral-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
