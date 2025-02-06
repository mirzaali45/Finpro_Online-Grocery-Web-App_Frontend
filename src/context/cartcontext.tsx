"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchCart, addToCartAPI, removeFromCartAPI, updateCartItemAPI } from "@/services/api";

type CartItem = {
  product_id: string;
  name: string;
  price: number | string; // Bisa jadi dari API masih dalam bentuk string
  discount_price?: number | string; // Bisa jadi dari API masih dalam bentuk string
  quantity: number;
  ProductImage?: { url: string }[];
};

type CartContextType = {
  cartItems: CartItem[];
  totalQuantity: number;
  updateCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  // 🔹 Fungsi untuk mengambil data cart dari backend
  const updateCart = async () => {
    try {
      const data = await fetchCart();

      // 🔥 Pastikan `price` & `discount_price` adalah number
      const updatedCart = data.map((item: CartItem) => ({
        ...item,
        price: Number(item.price) || 0,
        discount_price: item.discount_price ? Number(item.discount_price) : null,
      }));

      setCartItems(updatedCart);

      // 🔹 Hitung total quantity semua produk di cart
      const totalQty = updatedCart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      setTotalQuantity(totalQty);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // 🔹 Tambahkan produk ke cart (update quantity jika sudah ada)
  const addToCart = async (product: CartItem) => {
    try {
      const existingItem = cartItems.find((item) => item.product_id === product.product_id);

      if (existingItem) {
        // Jika produk sudah ada, update quantity di backend
        await updateCartItemAPI(product.product_id, existingItem.quantity + 1);
      } else {
        // Jika produk belum ada, tambahkan ke cart di backend
        await addToCartAPI(product.product_id, 1); // Kirim product_id dan quantity 1
      }

      await updateCart(); // 🔄 Perbarui cart setelah perubahan
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // 🔹 Hapus produk dari cart
  const removeFromCart = async (productId: string) => {
    try {
      await removeFromCartAPI(productId);
      await updateCart(); // 🔄 Perbarui cart setelah dihapus
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // 🔹 Update quantity produk di cart
  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId); // Jika quantity = 0, hapus produk
    }

    try {
      await updateCartItemAPI(productId, quantity);
      await updateCart(); // 🔄 Perbarui cart setelah perubahan
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // 🔥 Gunakan useEffect untuk memastikan totalQuantity selalu diperbarui
  useEffect(() => {
    updateCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        updateCart,
        addToCart,
        removeFromCart,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🔹 Hook untuk mengakses cart di komponen lain
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
