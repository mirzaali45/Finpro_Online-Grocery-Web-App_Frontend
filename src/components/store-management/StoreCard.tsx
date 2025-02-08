
import { Pencil, Trash2 } from "lucide-react";
import { StoreData } from "@/types/store-types";
import { ReactNode } from "react";

interface StoreCardProps {
  store: StoreData;
  editButton: ReactNode;
  onDelete: (storeId: number) => void;
}

export default function StoreCard({ store, onDelete, editButton }: StoreCardProps) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      onDelete(store.store_id!);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold  mb-2">
            {store.store_name}
          </h2>
          <p className="text-sm  mb-1">{store.address}</p>
        </div>
        <div className="flex gap-5">
        {editButton}
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 p-1"
          title="Delete store"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        </div>
      </div>
    </div>
  );
}
