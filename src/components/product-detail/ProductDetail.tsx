"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product-types";
import { addToCart } from "@/services/cart.service";
import { toast } from "react-toastify";
import { ShoppingCart, Store, Clock, Tag } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  onCartUpdate?: () => void;
}

const RichTextContent = ({ content }: { content: string }) => {
  return (
    <div
      className="prose prose-invert prose-neutral max-w-none [&>*]:text-white [&_ul]:text-white [&_li]:text-white"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default function ProductDetailClient({
  product,
  onCartUpdate,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDiscountValid, setIsDiscountValid] = useState(false);
  const [actualDiscount, setActualDiscount] = useState<any>(null);

  // Check discount validity and format discount data
  useEffect(() => {
    if (!product.Discount || product.Discount.length === 0) {
      setIsDiscountValid(false);
      setActualDiscount(null);
      return;
    }

    // Get the discount from the array
    const discountData = product.Discount[0];
    console.log("Raw discount data:", discountData);

    // Check if discount has expired
    const isValid = () => {
      if (!discountData.expires_at) return false;
      const expiryDate = new Date(discountData.expires_at);
      const currentDate = new Date();
      return expiryDate > currentDate;
    };

    // Format the discount type correctly
    const formatDiscount = () => {
      // First make a copy to avoid mutation issues
      const formattedDiscount = { ...discountData };

      // Ensure discount_type is the correct enum value
      const discountTypeStr = String(
        formattedDiscount.discount_type
      ).toLowerCase();
      // Ensure it's one of the valid enum values
      formattedDiscount.discount_type =
        discountTypeStr === "percentage" ? "percentage" : "point";

      // Log what we're working with
      console.log("Formatted discount:", {
        type: formattedDiscount.discount_type,
        value: formattedDiscount.discount_value,
        expiresAt: formattedDiscount.expires_at,
      });

      return formattedDiscount;
    };

    const valid = isValid();
    setIsDiscountValid(valid);

    if (valid) {
      setActualDiscount(formatDiscount());
    } else {
      setActualDiscount(null);
    }
  }, [product.Discount]);

  const calculateDiscountedPrice = () => {
    if (!isDiscountValid || !actualDiscount) {
      return product.price;
    }

    const discountType = actualDiscount.discount_type.toLowerCase();
    const discountValue = Number(actualDiscount.discount_value);

    if (discountType === "percentage") {
      // Cap at 100% discount
      const cappedValue = Math.min(discountValue, 100);
      return Math.round(product.price - (product.price * cappedValue) / 100);
    } else if (discountType === "point") {
      return Math.max(0, product.price - discountValue); // Ensure price doesn't go below 0
    } else {
      return product.price; // Fallback to original price if type is unknown
    }
  };

  const getDiscountLabel = () => {
    if (!isDiscountValid || !actualDiscount) {
      return "";
    }

    const discountType = actualDiscount.discount_type.toLowerCase();
    const discountValue = Number(actualDiscount.discount_value);

    if (discountType === "percentage") {
      // Cap at 100% for display
      const cappedValue = Math.min(discountValue, 100);
      return `${cappedValue}% OFF`;
    } else if (discountType === "point") {
      return `Rp${discountValue.toLocaleString()} OFF`;
    } else {
      return ""; // Return empty string for unknown discount types
    }
  };

  // Format expiry date for discount if available
  const formatExpiryDate = () => {
    if (!isDiscountValid || !actualDiscount || !actualDiscount.expires_at) {
      return null;
    }

    const expiryDate = new Date(actualDiscount.expires_at);
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
    if (!isDiscountValid || !actualDiscount || !actualDiscount.expires_at) {
      return false;
    }

    const expiryDate = new Date(actualDiscount.expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const userId = localStorage.getItem("userId") || "";
      await addToCart(product.product_id, 1, userId);
      toast.success(`${product.name} added to cart successfully`);
      onCartUpdate?.();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="space-y-6">
        <div className="relative aspect-square rounded-xl overflow-hidden group">
          {/* Discount badge */}
          {isDiscountValid && actualDiscount && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-lg shadow-lg">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-bold">{getDiscountLabel()}</span>
              </div>
            </div>
          )}

          {/* Expiry badge */}
          {isDiscountValid && formatExpiryDate() && (
            <div className="absolute top-4 right-4 z-20">
              <div
                className={`px-3 py-1.5 ${
                  isExpiringSoon() ? "bg-red-600/90" : "bg-amber-600/80"
                } text-white text-sm rounded-lg shadow-lg flex items-center gap-1`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatExpiryDate()}</span>
              </div>
            </div>
          )}

          <Image
            src={
              product.ProductImage?.[selectedImage]?.url ||
              "/product-placeholder.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/product-placeholder.jpg";
            }}
          />
        </div>

        {/* Thumbnail Gallery */}
        {product.ProductImage && product.ProductImage.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
            {product.ProductImage.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setSelectedImage(index)}
                className="relative group"
              >
                <div
                  className={`relative w-20 h-20 rounded-lg overflow-hidden transition-transform duration-300 ${
                    selectedImage === index
                      ? "ring-2 ring-purple-500 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="inline-block">
              <div className="relative px-4 py-1.5 rounded-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 opacity-75" />
                <span className="relative text-sm font-medium text-white">
                  {product.category.category_name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Store className="w-4 h-4" />
              <span>{product.store.store_name}</span>
            </div>
          </div>
        </div>

        <div className="text-white text-lg leading-relaxed">
          <RichTextContent content={product.description} />
        </div>

        <div className="space-y-4 py-6 border-y border-neutral-800">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Price</span>
            {isDiscountValid && actualDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium line-through text-neutral-500">
                  Rp{product.price.toLocaleString()}
                </span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                  Rp{calculateDiscountedPrice().toLocaleString()}
                </span>
                <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full mt-1">
                  {getDiscountLabel()}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                Rp{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Stock</span>
            <span className="text-neutral-200">
              {product.Inventory?.[0]?.total_qty || 0} units available
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={
              isAddingToCart || (product.Inventory?.[0]?.total_qty || 0) === 0
            }
            className="relative w-full group/btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
            <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 rounded-lg">
              <span className="text-neutral-200 font-medium">
                {isAddingToCart
                  ? "Adding to Cart..."
                  : (product.Inventory?.[0]?.total_qty || 0) === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </span>
              {!isAddingToCart &&
                (product.Inventory?.[0]?.total_qty || 0) > 0 && (
                  <ShoppingCart className="w-5 h-5 text-neutral-300" />
                )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
