import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE!}`;

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/product/products`);
  return response.data;
};

export const fetchCart = async () => {
  const response = await axios.get(`${API_URL}/cart/get`);
  return response.data;
};

// export const addToCart = async (productId: number, quantity: number) => {
//   await axios.post(`${API_URL}/cart/add`, { productId, quantity });
// };

export const addToCartAPI = async (product_id: string, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, quantity }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add product: ${response.statusText}`);
  }

  return response.json();
};

export const updateCartItem = async (
  cartItemId: number,
  quantity: number = 1,
  userId: number = 1
) => {
  await axios.put(`${API_URL}/cart/updatecart`, {
    cartItemId,
    quantity,
    userId,
  });
};
export const updateCartItemAPI = async (
  productId: string,
  quantity: number
) => {
  const res = await fetch(`${API_URL}/cart/updatecart/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to update item quantity");
};

export const removeFromCartAPI = async (productId: string) => {
  const res = await fetch(`${API_URL}/cart/remove/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove item from cart");
};

export const removeFromCart = async (cartItemId: number) => {
  await axios.delete(`${API_URL}/cart/remove/${cartItemId}`);
};
