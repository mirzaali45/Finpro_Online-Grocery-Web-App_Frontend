"use client";

import { Inventory, UpdateInventoryRequest } from "@/types/inventory-types";
import { useState, useEffect } from "react";
import Modal from "@/components/inventory-management/ModalInventory";
import { Plus, Minus, RotateCw } from "lucide-react";

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: Inventory;
  onSubmit: (invId: number, data: UpdateInventoryRequest) => Promise<void>;
}

export default function UpdateInventoryModal({
  isOpen,
  onClose,
  inventory,
  onSubmit,
}: UpdateInventoryModalProps) {
  const [formData, setFormData] = useState<UpdateInventoryRequest>({
    qty: 0,
    operation: "add",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inventory) {
      setFormData({
        qty: 0,
        operation: "add",
      });
      setError(null);
    }
  }, [inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventory) return;

    // Validation
    if (formData.qty <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    if (formData.operation === "subtract" && formData.qty > inventory.qty) {
      setError(`Cannot subtract more than current stock (${inventory.qty})`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(inventory.inv_id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating inventory:", error);
      setError("Failed to update inventory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inventory) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Inventory: ${inventory.product.name}`}
    >
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded mr-2 font-medium dark:bg-blue-900/30 dark:text-blue-300">
            {inventory.product.category.category_name}
          </span>
          <span>{inventory.store.store_name}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Stock
            </p>
            <p className="text-xl font-semibold">{inventory.qty}</p>
          </div>

          {formData.operation === "add" ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                After Update
              </p>
              <p className="text-xl font-semibold text-green-700 dark:text-green-400">
                {inventory.qty + formData.qty}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                After Update
              </p>
              <p className="text-xl font-semibold text-amber-700 dark:text-amber-400">
                {Math.max(0, inventory.qty - formData.qty)}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Operation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`flex justify-center items-center gap-2 px-4 py-2 border rounded-md ${
                  formData.operation === "add"
                    ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setFormData({ ...formData, operation: "add" })}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
              <button
                type="button"
                className={`flex justify-center items-center gap-2 px-4 py-2 border rounded-md ${
                  formData.operation === "subtract"
                    ? "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() =>
                  setFormData({ ...formData, operation: "subtract" })
                }
              >
                <Minus className="h-4 w-4" />
                Subtract
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Quantity
            </label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min={1}
              required
            />
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {formData.operation === "add"
                ? "Enter the quantity to add to current stock"
                : "Enter the quantity to remove from current stock"}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center gap-2 min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
