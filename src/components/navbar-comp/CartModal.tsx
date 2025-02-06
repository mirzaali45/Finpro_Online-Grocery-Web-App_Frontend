import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  fetchCartId,
  updateCartItem,
  removeFromCart,
} from "@/services/cart.service";
import { formatRupiah } from "@/helper/currencyRp";
import { CartModalProps, CartData } from "@/types/cart-types";

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("Please login to view your cart");

      const response = await fetchCartId(userId);
      setCartData(response.data);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
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
      // Optimistically update the UI
      if (cartData) {
        const updatedItems = cartData.items.map((item) => {
          if (item.cartitem_id === cartItemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        const totalQuantity = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        );

        setCartData({
          ...cartData,
          items: updatedItems,
          summary: {
            ...cartData.summary,
            totalQuantity,
            totalPrice,
          },
        });
      }
      // Background refresh
      loadCart();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
      loadCart(); // Reload on error to ensure consistency
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId);
      await loadCart();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Shopping cart"
      className="fixed inset-y-0 right-0 z-50 h-full w-96 bg-white shadow-lg"
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center mt-8">{error}</p>
          ) : !cartData?.items.length ? (
            <p className="text-gray-500 text-center mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartData.items.map((item) => (
                <div
                  key={item.cartitem_id}
                  className="flex items-center p-4 border rounded-lg"
                >
                  <div className="relative w-20 h-20 mr-4">
                    <Image
                      src={
                        item.product.ProductImage[0]?.url ||
                        "/product-placeholder.jpg"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      {formatRupiah(item.product.price)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartitem_id,
                            item.quantity - 1
                          )
                        }
                        disabled={isUpdating === item.cartitem_id}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Increase quantity"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartitem_id,
                            item.quantity + 1
                          )
                        }
                        disabled={isUpdating === item.cartitem_id}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        className="ml-4 p-1 text-red-500 hover:text-red-600 disabled:opacity-50"
                        aria-label="Remove item"
                        onClick={() => handleRemoveItem(item.cartitem_id)}
                        disabled={isUpdating === item.cartitem_id}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">
                {cartData?.summary.totalPrice
                  ? formatRupiah(cartData.summary.totalPrice)
                  : formatRupiah(0)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Items</span>
              <span>{cartData?.summary.totalItems || 0} items</span>
            </div>
          </div>
          <button
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300"
            disabled={!cartData?.items.length}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
