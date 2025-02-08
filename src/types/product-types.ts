export interface Store {
  store_id: number;
  store_name: string;
  city: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  store_id: string;
  initial_quantity: string;
}

export interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  category: Category;
<<<<<<< HEAD
  highlightedName?: React.ReactNode;
  slug: string;
=======
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
  store: Store;
  Inventory?: {
    total_qty: number;
  }[];
  ProductImage?: {
    url: string;
  }[];
<<<<<<< HEAD
}

export interface ModalState {
  isSearchOpen: boolean;
  isCartOpen: boolean;
}

export interface NavbarProps {
  className?: string;
}
=======
}
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
