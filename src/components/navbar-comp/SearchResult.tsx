import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product-types";
import { generateSlug } from "@/utils/slugUtils";

interface SearchResultProps {
  product: Product;
  onClose: () => void;
}

export const SearchResult = ({ product, onClose }: SearchResultProps) => {
  const slug = generateSlug(product.name);

  return (
    <Link
      href={`/products/${slug}`}
      className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
      onClick={onClose}
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
};
