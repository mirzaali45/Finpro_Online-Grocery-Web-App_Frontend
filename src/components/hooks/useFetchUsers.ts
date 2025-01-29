import { useState, useEffect, useCallback } from "react";

interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "customer" | "store_admin" | "super_admin"; // Keep "super_admin" here for exclusion
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export default function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const fetchUsers = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(`${base_url_be}/super-admin/showallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const jsonResponse = await response.json();

      // Ensure we have the 'data' field and it's an array
      if (
        jsonResponse.status === "success" &&
        Array.isArray(jsonResponse.data)
      ) {
        const filteredUsers = jsonResponse.data.filter(
          (user: User) => user.role !== "super_admin"
        );
        setUsers(filteredUsers);
      } else {
        throw new Error("Data is not in the expected format.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsFetching(false);
    }
  }, [base_url_be]);

  const deleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `${base_url_be}/super-admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      const jsonResponse = await response.json();

      if (jsonResponse.status === "success") {
        // Remove the user from the state after successful deletion
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      } else {
        throw new Error(jsonResponse.message || "Failed to delete user.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, error, isFetching, fetchUsers, deleteUser };
}
