import axios, { AxiosHeaders } from "axios";
import { JwtPayload, decode } from "jsonwebtoken";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE!}`;

// Helper function to get auth header and decoded token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found");
  return `Bearer ${token}`;
};

// Helper to get userId from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found");
  
  const decoded = decode(token) as JwtPayload & { id: number };
  if (!decoded) throw new Error("Invalid token");
  
  return decoded.id;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = new AxiosHeaders(config.headers);
    headers.set('Authorization', getAuthHeader());
    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchCart = async () => {
  const response = await axiosInstance.get("/cart/get");
  return response.data;
};

export const fetchCartId = async () => {
  try {
    const userId = getUserIdFromToken();
    const response = await axiosInstance.get(`/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("Invalid user ID");
      if (error.response?.status === 404) throw new Error("Cart not found");
      if (error.response?.status === 401) throw new Error("Please login to view cart");
    }
    throw new Error("Failed to fetch cart");
  }
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const userId = getUserIdFromToken();
  const response = await axiosInstance.post("/cart/add", {
    productId,
    userId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
  await axiosInstance.put("/cart/updatecart", {
    cartItemId,
    quantity,
  });
};

export const removeFromCart = async (cartItemId: number) => {
  await axiosInstance.delete(`/cart/remove/${cartItemId}`);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 300) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
