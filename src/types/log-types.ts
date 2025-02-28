import { UpdateInventoryRequest } from "./inventory-types";

export interface Log {
  id?: number;
  action: string;
  description: string;
  module: string;
  timestamp: Date;
  userId?: number; // Optional, depending on your authentication
}

export type LogDetails = {
    itemId?: number;
    updates?: UpdateInventoryRequest;
    items?: Array<{
      id: number;
      name: string;
      store: string;
      quantity: number;
    }>;
    totalAddedItems?: number;
    totalDeletedItems?: number;
    totalItems?: number;
    totalCategories?: number;
    message?: string;
    productName?: string;
    storeName?: string;
    item?: {
      id: number;
      name: string;
      store: string;
      quantity: number;
    };
  };