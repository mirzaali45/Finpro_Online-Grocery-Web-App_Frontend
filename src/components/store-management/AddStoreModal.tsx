import { Store } from "lucide-react";
import { useStoreForm } from "@/helper/use-store-form";
import AddStoreForm from "./AddStoreForm";
import { storeService } from "@/components/hooks/useStoreAdmin";
import Swal from "sweetalert2";
import { useState } from "react";

interface Formdata {
  store_name: string,
  address: string,
  subdistrict: string,
  city: string,
  province: string,
  postcode: string,
  latitude?: number,
  longitude?: number,
  user_id?: number,
}

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formData: Formdata,
  errors: string | null,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  validateForm: (data: FormData) => boolean,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export default function AddStoreModal({
  isOpen,
  onClose,
  onSuccess,
  formData,
  errors,
  handleChange,
  validateForm,
  setFormData
}: AddStoreModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Success!' : 'Oops...',
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
      await storeService.createStore(formData);
      showNotification('success', 'Store created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create store";
        // console.log(error)
      showNotification('error', errorMessage);
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
            aria-label="Close modal"
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