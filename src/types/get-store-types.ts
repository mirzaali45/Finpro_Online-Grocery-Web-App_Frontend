// Types representing the store-related data models for Next.js 14 application

export interface User {
  user_id: number;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface ProductImage {
  image_id: number;
  product_id: number;
  url: string;
}

export interface Product {
  product_id: number;
  name: string;
  price: number;
  ProductImage?: ProductImage[];
}

export interface Store {
  store_id: number;
  store_name: string;
  address: string;
  subdistrict?: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  User?: User;
  Product?: Product[];
}

// API response types
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginationInfo;
}

// Query parameters
export interface StoreQueryParams {
  page?: number;
  limit?: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
}

export interface StoreSearchParams {
  query: string;
}
