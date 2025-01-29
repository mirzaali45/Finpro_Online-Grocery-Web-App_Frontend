import React, { useState } from "react";
import { Plus, RefreshCw, AlertTriangle } from "lucide-react";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import useFetchUsers from "../hooks/useFetchUsers";

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { users, error, isFetching, fetchUsers, deleteUser } = useFetchUsers();

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={fetchUsers}
          disabled={isFetching}
          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          title="Refresh Users"
        >
          <RefreshCw
            className={`${isFetching ? "animate-spin" : ""}`}
            size={20}
          />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="mr-2" size={20} />
          Create User
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
          <AlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.user_id} user={user} onDelete={deleteUser} />
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <UserForm
          closeModal={() => setIsModalOpen(false)}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
}
