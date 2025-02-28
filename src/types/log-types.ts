// types/log-types.ts

// Main log entry interface
export interface LogEntry {
  id: number;
  action: string;
  module: string;
  description: string;
  timestamp: string | Date; // Accept either string or Date
}

// Generic interface for log details (can contain any properties)
export interface LogDetails {
  // For Update actions
  itemId?: number;
  updates?: {
    operation?: "add" | "subtract";
    qty?: number;
    [key: string]: any;
  };

  // For Delete actions
  item?: {
    id: number;
    name: string;
    store: string;
    quantity: number;
  };

  // For batch Delete actions
  items?: Array<{
    id: number;
    name: string;
    store: string;
    quantity: number;
  }>;

  // For Add actions
  totalAddedItems?: number;

  // For other actions
  message?: string;
  [key: string]: any;
}

// Filter options for fetching logs
export interface LogFilterOptions {
  module?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// Pagination metadata
export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}
