
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { storeService } from "@/components/hooks/useStoreAdmin";
import { StoreData } from "@/types/store-types";
import StoreList from "@/components/store-management/StoreList";
import AddStoreModal from "@/components/store-management/AddStoreModal";
import HeaderSuperAdmin from "@/components/headerSuperAdmin";
import { useStoreForm } from "@/helper/use-store-form";

export default function StoreDashboard() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formData, errors, handleChange, validateForm, setFormData } = useStoreForm();
  const handleSuccess = () => {
    location.reload()
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const data = await storeService.getStores();
      setStores(data);
      console.log(data)
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
      alert('gagal menghapus: ' + error.message || "")
      console.error("Error deleting store:", error);
    }
  };
  const resetForm = () => {
    setFormData({
      store_name: "",
      address: "",
      subdistrict: "",
      city: "",
      province: "",
      postcode: "",
      latitude: undefined,
      longitude: undefined,
      user_id: undefined,
    });
    console.log('close')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <HeaderSuperAdmin setIsSidebarOpen={setIsSidebarOpen} setIsProfileDropdownOpen={setIsProfileDropdownOpen} isProfileDropdownOpen={isProfileDropdownOpen} />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
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
             formData={formData}
             errors={errors}
             handleChange={handleChange}
             validateForm={validateForm}
             setFormData={setFormData}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              resetForm()
            }}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
