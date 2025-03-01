"use client";

import { useState, useEffect } from "react";
import { Store, Category, ProductFormData } from "@/types/product-types";

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  submitText: string;
  loadingText: string;
  isEdit?: boolean;
}

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  submitText,
  loadingText,
  isEdit,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesAndStores();
  }, []);

  const fetchCategoriesAndStores = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const [categoriesResponse, storesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/store`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const [categoriesData, storesData] = await Promise.all([
        categoriesResponse.json(),
        storesResponse.json(),
      ]);

      console.log('Categories:', categoriesData); // Debug log
      console.log('Stores:', storesData); // Debug log

      setCategories(categoriesData);
      setStores(storesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Debug log
    onSubmit(e);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Product Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Product Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Enter product description"
          required
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Price
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter price"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Category
        </label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Store */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Store
        </label>
        <select
          value={formData.store_id}
          onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>

      {/* Initial Quantity */}
      {!isEdit && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Initial Quantity
          </label>
          <input
            type="number"
            value={formData.initial_quantity}
            onChange={(e) => setFormData({ ...formData, initial_quantity: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter initial quantity"
            required
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? loadingText : submitText}
      </button>
    </form>
  );
}
