// types/storeAdmin-types.d.ts

export interface OrderItem {
    orderitem_id: number;
    product_id: number;
    qty: number;
    price: number;
    total_price: number;
  }
  
  export interface Shipping {
    shipping_id: number;
    shipping_status: string;
    shipping_address: string;
    shipping_cost: number;
  }
  
  export interface Store {
    store_id: number;
    store_name: string;
    store_address: string;
    city: string;
    province: string;
  }
  
  export interface Order {
    order_id: number;
    order_status: string;
    total_price: number;
    created_at: Date;
    OrderItem: OrderItem[]; // Relasi OrderItem
    Shipping: Shipping[];    // Relasi Shipping
    store: Store;            // Relasi Store yang terkait dengan pesanan
  }
  