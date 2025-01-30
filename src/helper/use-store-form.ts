// hooks/use-store-form.ts
import { useState } from "react";
import { StoreData } from "@/types/store-types";

const initialFormData: StoreData = {
  store_name: "",
  address: "",
  subdistrict: "",
  city: "",
  city_id: "",
  province: "",
  province_id: "",
  postcode: "",
  latitude: undefined,
  longitude: undefined,
  user_id: undefined,
};

interface FormErrors {
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id: string;
  province: string;
  province_id: string;
  postcode: string;
}

const initialErrors: FormErrors = {
  store_name: "",
  address: "",
  subdistrict: "",
  city: "",
  city_id: "",
  province: "",
  province_id: "",
  postcode: "",
};

export const useStoreForm = () => {
  const [formData, setFormData] = useState<StoreData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };

    // Validate each required field
    if (!formData.store_name.trim()) {
      newErrors.store_name = "Store name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.subdistrict.trim()) {
      newErrors.subdistrict = "Subdistrict is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.city_id.trim()) {
      newErrors.city_id = "City ID is required";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    }

    if (!formData.province_id.trim()) {
      newErrors.province_id = "Province ID is required";
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    }

    setErrors(newErrors);

    // Check if any errors exist
    return Object.values(newErrors).every((error) => error === "");
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
  };
};
