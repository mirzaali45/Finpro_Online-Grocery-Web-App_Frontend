import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "@/types/product-types";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ExternalLink,
  Store,
  MapPin,
  Tag,
} from "lucide-react";
import { generateSlug } from "@/utils/slugUtils";
import { addToCart } from "@/services/cart.service";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product & { distance?: number };
  onCartUpdate?: () => void;
  showDistance?: boolean;
}

const ProductCard = ({
  product,
  onCartUpdate,
  showDistance = true,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscountValid, setIsDiscountValid] = useState(false);

  const images = product.ProductImage || [];
  const hasMultipleImages = images.length > 1;
  const inventory = product.Inventory?.[0]?.total_qty || 0;

  // Check if discount is valid (not expired)
  useEffect(() => {
    const checkDiscountValidity = () => {
      if (!product.Discount || !product.Discount.length) {
        setIsDiscountValid(false);
        return;
      }

      const discount = product.Discount[0];
      if (!discount || !discount.expires_at) {
        setIsDiscountValid(false);
        return;
      }

      const expiryDate = new Date(discount.expires_at);
      const currentDate = new Date();
      setIsDiscountValid(expiryDate > currentDate);
    };

    checkDiscountValidity();
  }, [product.Discount]);

  const handleAddToCart = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await addToCart(product.product_id, 1);
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      onCartUpdate?.();
    } catch (error) {
      // Handle specific error for authentication
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        toast.error("Please log in to add items to your cart", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to add product to cart", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }

      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageNavigation = (direction: "next" | "prev") => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => {
      if (direction === "next") return (prev + 1) % images.length;
      return (prev - 1 + images.length) % images.length;
    });
  };

  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      const timer = setInterval(() => handleImageNavigation("next"), 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, hasMultipleImages]);

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (!isDiscountValid || !product.Discount || !product.Discount.length) {
      return product.price;
    }

    const discount = product.Discount[0];
    if (discount.discount_type === "percentage") {
      const discountValue = Math.min(discount.discount_value, 100); // Cap at 100%
      return product.price - (product.price * discountValue) / 100;
    } else {
      return product.price - discount.discount_value;
    }
  };

  // Format expiry date for discount if available
  const formatExpiryDate = () => {
    if (!isDiscountValid || !product.Discount || !product.Discount.length) {
      return null;
    }

    const discount = product.Discount[0];
    if (!discount.expires_at) return null;

    const expiryDate = new Date(discount.expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) {
      return diffDays === 1 ? "Ends tomorrow" : `Ends in ${diffDays} days`;
    } else {
      return `Ends: ${expiryDate.toLocaleDateString()}`;
    }
  };

  // Check if expiry is soon (within 3 days)
  const isExpiringSoon = () => {
    if (!isDiscountValid || !product.Discount || !product.Discount.length) {
      return false;
    }

    const discount = product.Discount[0];
    if (!discount.expires_at) return false;

    const expiryDate = new Date(discount.expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const discountedPrice = getDiscountedPrice();

  return (
    <div
      className="group relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Discount badge */}
      {isDiscountValid && product.Discount && product.Discount.length > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-lg shadow-lg">
            <Tag className="w-3 h-3" />
            <span className="text-xs font-bold">
              {product.Discount[0].discount_type === "percentage"
                ? `${Math.min(product.Discount[0].discount_value, 100)}% OFF`
                : `Rp${product.Discount[0].discount_value.toLocaleString()}`}
            </span>
          </div>
        </div>
      )}

      {/* Expiry badge */}
      {isDiscountValid && formatExpiryDate() && (
        <div className="absolute top-3 right-3 z-20">
          <div
            className={`px-2 py-1 ${
              isExpiringSoon() ? "bg-red-600/90" : "bg-amber-600/80"
            } text-white text-xs rounded-lg shadow-lg`}
          >
            {formatExpiryDate()}
          </div>
        </div>
      )}

      <div className="relative p-4 space-y-4">
        <div className="relative h-52 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/10 z-10" />

          {isImageLoading && (
            <div className="absolute inset-0 bg-neutral-800/50 animate-pulse rounded-lg" />
          )}

          <Image
            src={images[currentImageIndex]?.url || "/product-placeholder.jpg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
          />

          {hasMultipleImages && isHovered && (
            <div className="absolute inset-0 flex items-center justify-between z-20 px-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleImageNavigation("prev");
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleImageNavigation("next");
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsImageLoading(true);
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImageIndex === index
                      ? "w-3 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-neutral-100 line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 group/store">
              <Store className="w-4 h-4 text-neutral-500 group-hover/store:text-neutral-300 transition-colors" />
              <p className="text-sm text-neutral-400 group-hover/store:text-neutral-300 transition-colors line-clamp-1">
                {product.store.store_name}
              </p>
              {showDistance && product.distance !== undefined && (
                <div className="flex items-center ml-auto">
                  <MapPin className="w-4 h-4 text-emerald-500 mr-1" />
                  <p className="text-sm text-emerald-400">
                    {product.distance.toFixed(1)} km
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {isDiscountValid &&
            product.Discount &&
            product.Discount.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium line-through text-neutral-500">
                    Rp{Math.trunc(product.price).toLocaleString()}
                  </span>
                  <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                    Rp{Math.trunc(discountedPrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full">
                    {product.Discount[0].discount_type === "percentage"
                      ? `${Math.min(
                          product.Discount[0].discount_value,
                          100
                        )}% OFF`
                      : `Rp${Math.trunc(
                          product.Discount[0].discount_value
                        ).toLocaleString()} OFF`}
                  </span>
                  <span className="text-sm text-neutral-400">
                    Stock: {inventory}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                  Rp{Math.trunc(product.price).toLocaleString()}
                </span>
                <span className="text-sm text-neutral-400">
                  Stock: {inventory}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${generateSlug(product.name)}`}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <span className="text-sm text-neutral-200">View Details</span>
              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || inventory === 0}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-sm text-neutral-200">
                {isLoading
                  ? "Adding..."
                  : inventory === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </span>
              <ShoppingCart className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
