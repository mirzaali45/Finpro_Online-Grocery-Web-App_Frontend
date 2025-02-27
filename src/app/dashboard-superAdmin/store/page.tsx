"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { storeService } from "@/services/store-admin.service";
import { StoreData } from "@/types/store-types";
import StoreList from "@/components/store-management/StoreList";
import AddStoreModal from "@/components/store-management/AddStoreModal";
import { UserManagementService } from "@/services/user-management.service";
import { User } from "@/types/user-types";

export default function StoreDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StoreData>({
    store_name: "",
    address: "",
    subdistrict: "",
    city: "",
    province: "",
    postcode: "",
  });
  const [storeAdmins, setStoreAdmins] = useState<User[]>([]);
  const handleSuccess = () => {
    fetchStores(); // Refresh the stores list
  };

  useEffect(() => {
    fetchStores();
    fetchUsers()
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

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getAllStoreAdmin();
      setStoreAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await storeService.createStore(formData);
      await fetchStores();
      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error("Error creating store:", error);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      store_name: "",
      address: "",
      subdistrict: "",
      city: "",
      province: "",
      postcode: "",
      description: "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
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
      <div className="p-8 ml-[20rem]">
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

          <StoreList
            stores={stores}
            onDeleteStore={handleDeleteStore}
            handleSuccess={handleSuccess}
            users={storeAdmins}
          />

          <AddStoreModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
            users={storeAdmins}
          />
        </div>
      </div>
    </div>
  );
}
