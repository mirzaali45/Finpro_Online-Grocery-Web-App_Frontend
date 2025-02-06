"use client";

import { useState, useEffect } from "react";
import { fetchCart, updateCartItem, removeFromCart } from "@/services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/context/cartcontext";

type CartItem = {
  cartitem_id: number;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    ProductImage: { url: string }[];
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { updateCart } = useCart();

  useEffect(() => {
    fetchCart().then((data) => setCartItems(data));
  }, []);

  const handleQuantityChange = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;

    await updateCartItem(cartItemId, quantity);
    await updateCart();
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartitem_id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = async (cartItemId: number) => {
    await removeFromCart(cartItemId);
    await updateCart();
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartitem_id !== cartItemId)
    );
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Keranjang belanja Anda kosong.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartitem_id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    item.product.ProductImage.length > 0
                      ? item.product.ProductImage[0].url
                      : "/placeholder.png"
                  }
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-gray-600">
                    Rp {item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    handleQuantityChange(item.cartitem_id, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span className="text-lg font-bold">{item.quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    handleQuantityChange(item.cartitem_id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.cartitem_id)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
