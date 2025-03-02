// types/inventory-report.types.ts

export interface Store {
    store_id: number;
    store_name: string;
    city: string;
    province: string;
  }
  
  export interface Category {
    category_id: number;
    category_name: string;
  }
  
  export interface Product {
    product_id: number;
    name: string;
    price: number;
    category: Category;
  }
  
  export interface InventoryItem {
    inv_id: number;
    store_id: number;
    product_id: number;
    qty: number;
    total_qty: number;
    store: Store;
    product: Product;
  }
  
  export interface StoreSummary {
    store_id: number;
    store_name: string;
    location: string;
    totalItems: number;
    totalValue: number;
    itemCount: number;
  }
  
  export interface InventoryOverview {
    totalStores: number;
    totalItems: number;
    totalValue: number;
    averageItemsPerStore: number;
  }
  
  export interface InventoryReportData {
    overview: InventoryOverview;
    storesSummary: StoreSummary[];
    inventory: {
      inventory_id: number;
      store: {
        id: number;
        name: string;
      };
      product: {
        id: number;
        name: string;
        category: string;
        price: number;
      };
      current_quantity: number;
      total_quantity: number;
      stockValue: number;
      lowStock: boolean;
    }[];
  }
  
  export interface InventoryReportResponse {
    status: string;
    message: string;
    data: InventoryReportData;
  }
  
  export interface InventoryReportFilters {
    storeId?: number;
    productId?: number;
    lowStock?: boolean;
    threshold?: number;
  }