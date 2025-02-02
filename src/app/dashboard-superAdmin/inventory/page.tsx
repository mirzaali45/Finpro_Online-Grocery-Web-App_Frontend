"use client"

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebarSuperAdmin";
import { Plus } from "lucide-react";
import type { Inventory, CreateInventoryRequest, UpdateInventoryRequest } from "@/types/inventory-types";
import { InventoryService } from "@/services/useInventoryAdmin";
import InventoryTable from "@/components/inventory-management/InventoryTable";
import CreateInventoryModal from "@/components/inventory-management/CreateInventoryModal";
import UpdateInventoryModal from "@/components/inventory-management/UpdateInventoryModal";
import { toast } from "sonner";

export default function Inventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inventoryData, setInventoryData] = useState<Inventory[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const data = await InventoryService.getInventory();
      setInventoryData(data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateInventory = async (formData: CreateInventoryRequest) => {
    try {
      await InventoryService.createInventory(formData);
      toast.success('Inventory created successfully');
      fetchInventory();
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to create inventory');
    }
  };

  const handleUpdateInventory = async (invId: number, formData: UpdateInventoryRequest) => {
    try {
      await InventoryService.updateInventory(invId, formData);
      toast.success('Inventory updated successfully');
      fetchInventory();
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };

  const handleDeleteInventory = async (invId: number) => {
    if (!confirm('Are you sure you want to delete this inventory?')) return;
    
    try {
      await InventoryService.deleteInventory(invId);
      toast.success('Inventory deleted successfully');
      fetchInventory();
    } catch (error) {
      toast.error('Failed to delete inventory');
    }
  };

  const handleEdit = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className={`${isSidebarOpen ? "md:ml-20" : ""}`}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <main className="p-8 ml-[10vw]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Inventory
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {inventoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No inventory items found</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add First Item
                  </button>
                </div>
              ) : (
                <InventoryTable
                  inventoryData={inventoryData}
                  onEdit={handleEdit}
                  onDelete={handleDeleteInventory}
                />
              )}
            </div>
          )}

          {/* Create Inventory Modal */}
          <CreateInventoryModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateInventory}
          />

          {/* Update Inventory Modal */}
          <UpdateInventoryModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedInventory(undefined);
            }}
            inventory={selectedInventory}
            onSubmit={handleUpdateInventory}
          />
        </main>
      </div>
    </div>
  );
}