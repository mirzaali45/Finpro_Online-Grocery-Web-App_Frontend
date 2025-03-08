import React, { useState, useEffect, useRef } from "react";

interface UserFormData {
  email: string;
  password: string;
  role: "customer" | "store_admin";
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
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

const fieldConfig = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Store Admin Name",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Store First Name",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Store Last Name",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Store Phone Number",
  },
];

const UserForm = ({
  closeModal,
  refreshUsers,
}: {
  closeModal: () => void;
  refreshUsers: () => void;
}) => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields are filled
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "role") {
        errors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Avatar validation (optional)
    if (avatar && avatar.size > 2 * 1024 * 1024) {
      errors.avatar = "Avatar file size must be less than 2MB";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Only validate on change if user has already attempted to submit once
  useEffect(() => {
    if (attemptedSubmit) {
      validateForm();
    }
  }, [formData, attemptedSubmit, avatar]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          avatar: "File size must be less than 2MB",
        }));
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          avatar: "Only JPG, PNG, and WebP formats are allowed",
        }));
        return;
      }

      setAvatar(file);
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const isValid = validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Use FormData instead of JSON for file uploads
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add avatar if exists
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/super-admin/createusers`,
        {
          method: "POST",
          headers: {
            // Don't set Content-Type here, let the browser set it with the boundary for multipart/form-data
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

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

  const renderField = (field: (typeof fieldConfig)[0]) => (
    <div
      key={field.name}
      className={
        field.name === "firstName" || field.name === "lastName"
          ? "sm:col-span-1"
          : ""
      }
    >
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {field.label} <span className="text-red-500">*</span>
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        required
        placeholder={field.placeholder}
        value={formData[field.name as keyof UserFormData]}
        onChange={handleInputChange}
        className={`w-full border ${
          attemptedSubmit && formErrors[field.name]
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } rounded-lg px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700`}
      />
      {attemptedSubmit && formErrors[field.name] && (
        <p className="mt-1 text-sm text-red-600">{formErrors[field.name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md sm:max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Create New User
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Avatar upload section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full border-2 border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Choose Image
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    JPG, PNG or WebP (max. 2MB)
                  </p>
                  {formErrors.avatar && (
                    <p className="text-sm text-red-600 mt-1">
                      {formErrors.avatar}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldConfig.slice(0, 3).map(renderField)}

              <div className="sm:col-span-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-700 dark:text-gray-200"
                >
                  <option value="customer">Customer</option>
                  <option value="store_admin">Store Admin</option>
                </select>
              </div>

              {fieldConfig.slice(3).map(renderField)}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-70 transition-colors shadow-md"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
