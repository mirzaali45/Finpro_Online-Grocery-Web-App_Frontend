"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { storeService } from "@/services/store-admin.service";
import { StoreData } from "@/types/store-types";
import StoreList from "@/components/store-management/StoreList";
import AddStoreModal from "@/components/store-management/AddStoreModal";
import { UserManagementService } from "@/services/user-management.service";
import { User } from "@/types/user-types";

import { withAuth } from "@/components/high-ordered-component/AdminGuard";
import DeleteStoreModal from "@/components/store-management/DeleteStoreModal";

function StoreDashboard() {
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);
  const handleSuccess = () => {
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
    fetchUsers();
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

  const confirmDeleteStore = (storeId: number) => {
    setStoreToDelete(storeId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStore = async () => {
    if (storeToDelete !== null) {
      try {
        await storeService.deleteStore(storeToDelete);
        await fetchStores();
      } catch (error) {
        console.error("Error deleting store:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setStoreToDelete(null);
      }
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
      {/* Sidebar: tetap ada di layar besar, bisa disembunyikan di mobile */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Konten utama dengan margin kiri dinamis */}
      <div className="p-4 sm:p-6 md:p-8 ml-0 sm:ml-[16rem]">
        <div className="max-w-7xl mx-auto">
          {/* Header dengan layout fleksibel */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Store Management
                </h1>
                <p className="text-gray-600">Overview of all your stores</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Store
              </button>
            </div>
          </header>

          {/* List store dengan responsivitas */}
          <StoreList
            stores={stores}
            onDeleteStore={confirmDeleteStore}
            handleSuccess={handleSuccess}
            users={storeAdmins}
          />

          {/* Modal Tambah Store */}
          <AddStoreModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
            users={storeAdmins}
          />

          {/* Modal Hapus Store */}
          <DeleteStoreModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteStore}
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
