// types/log-types.ts

export interface LogDetails {
  [key: string]: any;
  items?: Array<{
    id: number;
    name: string;
    store: string;
    quantity: number;
  }>;
  item?: {
    id: number;
    name: string;
    store: string;
    quantity: number;
  };
  updates?: {
    operation: string;
    qty: number;
  };
  message?: string;
  itemId?: number;
  totalAddedItems?: number;
  totalDeletedItems?: number;
  totalItems?: number;
  totalCategories?: number;
  productName?: string;
  storeName?: string;
}

export interface LogEntry {
  id: number;
  action: string;
  description: string;
  module: string;
  timestamp: string | Date;
  details?: LogDetails;
}

export interface LogFilterOptions {
  module?: string;
  action?: string;
  page?: number;
  pageSize?: number;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
