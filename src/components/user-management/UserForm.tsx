import React, { useState } from "react";

interface UserFormData {
  email: string;
  password: string;
  role: "customer" | "store_admin";
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const INITIAL_FORM_STATE: UserFormData = {
  email: "",
  password: "",
  role: "customer",
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
};

const UserForm = ({
  closeModal,
  refreshUsers,
}: {
  closeModal: () => void;
  refreshUsers: () => void;
}) => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/super-admin/createusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create user");
      refreshUsers();
      closeModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        {error && <div className="bg-red-100 p-3 mb-4">{error}</div>}

        {/* Input fields */}
        {[
          "email",
          "password",
          "username",
          "firstName",
          "lastName",
          "phone",
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={formData[field as keyof UserFormData] || ""}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 mb-2"
          />
        ))}

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        >
          <option value="customer">Customer</option>
          <option value="store_admin">Store Admin</option>
        </select>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-200 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
