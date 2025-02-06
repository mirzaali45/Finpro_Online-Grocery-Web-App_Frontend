"use client";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { useCart } from "../context/cartcontext";

type MiniCartProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MiniCart: React.FC<MiniCartProps> = ({ isOpen, setIsOpen }) => {
  const { cartItems, totalQuantity, removeFromCart } = useCart();

  return (
    <div
      className={`absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-200 transition-all duration-200 ease-in-out transform ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 🔹 Header Mini Cart */}
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold">
          Keranjang <span className="text-blue-500">({totalQuantity})</span>
        </h3>
        <button onClick={() => setIsOpen(false)}>
          <IoMdClose size={20} />
        </button>
      </div>

      {/* 🔹 Daftar Produk */}
      {cartItems.length > 0 ? (
        <ul className="mt-3 space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => {
            // 🔥 Konversi `price` dan `discount_price` ke number untuk memastikan tidak undefined/null
            const price = Number(item.price) || 0;
            const discountPrice = Number(item.discount_price) || null;
            const unitPrice = discountPrice ?? price; // Jika ada diskon, gunakan harga diskon
            const totalPrice = unitPrice * item.quantity; // Hitung total harga

            return (
              <li key={item.product_id} className="flex items-center gap-3">
                {/* Gambar Produk */}
                <img
                  src={item.ProductImage?.[0]?.url || "/placeholder.png"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />

                {/* Detail Produk */}
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  {discountPrice ? (
                    <p className="text-xs text-gray-500">
                      <span className="line-through text-gray-400">
                        Rp{price.toLocaleString()}
                      </span>{" "}
                      <span className="font-bold text-red-500">
                        Rp{discountPrice.toLocaleString()}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 font-bold">
                      Rp{price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.quantity} x Rp
                    {unitPrice.toLocaleString()}{" "}
                    ={" "}
                    <span className="font-bold">
                      Rp{totalPrice.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Tombol Hapus */}
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 text-xs"
                >
                  Hapus
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-3">Keranjang kosong</p>
      )}

      {/* 🔹 Tombol Checkout */}
      <div className="mt-4 flex justify-between">
        <Link href="/cart">
          <button className="py-2 px-4 bg-gray-300 text-black rounded-md">
            Lihat Keranjang
          </button>
        </Link>
        <Link href="/checkout">
          <button className="py-2 px-4 bg-green-500 text-white rounded-md">
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};


export default MiniCart;
