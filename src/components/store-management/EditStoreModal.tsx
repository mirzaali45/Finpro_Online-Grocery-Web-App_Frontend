import { Store } from "lucide-react";
import { User } from "@/types/user-types";
import { useStoreForm } from "@/helper/use-store-form";
import { storeService } from "@/components/hooks/useStoreAdmin";
import { storeAdminService } from "@/services/fetch-store-admin.service";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditStoreForm from "./EditStoreForm";
import {
  StoreData,
  EditData,
  FormErrors,
  FormErrorsWithIndex,
  StoreAdmin,
} from "@/types/store-types";

// Remove the local interface definition since it's defined in EditStoreForm.tsx

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataStore: StoreData;
  users: User[]; 
}

export default function EditStoreModal({
  isOpen,
  onClose,
  onSuccess,
  dataStore,
  users,
}: EditStoreModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);
  const { formData, errors, handleChange, validateForm, setFormData } =
    useStoreForm() as {
      formData: StoreData;
      errors: FormErrorsWithIndex;
      handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void;
      validateForm: () => boolean;
      setFormData: React.Dispatch<React.SetStateAction<StoreData>>;
    };
  const [firstData, setFirstData] = useState(false);

  // Fetch store admins when modal opens
  useEffect(() => {
    if (isOpen) {
      storeAdminService
        .getStoreAdmins()
        .then(setStoreAdmins)
        .catch((error) => {
          showNotification("error", "Failed to fetch store admins");
          console.error(error);
        });
    }
  }, [isOpen]);

  const showNotification = (type: "success" | "error", message: string) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Success!" : "Oops...",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (!dataStore.store_id) {
        throw new Error("Store ID is missing");
      }

      // Create a new object with required fields ensuring they're not undefined
      // Using the EditData type from your store-types
      const editData: EditData = {
        store_name: formData.store_name || dataStore.store_name,
        address: formData.address || dataStore.address,
        subdistrict: formData.subdistrict || dataStore.subdistrict,
        city: formData.city || dataStore.city,
        province: formData.province || dataStore.province,
        postcode: formData.postcode || dataStore.postcode,
        latitude: formData.latitude ?? dataStore.latitude ?? 0,
        longitude: formData.longitude ?? dataStore.longitude ?? 0,
        user_id: formData.user_id || dataStore.user_id || null,
      };

      await storeService.editStore(editData, dataStore.store_id);
      showNotification("success", "Store edited successfully");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to edit store";
      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !firstData) {
      setFormData(dataStore);
      setFirstData(true);
    }
  }, [isOpen, firstData, setFormData, dataStore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center rounded-t-lg">
          <Store className="h-8 w-8 mr-4" />
          <h2 className="text-2xl font-bold">Edit Store</h2>
          <button
            onClick={() => {
              setFirstData(false);
              onClose();
            }}
            className="ml-auto text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <EditStoreForm
            formData={formData}
            dataStore={dataStore}
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
