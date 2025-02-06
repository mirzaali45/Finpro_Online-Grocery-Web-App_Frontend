import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE!}`;

export const fetchCart = async () => {
  const response = await axios.get(`${API_URL}/cart/get`);
  return response.data;
};

export const fetchCartId = async (userId: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("Invalid user ID");
      if (error.response?.status === 404) throw new Error("Cart not found");
    }
    throw new Error("Failed to fetch cart");
  }
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("Please login to add items to cart");

  const response = await axios.post(`${API_URL}/cart/add`, {
    productId,
    userId: parseInt(userId),
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
  await axios.put(`${API_URL}/cart/updatecart`, {
    cartItemId,
    quantity,
  });
};

export const removeFromCart = async (cartItemId: number) => {
  await axios.delete(`${API_URL}/cart/remove/${cartItemId}`);
};
