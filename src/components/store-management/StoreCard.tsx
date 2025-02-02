
import { Trash2 } from "lucide-react";
import { StoreData } from "@/types/store-types";

interface StoreCardProps {
  store: StoreData;
  onDelete: (storeId: number) => void;
}

export default function StoreCard({ store, onDelete }: StoreCardProps) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      onDelete(store.store_id!);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {store.store_name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">{store.address}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 p-1"
          title="Delete store"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
