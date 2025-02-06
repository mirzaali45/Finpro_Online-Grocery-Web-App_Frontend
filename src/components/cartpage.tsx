import { useState } from "react";
import Navbar from "../components/navbar";
import { CartItem } from "../app/cartitem";

const sampleCartItems = [
  { cartitem_id: 1, product: { name: "Item A", price: 20 }, quantity: 2 },
  { cartitem_id: 2, product: { name: "Item B", price: 15 }, quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(sampleCartItems);

  // Hitung total item dalam cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartitem_id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartitem_id !== id));
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="p-4">
        <h1 className="text-xl font-bold">Shopping Cart</h1>
        <div className="space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.cartitem_id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
