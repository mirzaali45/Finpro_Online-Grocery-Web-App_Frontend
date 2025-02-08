
import { StoreData } from "@/types/store-types";
import StoreCard from "./StoreCard";
import EditStoreModal from "./EditStoreModal";
import { useState } from "react";
import { storeService } from "../hooks/useStoreAdmin";
import { Pencil } from "lucide-react";

interface StoreListProps {
  stores: StoreData[];
  onDeleteStore: (storeId: number) => void;
}

export default function StoreList({ stores, onDeleteStore }: StoreListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataStore, setDataStore] = useState({
    store_id: "",
    store_name: "",
    subdistrict: "",
    city: "",
    province: "",
    address: "",
    postcode: "",
    latitude: "",
    longitude: "",
  })
  const handleSuccess = () => {
    location.reload()
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.store_id}
          store={store}
          editButton={
            <>
            <button
                onClick={() => {
                  setDataStore({
                    ...dataStore,
                    store_id: String(store.store_id),
                    store_name: store.store_name,
                    subdistrict: store.subdistrict,
                    city: store.city,
                    province: store.province,
                    address: store.address,
                    postcode: store.postcode,
                    latitude: String(store.latitude),
                    longitude: String(store.longitude),
                  })
                  setIsModalOpen(true)
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
              <Pencil size={18} />
            </button>
            </>
          }
          onDelete={onDeleteStore}
        />
      ))}
      
      <EditStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        dataStore={dataStore}
      />
    </div>
  );
}
