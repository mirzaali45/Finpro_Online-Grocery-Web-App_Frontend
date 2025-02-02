
import { StoreData } from "@/types/store-types";
import StoreCard from "./StoreCard";

interface StoreListProps {
  stores: StoreData[];
  onDeleteStore: (storeId: number) => void;
}

export default function StoreList({ stores, onDeleteStore }: StoreListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.store_id}
          store={store}
          onDelete={onDeleteStore}
        />
      ))}
    </div>
  );
}
