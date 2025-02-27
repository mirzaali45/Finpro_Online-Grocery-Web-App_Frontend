"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { productService } from "@/services/product.service";
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
    <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden"
            >
              {/* Glass background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative p-6">
                <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
                  {product.ProductImage?.[0]?.url && (
                    <Image
                      src={product.ProductImage[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-neutral-100 tracking-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                      {formatRupiah(product.price)}
                    </span>

                    <button className="relative px-4 py-2 group/button">
                      {/* Button gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/80 via-purple-500/80 to-blue-500/80 rounded-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />

                      {/* Button base style */}
                      <div className="relative px-4 py-2 bg-neutral-800 rounded-lg group-hover/button:bg-transparent transition-colors duration-300">
                        <span className="text-sm font-medium text-neutral-100">
                          Add to Cart
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
