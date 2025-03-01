import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  fetchCartId,
  updateCartItem,
  removeFromCart,
} from "@/services/cart.service";
import { formatRupiah } from "@/helper/currencyRp";
import { CartModalProps, CartData } from "@/types/cart-types";
import ProfileServices from "@/services/profile/services1";
import { toast, ToastOptions } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Update your CartItem type in cart-types.ts to include Discount
// Add this to your product type:
interface ProductWithDiscount {
  product_id: string;
  name: string;
  price: number;
  ProductImage: { url: string }[];
  Discount?: {
    discount_id: number;
    discount_type: "point" | "percentage";
    discount_value: number;
    expires_at: string;
  }[];
}

// Helper function to calculate discounted price
const calculateDiscountedPrice = (product: ProductWithDiscount): number => {
  if (!product.Discount || product.Discount.length === 0) {
    return product.price;
  }

  const discount = product.Discount[0];

  if (discount.discount_type === "percentage") {
    return (
      product.price -
      Math.floor((product.price * discount.discount_value) / 100)
    );
  } else {
    return product.price - discount.discount_value;
  }
};

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const {profile} = ProfileServices();
  const router = useRouter();
  const showToast = (
    message: string,
    type: keyof typeof toast,
    onClose: any = null
  ) => {
    toast.dismiss();
    (toast[type] as (content: string, options?: ToastOptions) => void)(
      message,
      {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose,
      }
    );
  };

  const loadCart = async () => {
    try {
      setIsLoading(true);
      // const userId = localStorage.getItem("user_id");
      // if (!userId) throw new Error("Please login to view your cart");

      const response = await fetchCartId(profile?.userId);
      setCartData(response.data);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
      if (error instanceof Error && error.message.includes("login")) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(cartItemId);
      await updateCartItem(cartItemId, newQuantity);
      await loadCart(); // Refresh cart data after update
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
      if (error instanceof Error && error.message.includes("login")) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId);
      await loadCart();
      showToast("Deleted item from cart", "success");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  // Calculate total cart price with discounts
  const calculateTotalPrice = (): number => {
    if (!cartData?.items || cartData.items.length === 0) return 0;

    return cartData.items.reduce((total, item) => {
      const productWithDiscount =
        item.product as unknown as ProductWithDiscount;
      const discountedPrice = calculateDiscountedPrice(productWithDiscount);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Calculate total savings
  const calculateTotalSavings = (): number => {
    if (!cartData?.items || cartData.items.length === 0) return 0;

    return cartData.items.reduce((savings, item) => {
      const productWithDiscount =
        item.product as unknown as ProductWithDiscount;
      if (
        !productWithDiscount.Discount ||
        productWithDiscount.Discount.length === 0
      ) {
        return savings;
      }

      const originalPrice = productWithDiscount.price;
      const discountedPrice = calculateDiscountedPrice(productWithDiscount);
      return savings + (originalPrice - discountedPrice) * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();
  const totalSavings = calculateTotalSavings();

  return (
    <div
      role="dialog"
      aria-label="Shopping cart"
      className={`
        fixed inset-y-0 right-0 z-50 h-full w-96 
        bg-gradient-to-b from-neutral-950 to-neutral-900 
        shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="relative h-full">
        {/* Gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-50" />

        <div className="relative h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-neutral-200" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                Your Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-neutral-700 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-neutral-600 animate-spin-slow"></div>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-400 text-center mt-8">{error}</p>
            ) : !cartData?.items.length ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-4">
                <ShoppingCart size={48} className="opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.items.map((item) => {
                  const productWithDiscount =
                    item.product as unknown as ProductWithDiscount;
                  const hasDiscount =
                    productWithDiscount.Discount &&
                    productWithDiscount.Discount.length > 0;
                  const discountedPrice =
                    calculateDiscountedPrice(productWithDiscount);

                  return (
                    <div
                      key={item.cartitem_id}
                      className="relative group rounded-xl overflow-hidden"
                    >
                      {/* Card background */}
                      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl border border-neutral-800/50" />

                      <div className="relative p-4 flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={
                              item.product.ProductImage[0]?.url ||
                              "/product-placeholder.jpg"
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-200 truncate">
                            {item.product.name}
                          </h3>

                          {/* Price with discount */}
                          <div className="mt-1">
                            {hasDiscount ? (
                              <div className="flex items-center">
                                <span className="text-neutral-400 line-through mr-2">
                                  {formatRupiah(item.product.price)}
                                </span>
                                <span className="text-emerald-400">
                                  {formatRupiah(discountedPrice)}
                                </span>
                              </div>
                            ) : (
                              <p className="text-neutral-400">
                                {formatRupiah(item.product.price)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center mt-3 gap-2">
                            <div className="flex items-center bg-neutral-800 rounded-lg">
                              <button
                                className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-50 transition-colors"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.cartitem_id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isUpdating === item.cartitem_id}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-[2rem] text-center text-sm text-neutral-200">
                                {item.quantity}
                              </span>
                              <button
                                className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-50 transition-colors"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.cartitem_id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating === item.cartitem_id}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              className="p-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                              aria-label="Remove item"
                              onClick={() => handleRemoveItem(item.cartitem_id)}
                              disabled={isUpdating === item.cartitem_id}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-neutral-800 pt-4 space-y-4">
            <div className="space-y-2">
              {totalSavings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">You Save</span>
                  <span className="text-emerald-400 font-medium">
                    {formatRupiah(totalSavings)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-neutral-500">
                <span>Total Items</span>
                <span>{cartData?.summary.totalItems || 0} items</span>
              </div>
            </div>

            <Link href={`/checkout`}>
              <button
                className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!cartData?.items.length}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative flex items-center justify-center gap-2 py-3 bg-neutral-900 rounded-lg">
                  <span className="text-neutral-200 font-medium">
                    Proceed to Checkout
                  </span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
