export enum OrderStatus {
  pending = "pending",
  awaiting_payment = "awaiting_payment",
  processing = "processing",
  shipped = "shipped",
  completed = "completed",
  cancelled = "cancelled",
}

export enum ShippingStatus {
  pending = "pending",
  shipped = "shipped",
  delivered = "delivered",
}

export interface OrderItem {
  discount: any;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  image: string | null;
  discount_type?: "percentage" | "point"; // Tambahkan jika perlu
  discount_value?: number; // Tambahkan jika perlu
}

export interface OrderStore {
  store_id: number;
  store_name: string;
  location: string;
}

export interface OrderShipping {
  length: number;
  status: ShippingStatus;
  address: string;
  cost: number;
}

export interface Order {
  order_status(order_status: any): import("react").ReactNode;
  Shipping: any;
  order_id: number;
  order_date: string;
  status: OrderStatus;
  total_price: number;
  total_items: number;
  created_at: number;
  store: OrderStore;
  shipping: OrderShipping | null;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
