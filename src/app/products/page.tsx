"use client";

import { useState, useEffect } from "react";
import { fetchProducts, addToCart, fetchCart } from "@/services/api";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "@/context/cartcontext";

type Product = {
  product_id: number;
  name: string;
  price: number;
  description: string;
  ProductImage: { url: string }[];
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { updateCart } = useCart();

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      const userId = 1; // HARDCODE sementara, nanti diganti dengan sistem auth

      console.log("Sending to cart:", { productId, userId });

      const response = await addToCart(productId, userId, 1); // Pastikan `userId` dikirim

      console.log("Cart Response:", response);

      await updateCart(); // Perbarui jumlah item di navbar
      toast.success("🛒 Product added to cart!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error("❌ Failed to add product!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">
        Our Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={
                  product.ProductImage.length > 0
                    ? product.ProductImage[0].url
                    : "/placeholder.png"
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-black font-bold text-xl mt-2">
              ${product.price.toFixed(2)}
            </p>
            <button
              onClick={() => handleAddToCart(product.product_id)}
              className="mt-4 w-full py-3 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
