import { StoreData } from "@/types/store-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

export const storeService = {
  async getStores(): Promise<StoreData[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/store`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to fetch stores: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch stores: Network error");
    }
  },

 async createStore(formData: StoreData): Promise<StoreData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");


      const storeData: StoreData = {
        store_name: formData.store_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        province: formData.province,
        postcode: formData.postcode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description
      };

      const response = await fetch(`${BASE_URL}/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to create store: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to create store: Network error");
    }
},

  async deleteStore(storeId: number): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/store/${storeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to delete store: ${response.statusText}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to delete store: Network error");
    }
  },
};
