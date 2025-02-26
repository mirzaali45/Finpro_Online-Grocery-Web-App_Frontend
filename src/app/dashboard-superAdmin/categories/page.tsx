"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/sidebarSuperAdmin";
import CategoryCard from "@/components/category-management/CategoryCard";
import CategoryModal from "@/components/category-management/CategoryModal";
import { categoryService } from "@/services/category-admin.service";
import { Category, CategoryFormData } from "@/types/category-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CategoriesAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>({
    category_name: "",
    description: "",
    thumbnail: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
    }
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      description: "",
      thumbnail: "",
    });
    setCategoryImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      submitData.append("category_name", formData.category_name);
      submitData.append("description", formData.description);

      // Add image file if it exists
      if (categoryImage) {
        submitData.append("image", categoryImage);
      }

      // Update categoryService to handle FormData
      const newCategory = await categoryService.createCategoryWithImage(
        submitData
      );

      // Show success toast first
      toast.success("Category created successfully");

      // Reset form and close modal
      setIsModalOpen(false);
      resetForm();

      // Delay the page reload to allow toast to be seen
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2 seconds delay
    } catch (err) {
      // Show error toast
      toast.error(
        err instanceof Error ? err.message : "Failed to create category"
      );

      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    }
  };

  const handleEdit = (category: Category) => {
    // Implement edit functionality
    console.log("Edit category:", category);
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted successfully");
      setCategories(
        categories.filter((category) => category.category_id !== id)
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category"
      );
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
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
                key={category.category_id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
        />

        {/* ToastContainer for displaying notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}
