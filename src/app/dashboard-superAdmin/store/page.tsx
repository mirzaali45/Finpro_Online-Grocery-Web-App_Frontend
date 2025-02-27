"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { storeService } from "@/services/store-admin.service";
import { StoreData } from "@/types/store-types";
import StoreList from "@/components/store-management/StoreList";
import AddStoreModal from "@/components/store-management/AddStoreModal";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";

function StoreDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await storeService.getStores();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId: number) => {
    try {
      await storeService.deleteStore(storeId);
      await fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="p-8 ml-[5rem]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Store Management
                </h1>
                <p className="text-gray-600">Overview of all your stores</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Store
              </button>
            </div>
          </header>

          <StoreList stores={stores} onDeleteStore={handleDeleteStore} />

          <AddStoreModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
export default withAuth(StoreDashboard, {
  allowedRoles: ["super_admin"],
  redirectPath: "/not-authorized-superadmin",
});

