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
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700">
      <div className="relative h-48">
        <Image
          src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-200">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-200">
            Rp.{product.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/products/${generateSlug(product.name)}`}
              className="bg-indigo-600 text-gray-100 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              See More
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-indigo-600 text-gray-100 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
