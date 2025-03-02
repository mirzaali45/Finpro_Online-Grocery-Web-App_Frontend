import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BE! || "http://localhost:8000/api", // Ganti dengan URL backend Anda
});

export default api;
