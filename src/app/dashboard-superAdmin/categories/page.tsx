"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/sidebarSuperAdmin";
import CategoryCard from "@/components/category-management/CategoryCard";
import CategoryModal from "@/components/category-management/CategoryModal";
import { categoryService } from "@/services/category-admin.service";
import { Category, CategoryFormData } from "@/types/category-types";

export default function CategoriesAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>({
    category_name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCategory = await categoryService.createCategory(formData);
      setCategories((prev) => [...prev, newCategory]);
      setIsModalOpen(false);
      setFormData({
        category_name: "",
        description: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    }
  };

  const handleEdit = (category: Category) => {
    // Implement edit functionality
    console.log("Edit category:", category);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log("Delete category:", id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className={`p-6 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Phone Brand Categories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
