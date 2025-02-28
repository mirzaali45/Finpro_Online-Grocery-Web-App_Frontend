"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category-types";
import { categoryService } from "@/services/category-admin.service";
import { toast } from "react-toastify";

interface FilterCategoriesProps {
  onCategoryChange: (categoryId?: number) => void;
  selectedCategory?: number;
}

export function FilterCategories({
  onCategoryChange,
  selectedCategory,
}: FilterCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => onCategoryChange(undefined)}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          !selectedCategory
            ? "bg-purple-600 text-white scale-105"
            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:scale-105"
        }`}
      >
        All Categories
      </button>

      {categories.map((category) => (
        <button
          key={category.category_id}
          onClick={() => onCategoryChange(category.category_id)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            selectedCategory === category.category_id
              ? "bg-purple-600 text-white scale-105"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:scale-105"
          }`}
        >
          {category.category_name}
        </button>
      ))}
    </div>
  );
}
