// types/product.ts
export interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  store: {
    store_name: string;
  };
  ProductImage?: Array<{
    url: string;
  }>;
}

export interface ProductFormData {
  name: string;
  store_id: string;
  description: string;
  price: string;
  category_id: string;
  initial_quantity: string;
}

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
