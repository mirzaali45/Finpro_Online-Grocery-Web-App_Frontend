// components/store-management/AddStoreModal.tsx
import { Store } from "lucide-react";
import { useStoreForm } from "@/helper/use-store-form";
import AddStoreForm from "./AddStoreForm";
import { storeService } from "@/components/hooks/useStoreAdmin";
import Swal from "sweetalert2";
import { useState } from "react";

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStoreModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStoreModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, errors, handleChange, validateForm, setFormData } =
    useStoreForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm()) {
        await storeService.createStore(formData);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Store created successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create store";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center rounded-t-lg">
          <Store className="h-8 w-8 mr-4" />
          <h2 className="text-2xl font-bold">Add New Store</h2>
          <button
            onClick={onClose}
            className="ml-auto text-white hover:text-gray-200 focus:outline-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <AddStoreForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
