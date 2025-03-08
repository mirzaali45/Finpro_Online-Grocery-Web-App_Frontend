"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";
import { generateSlug } from "@/utils/slugUtils";
import { useGeolocation } from "@/components/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distanceCalc";

export default function FeaturedProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<
    (Product & { distance?: number })[]
  >([]);
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Fetch products on component mount
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Sort products when user location is available
  useEffect(() => {
    if (location && products.length > 0) {
      const sorted = sortByDistance(
        products,
        location.latitude,
        location.longitude,
        (product) => ({
          lat: product.store.latitude,
          lon: product.store.longitude,
        })
      );

      setSortedProducts(sorted);
    } else {
      setSortedProducts(products);
    }
  }, [location, products]);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const featuredProducts = await productService.getFeaturedProducts();
      setProducts(featuredProducts);
      setSortedProducts(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (product: Product) => {
    if (!product.Discount || product.Discount.length === 0) {
      return product.price;
    }

    const discount = product.Discount[0];
    const discountType = String(discount.discount_type).toLowerCase();

    if (discountType === "percentage") {
      return Math.round(
        product.price - (product.price * discount.discount_value) / 100
      );
    } else {
      return product.price - discount.discount_value;
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-neutral-950 via-[#0c0c15] to-neutral-950 py-20 overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-3xl"></div>
          <div className="absolute -bottom-[400px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 rounded-full border-4 border-t-transparent border-purple-600 animate-spin mb-8"></div>
            <span className="inline-block text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 animate-pulse">
              Loading Premium Products...
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 via-[#0c0c15] to-neutral-950 py-20 overflow-hidden relative">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced heading with subtitle */}
        <div className="text-center mb-16">
          <h3 className="inline-block text-sm uppercase tracking-wider font-medium text-indigo-400 mb-4">
            Exclusive Collection
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
            Featured Products
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"></div>

          {location ? (
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Showing premium products from stores nearest to your location,
              curated for exceptional quality and value
            </p>
          ) : locationError ? (
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Showcasing our handpicked selection of premium products (location
              services unavailable)
            </p>
          ) : locationLoading ? (
            <div className="flex items-center justify-center mt-2">
              <span className="text-neutral-300">Finding stores near you</span>
              <span className="ml-3 flex space-x-1.5">
                <span className="animate-pulse h-2.5 w-2.5 bg-indigo-400 rounded-full"></span>
                <span
                  className="animate-pulse h-2.5 w-2.5 bg-purple-400 rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="animate-pulse h-2.5 w-2.5 bg-blue-400 rounded-full"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </div>
          ) : (
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Discover our exclusive selection of premium products, curated for
              exceptional quality and value
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <Link
              href={`/products/${generateSlug(product.name)}`}
              key={product.product_id}
              className="group relative h-[460px] rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02]"
            >
              {/* Enhanced glass background with depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/70 backdrop-blur-xl rounded-2xl border border-neutral-700/30 shadow-[0_0_40px_rgba(66,71,148,0.15)] transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(79,70,229,0.3)]"></div>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-purple-600/0 to-pink-600/0 opacity-0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>

              {/* Light effect */}
              <div className="absolute -inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(120,119,238,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Animated border */}
              <div className="absolute inset-[1px] rounded-2xl z-0 before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-transparent before:via-indigo-500/50 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-xl bg-neutral-900/90 rounded-2xl"></div>
              </div>

              {/* Content container */}
              <div className="relative h-full p-6 flex flex-col z-10">
                {/* Product tag */}
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-xs font-medium text-indigo-300">
                    Premium
                  </span>

                  {/* Show distance if available */}
                  {product.distance !== undefined && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-700/30 text-xs font-medium text-emerald-400">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {product.distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                {/* Product image with enhanced container */}
                <div className="relative h-52 w-full mb-6 rounded-xl overflow-hidden group-hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {product.ProductImage?.[0]?.url ? (
                    <Image
                      src={product.ProductImage[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                      <span className="text-neutral-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  {/* Product name */}
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-500 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Store name */}
                  <p className="text-sm text-neutral-400 group-hover:text-indigo-300 transition-all duration-500 mb-4 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6L13 6M13 6C13 8.20914 14.7909 10 17 10C19.2091 10 21 8.20914 21 6M13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6M21 6L21 16M21 16C18.7909 16 17 17.7909 17 20C17 22.2091 18.7909 24 21 24M21 16C21 13.7909 19.2091 12 17 12C14.7909 12 13 13.7909 13 16M13 16L3 16M13 16C13 18.2091 14.7909 20 17 20C17.7286 20 18.4117 19.7714 19 19.368"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {product.store.store_name}
                  </p>

                  {/* Price section */}
                  <div className="mt-auto">
                    {product.Discount && product.Discount.length > 0 ? (
                      <div className="flex flex-col mb-5">
                        <span className="text-sm line-through text-neutral-500">
                          {formatRupiah(product.price)}
                        </span>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                          {formatRupiah(calculateDiscountedPrice(product))}
                        </span>
                        <span className="text-xs px-2.5 py-1 bg-rose-500/20 text-rose-400 rounded-full mt-1.5 inline-block w-max">
                          {String(
                            product.Discount[0].discount_type
                          ).toLowerCase() === "percentage"
                            ? `${product.Discount[0].discount_value}% OFF`
                            : `${formatRupiah(
                                product.Discount[0].discount_value
                              )} OFF`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 mb-5 block">
                        {formatRupiah(product.price)}
                      </span>
                    )}

                    {/* Enhanced button */}
                    <div className="relative group/btn">
                      {/* Button background glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-75 group-hover/btn:opacity-100 transition duration-300 group-hover/btn:animate-pulse"></div>

                      {/* Button background */}
                      <div className="relative flex items-center justify-center gap-2 py-2.5 bg-neutral-900 rounded-lg leading-none border border-neutral-800 group-hover/btn:border-indigo-500/50 transition-all duration-300">
                        <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
                          View Details
                        </span>

                        {/* Arrow icon */}
                        <svg
                          className="w-4 h-4 stroke-indigo-400 transform translate-x-0 group-hover/btn:translate-x-0.5 transition-transform"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 12h15m0 0l-6-6m6 6l-6 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedProducts.length === 0 && !loading && (
          <div className="relative z-10 py-20 flex flex-col items-center">
            <svg
              className="w-20 h-20 text-neutral-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              ></path>
            </svg>
            <p className="text-center text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 to-neutral-600">
              No featured products available at the moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
