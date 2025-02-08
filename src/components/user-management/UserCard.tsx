import React from "react";
import { Trash, Shield, User as UserIcon } from "lucide-react"; // Import Trash here
import Swal from "sweetalert2"; // Import SweetAlert2

interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "customer" | "store_admin" | "super_admin"; // Add "super_admin" here
  verified: boolean;
  created_at: string;
  updated_at: string;
}

const UserCard = ({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (userId: number) => void;
}) => {
  const RoleIcon = user.role === "customer" ? UserIcon : Shield;
  const roleColor =
    user.role === "customer" ? "text-green-500" : "text-blue-500";

  // Handle delete with SweetAlert2 confirmation
  const handleDelete = (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onDelete(userId); // Perform delete action
          Swal.fire("Deleted!", "The user has been deleted.", "success"); // Success alert
        } catch (error) {
          // If there's an error, show it in the alert
          console.error(error); // Log error (or you can show it using Swal)
          Swal.fire("Error!", "There was an issue deleting the user.", "error"); // Error alert
        }
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <RoleIcon className={`${roleColor}`} />
        <h2 className="ml-2 text-xl font-semibold">
          {user.first_name} {user.last_name}
        </h2>
      </div>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>
        <button
          onClick={() => handleDelete(user.user_id)} // Use handleDelete instead of onDelete directly
          className="text-red-500 flex items-center bg-gray-700 rounded-lg p-2 shadow-lg border-black hover:text-black hover:bg-red-500"
        >
          <Trash size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
