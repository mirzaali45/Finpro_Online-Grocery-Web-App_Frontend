import { EditData, StoreData } from "@/types/store-types";

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
  function decodeToken(token: string) {
      const [header, payload] = token.split('.').slice(0, 2);
      return {
        header: JSON.parse(atob(header)),
        payload: JSON.parse(atob(payload)),
      };
    }
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new StoreServiceError("No authentication token found");
        const userId = decodeToken(token).payload.id

        const storeData: StoreData = {
          store_name: formData.store_name,
          address: formData.address,
          subdistrict: formData.subdistrict,
          city: formData.city,
          province: formData.province,
          postcode: formData.postcode,
          latitude: formData.latitude ? formData.latitude : 0,
          longitude: formData.longitude ? formData.longitude : 0,
          description: formData.description,
          user_id: userId ? userId : null
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
          const errorData = await response.json();
          console.log(errorData)
          throw new StoreServiceError(
            `Failed to create store: ${errorData.error}`,
            response.status
          );
        }

        return response.json();
      } catch (error) {
        if (error instanceof StoreServiceError) throw error;
        throw new StoreServiceError("Failed to create store: Network error");
      }
  },

  async editStore(formData: EditData, storeId: number): Promise<EditData> {
  function decodeToken(token: string): {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
  } {
    const [header, payload] = token.split(".").slice(0, 2);
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
    };
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new StoreServiceError("No authentication token found");

    const userId = decodeToken(token).payload.id as number | null | undefined;

    if (userId) {
      const editData: EditData = {
        store_name: formData.store_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        province: formData.province,
        postcode: formData.postcode,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        user_id: userId,
      };

      const response = await fetch(`${BASE_URL}/store/${storeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new StoreServiceError(
          `Failed to edit store: ${errorData.error}`,
          response.status
        );
      }

      return response.json();
    } else {
      throw new StoreServiceError("Invalid user");
    }
  } catch (error) {
    if (error instanceof StoreServiceError) throw error;
    throw new StoreServiceError("Failed to edit store: Network error");
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

      const data = await response.json()
      // console.log(data.error)
      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to delete store: ${data.error}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to delete store: Network error");
    }
  },
};
