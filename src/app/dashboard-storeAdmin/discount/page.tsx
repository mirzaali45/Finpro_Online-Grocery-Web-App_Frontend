"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

interface StoreData {
  store_id: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  user_id: number | null;
  User: any | null;
  Product: Product[];
  Inventory: any[];
}

interface FormData {
  store_id: number;
  product_id?: number;
  thumbnail: string;
  discount_code: string;
  discount_type: string;
  discount_value: string;
  minimum_order: string;
  expires_at: string;
  userUser_id: number;
}

export default function DiscountStore() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState<FormData>({
    store_id: 0,
    product_id: undefined,
    thumbnail: "",
    discount_code: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_order: "",
    expires_at: "",
    userUser_id: 0,
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/discount/getproduct`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const storeData: StoreData = await response.json();
      console.log("Store data with products:", storeData);

      setFormData((prev) => ({
        ...prev,
        store_id: storeData.store_id,
      }));

      setProducts(storeData.Product);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        console.log("Decoded token:", decoded);

        if (!decoded.id) {
          throw new Error("Invalid user information");
        }

        setFormData((prev) => ({
          ...prev,
          userUser_id: decoded.id,
        }));

        fetchProducts();
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Invalid authentication token");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const discountValue = Number(formData.discount_value);
    const minimumOrder = Number(formData.minimum_order);

    if (!formData.discount_code.trim()) {
      throw new Error("Discount code is required");
    }
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      throw new Error("Discount value must be between 1 and 100");
    }
    if (isNaN(minimumOrder) || minimumOrder < 0) {
      throw new Error("Minimum order cannot be negative");
    }
    if (!formData.expires_at) {
      throw new Error("Expiry date is required");
    }

    const expiryDate = new Date(formData.expires_at);
    if (expiryDate <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      validateForm();

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const decoded = jwtDecode<CustomJwtPayload>(token);

      if (!decoded.id) {
        throw new Error("Invalid user information");
      }

      const apiData = {
        store_id: formData.store_id,
        product_id: formData.product_id || null,
        thumbnail: formData.thumbnail || "default-thumbnail",
        discount_code: formData.discount_code.trim().toUpperCase(),
        discount_type: "percentage",
        discount_value: Number(formData.discount_value),
        minimum_order: Number(formData.minimum_order),
        expires_at: new Date(formData.expires_at).toISOString(),
        userUser_id: decoded.id,
      };

      console.log("Sending data:", JSON.stringify(apiData, null, 2));

      const response = await fetch(
        "http://localhost:8000/api/discount/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.message || errorData.error || "Failed to create discount";
        } catch {
          errorMessage = "Failed to create discount";
        }
        throw new Error(errorMessage);
      }

      router.push("/dashboard-storeAdmin/discount");
    } catch (error) {
      console.error("Error creating discount:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create discount"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create New Discount
          </h1>
          <p className="mt-2 text-gray-600">
            Fill in the details to create a new discount code for your store.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Selection */}
              <div className="md:col-span-2">
                <label
                  htmlFor="product_id"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Product (Optional)
                </label>
                <select
                  id="product_id"
                  name="product_id"
                  value={formData.product_id || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">Select a product (optional)</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name} - ${product.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Code */}
              <div className="md:col-span-2">
                <label
                  htmlFor="discount_code"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Discount Code
                </label>
                <input
                  id="discount_code"
                  name="discount_code"
                  type="text"
                  value={formData.discount_code}
                  onChange={handleInputChange}
                  placeholder="e.g., SUMMER2025"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white uppercase text-gray-900 font-medium tracking-wider"
                />
              </div>

              {/* Discount Value */}
              <div>
                <label
                  htmlFor="discount_value"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Discount Value (%)
                </label>
                <input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  placeholder="20"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Minimum Order */}
              <div>
                <label
                  htmlFor="minimum_order"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Minimum Order Amount
                </label>
                <input
                  id="minimum_order"
                  name="minimum_order"
                  type="number"
                  min="0"
                  value={formData.minimum_order}
                  onChange={handleInputChange}
                  placeholder="100"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Expiry Date */}
              <div className="md:col-span-2">
                <label
                  htmlFor="expires_at"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Expiry Date
                </label>
                <input
                  id="expires_at"
                  name="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Thumbnail URL{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="text"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Discount"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
