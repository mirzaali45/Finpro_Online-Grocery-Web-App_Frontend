// services/user-management.service.ts
import { AuthService } from "./auth.service";
import { User, ApiUserResponse } from "@/types/user-types";

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class UserManagementService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${base_url_be}/super-admin/showallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const apiResponse: ApiUserResponse = await response.json();
      return apiResponse.data.filter((user) => user.role !== "super_admin");
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async getAllStoreAdmin(): Promise<User[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${base_url_be}/super-admin/showallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const apiResponse: ApiUserResponse = await response.json();
      return apiResponse.data.filter(
        (user) => user.role !== "super_admin" && user.role !== "customer"
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  static async getAllCustomer(): Promise<User[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await fetch(`${base_url_be}/super-admin/showallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const apiResponse: ApiUserResponse = await response.json();
      return apiResponse.data.filter(
        (user) => user.role !== "super_admin" && user.role !== "store_admin"
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}
