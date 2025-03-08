import {
  Store,
  ApiResponse,
  PaginatedResponse,
  StoreQueryParams,
  StoreSearchParams,
} from "@/types/get-store-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

export const StoreService = {
  async getStoreById(
    storeId: number,
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<Store>> {
    try {
      // Build query string for product pagination
      const queryParams = new URLSearchParams();
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.limit !== undefined)
        queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_BASE_URL}/getstore/${storeId}?${queryString}`
        : `${API_BASE_URL}/getstore/${storeId}`;

      console.log("Fetching store from URL:", url);

      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour, adjust as needed
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Error fetching store: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch store:", error);

      if (error instanceof StoreServiceError) {
        return {
          status: "error",
          message: error.message,
        };
      }

      return {
        status: "error",
        message: "Failed to fetch store: Network error",
      };
    }
  },

  async getAllStores(
    params: StoreQueryParams = {}
  ): Promise<PaginatedResponse<Store[]>> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_BASE_URL}/getstore?${queryString}`
        : `${API_BASE_URL}/getstore`;

      console.log("Fetching all stores from URL:", url);

      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour, adjust as needed
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Error fetching stores: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch stores:", error);

      if (error instanceof StoreServiceError) {
        return {
          status: "error",
          message: error.message,
        };
      }

      return {
        status: "error",
        message: "Failed to fetch stores: Network error",
      };
    }
  },

  async searchStores(params: StoreSearchParams): Promise<ApiResponse<Store[]>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("query", params.query);

      const url = `${API_BASE_URL}/stores/search?${queryParams.toString()}`;
      console.log("Searching stores with URL:", url);

      const response = await fetch(url, {
        cache: "no-store", // Don't cache search results
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Error searching stores: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to search stores:", error);

      if (error instanceof StoreServiceError) {
        return {
          status: "error",
          message: error.message,
        };
      }

      return {
        status: "error",
        message: "Failed to search stores: Network error",
      };
    }
  },
};
