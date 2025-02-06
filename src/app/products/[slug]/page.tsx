"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Product } from "@/types/product-types";
import { productService } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductDetailProps {
  params: {
    slug: string;
  };
  onCartUpdate?: () => void;
}

export default function ProductDetail({
  params,
  onCartUpdate,
}: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(params.slug);
        if (!data) {
          notFound();
        }
        setProduct(data);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch product"
        );
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await addToCart(product.product_id, 1);
      toast.success("Product added to cart successfully"); // Updated toast
      onCartUpdate?.();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart"); // Updated toast
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square">
              <Image
                src={
                  product.ProductImage?.[selectedImage]?.url ||
                  "/product-placeholder.jpg"
                }
                alt={product.name}
                fill
                className="object-cover rounded-lg"
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
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.ProductImage.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden 
                      ${
                        selectedImage === index ? "ring-2 ring-indigo-500" : ""
                      }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="text-white flex flex-col">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm">
                {product.category.category_name}
              </span>
            </div>
            <p className="text-gray-300 mb-6">{product.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price</span>
                <span className="text-2xl font-bold">
                  Rp.{product.price.toLocaleString()}
                </span>
              </div>

              {product.store && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Store</span>
                  <span className="text-gray-100">
                    {product.store.store_name}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
