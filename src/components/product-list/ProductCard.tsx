// ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "@/types/product-types";
import { generateSlug } from "@/utils/slugUtils";
import { addToCart } from "@/services/cart.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardSkeleton from "./ProductCartSkeleton";
import { toast, ToastOptions } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

const ProductCard = ({ product, onCartUpdate }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const images = product.ProductImage || [];
  const hasMultipleImages = images.length > 1;
  const showToast = (message: string, type: keyof typeof toast, onClose: any = null) => {
      toast.dismiss();
      (toast[type] as (content: string, options?: ToastOptions) => void)(message, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose,
      });
    };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(product.product_id, 1);
      onCartUpdate?.();
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      showToast(error.message, "error");
      router.push("/login-user-customer")
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-rotate images when hovered
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      const timer = setInterval(nextImage, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, hasMultipleImages]);

  if (!product) {
    return <ProductCardSkeleton />;
  }

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
          
          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-neutral-800/50 animate-pulse" />
          )}
          
          {/* Main Image */}
          <Image
            src={images[currentImageIndex]?.url || "/product-placeholder.jpg"}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            fill
            className={`object-cover transform transition-all duration-500 group-hover:scale-110 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
          />

          {/* Image Navigation Controls - Only show when hovered and has multiple images */}
          {hasMultipleImages && isHovered && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-20"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-20"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsImageLoading(true);
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentImageIndex === index
                        ? "bg-white w-3"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
};

export default ProductCard;