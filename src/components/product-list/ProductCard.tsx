import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product-types";
import { generateSlug } from "@/utils/slugUtils";
import { addToCart } from "@/services/cart.service";

interface ProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

export function ProductCard({ product, onCartUpdate }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(product.product_id, 1);
      onCartUpdate?.();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content container */}
      <div className="relative p-4">
        {/* Image container */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/10 z-10" />
          <Image
            src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transform transition-all duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product details */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            {product.name}
          </h3>

          <p className="text-sm text-neutral-400 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          {/* Price */}
          <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 mb-4">
            Rp.{product.price.toLocaleString()}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* See More Button */}
            <Link
              href={`/products/${generateSlug(product.name)}`}
              className="relative group/btn flex-1"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 rounded-lg leading-none">
                <span className="text-sm text-neutral-300">Details</span>
                <svg
                  className="w-4 h-4 stroke-neutral-300 transform transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="relative group/btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 rounded-lg leading-none">
                <span className="text-sm text-neutral-300">
                  {isLoading ? "Adding..." : "Add to Cart"}
                </span>
                <svg
                  className="w-4 h-4 stroke-neutral-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
