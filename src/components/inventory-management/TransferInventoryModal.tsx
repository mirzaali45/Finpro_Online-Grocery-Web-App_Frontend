// components/inventory-management/TransferInventoryModal.tsx
import { useState } from "react";
import { Inventory } from "@/types/inventory-types";
import { CircleXIcon, RotateCw } from "lucide-react";

interface TransferInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: Inventory;
  onSubmit: (invId: number, transferAmount: number) => Promise<void>;
}

const TransferInventoryModal = ({
  isOpen,
  onClose,
  inventory,
  onSubmit,
}: TransferInventoryModalProps) => {
  const [transferAmount, setTransferAmount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !inventory) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (transferAmount <= 0) {
      setError("Transfer amount must be greater than zero");
      return;
    }

    if (transferAmount > inventory.qty) {
      setError(`Maximum available warehouse stock is ${inventory.qty}`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(inventory.inv_id, transferAmount);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Transfer Inventory
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <CircleXIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {inventory.product.name}
            </h3>
            <p className="text-gray-500 mb-4">
              Store: {inventory.store.store_name}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Warehouse Stock</p>
                <p className="text-xl font-semibold">{inventory.qty}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Store Stock</p>
                <p className="text-xl font-semibold">{inventory.total_qty}</p>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="transferAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transfer Amount
              </label>
              <input
                type="number"
                id="transferAmount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                min="1"
                max={inventory.qty}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will transfer items from warehouse to store front
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isSubmitting ? "Processing..." : "Transfer Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferInventoryModal;
