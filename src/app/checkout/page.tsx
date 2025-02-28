"use client"; // Ensure this component runs on the client side

import { useState, useEffect } from "react";
import Image from "next/image";
import { CartData } from "@/types/cart-types";
import {
  fetchCartId,
  removeFromCart,
  updateCartItem,
} from "@/services/cart.service";
import axios from "axios";

const CheckoutPage = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Load cart data function
  const loadCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to view your cart");

      // Call your fetchCartId function
      const response = await fetchCartId(); // Assuming this function is defined elsewhere and works correctly
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
    loadCart();
  }, []);

  // Update cart item quantity
  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(cartItemId);
      await updateCartItem(cartItemId, newQuantity);

      // Update cart data after modification
      const updatedItems =
        cartData?.items.map((item) => {
          if (item.cartitem_id === cartItemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        }) || [];

      const totalQuantity =
        updatedItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const totalPrice =
        updatedItems?.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ) || 0;
      const totalItems = updatedItems.length; // Calculate totalItems (number of items in the cart)

      setCartData({
        ...cartData,
        items: updatedItems || [],
        summary: {
          totalItems,
          totalQuantity,
          totalPrice,
        },
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  // Remove an item from the cart
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId);
      loadCart(); // Refresh cart data after item removal
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to proceed");

      // Prepare order data from cart
      const orderData = {
        user_id: 1, // Replace with actual user ID
        products: cartData?.items.map((item) => ({
          product_id: item.product.product_id,
          quantity: item.quantity,
        })),
        address_id: 1, // Address ID, adjust this based on selected address
      };

      // Step 1: Create the order
      const createOrderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE!}/orders`,
        orderData
      );
      const order = createOrderResponse.data.data;

      // Step 2: Generate Snap Token for payment
      const paymentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE!}/payments/snap-token`,
        {
          order_id: order.order_id, // Send the created order ID
        }
      );

      const { token: snapToken, redirect_url } = paymentResponse.data;

      // Step 3: Redirect to Midtrans for payment
      window.location.href = redirect_url; // Send user to Midtrans for payment
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to initiate payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 sm:p-8 md:p-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Checkout</h1>

      {/* Display errors */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Shipping Address Section */}
      <div className="border p-4 rounded-lg shadow-md bg-white mb-6">
        <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
        <div className="flex justify-between mt-4">
          <p className="text-lg">Kampus Telkom University - Robotic SAS</p>
          <button
            onClick={() => alert("Address change functionality")} // Address change logic
            className="text-blue-600 hover:text-blue-700"
          >
            Ganti
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {cartData?.items.length ? (
            cartData.items.map((item) => (
              <div
                key={item.cartitem_id}
                className="flex items-center space-x-4 border p-4 rounded-lg shadow-md"
              >
                <Image
                  src={
                    item.product.ProductImage[0]?.url || "/images/default.jpg"
                  }
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">x {item.quantity}</p>
                  <p className="text-lg font-semibold">
                    Rp {item.product.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.cartitem_id, item.quantity - 1)
                    }
                    disabled={
                      isUpdating === item.cartitem_id || item.quantity <= 1
                    }
                    className="p-2 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.cartitem_id, item.quantity + 1)
                    }
                    disabled={isUpdating === item.cartitem_id}
                    className="p-2 bg-gray-200 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.cartitem_id)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Ringkasan Belanja
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Harga</span>
              <span>Rp {cartData?.summary.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg mt-4">
              <span>Total Pembayaran</span>
              <span>Rp {cartData?.summary.totalPrice.toLocaleString()}</span>
            </div>
          </div>
          {/* Checkout Button */}
          <div className="mt-6 text-center">
            <button
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={isLoading || !cartData?.items.length}
              onClick={handleCheckout} // Proceed to payment
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
