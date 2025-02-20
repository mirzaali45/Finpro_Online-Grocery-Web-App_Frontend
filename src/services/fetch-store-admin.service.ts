interface User {
  user_id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "customer" | "store_admin" | "super_admin";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  data: User[];
}

export interface StoreAdmin {
  user_id: number;
  username: string;
}

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const storeAdminService = {
  getStoreAdmins: async (): Promise<StoreAdmin[]> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(`${base_url_be}/super-admin/showallusers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch store admins");
    }

    const data: ApiResponse = await response.json();

    const storeAdmins = data.data
      .filter((user: User) => user.role === "store_admin")
      .map((admin: User) => ({
        user_id: admin.user_id,
        username: admin.username || "Unnamed Admin",
      }));

    return storeAdmins;
  },
};
