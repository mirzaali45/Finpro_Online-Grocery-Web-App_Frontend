// components/category-management/CategoryCard.tsx
import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types/category-types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{category.category_name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {category.description}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Total Products: {category.Product?.length || 0}
      </p>
    </div>
  );
}
