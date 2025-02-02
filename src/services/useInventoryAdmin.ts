import { CreateInventoryRequest, GetInventoryParams, GetLowStockParams, Inventory, UpdateInventoryRequest } from "@/types/inventory-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class InventoryService {
  static async createInventory(formData: CreateInventoryRequest): Promise<Inventory> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getInventory(): Promise<Inventory[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/inventory`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getInventoryById(invId: number): Promise<Inventory> {
    try {
      const response = await fetch(`${BASE_URL}/inventory/${invId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async updateInventory(invId: number, data: UpdateInventoryRequest): Promise<Inventory> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${BASE_URL}/inventory/${invId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update inventory');
      }
  
      return response.json();
    } catch (error) {
      console.error('Update inventory error:', error);
      throw error;
    }
  }

  static async deleteInventory(invId: number): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/inventory/${invId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getLowStockProducts(params?: GetLowStockParams): Promise<Inventory[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.store_id) {
        queryParams.append('store_id', params.store_id.toString());
      }
      if (params?.threshold) {
        queryParams.append('threshold', params.threshold.toString());
      }

      const response = await fetch(`${BASE_URL}/inventory/low-stock?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch low stock products');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
}