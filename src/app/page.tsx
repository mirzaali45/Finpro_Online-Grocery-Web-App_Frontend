"use client"
import { useState } from 'react';
import { Navbar } from '../components/navbar';
import { CartItem } from '../components/cartitem';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      cartitem_id: 1,
      product: { name: 'Product 1', price: 100 },
      quantity: 2,
    },
    {
      cartitem_id: 2,
      product: { name: 'Product 2', price: 200 },
      quantity: 1,
    },
  ]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      setCartItems((prev) =>
        prev.map((item) => (item.cartitem_id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id:number) => {
    setCartItems((prev) => prev.filter((item) => item.cartitem_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartCount={cartItems.length} />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cartItems.map((item) => (
              <CartItem
                key={item.cartitem_id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
