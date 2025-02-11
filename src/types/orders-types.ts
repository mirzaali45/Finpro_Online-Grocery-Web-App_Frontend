export interface Orders {
  order_id: number;
  user_id: number;
  store_id: number;
  order_status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  store: {
    store_name: string;
    city: string;
  };
  OrderItem: OrdersItems[];
}

export interface OrdersItems {
  orderitem_id: number;
  order_id: number;
  product_id: number;
  qty: number;
  price: number;
  total_price: number;
  product: ProductOrderItem;
}

export interface ProductOrderItem {
  name: string;
  description: string;
}