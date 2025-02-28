"use client";
import { useAddressCustomer } from "@/components/hooks/useAddressCustomer";
import { Address, AddressAdd } from "@/types/address-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
type ToastType = "success" | "error" | "info" | "warning";

interface AddressListResponse {
  data: Address[];
  status?: string;
  message?: string;
}

interface AddressResponse {
  status: string;
  message: string;
  data?: Address;
}

interface DeleteAddressResponse {
  ok: boolean;
  status?: string;
  message?: string;
}

const Services2 = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    GetAddress();
  }, []);

  const showToast = (
    message: string,
    type: ToastType,
    closeTime = 3000,
    onClose?: () => void
  ) => {
    toast.dismiss();
    toast[type](message, {
      position: "bottom-right",
      autoClose: closeTime,
      theme: "colored",
      hideProgressBar: false,
      onClose,
    });
  };

  const GetAddress = async () => {
    setLoad(true);
    try {
      const rawResponse = await useAddressCustomer.getAddress();
      if (
        rawResponse &&
        typeof rawResponse === "object" &&
        "data" in rawResponse
      ) {
        const response = rawResponse as unknown as AddressListResponse;
        setAddressData(response.data);
      } else {
        // If the response is directly an array of addresses
        setAddressData(rawResponse as unknown as Address[]);
      }
    } catch (error) {
      showToast("Failed to get user data.", "error");
    } finally {
      setLoad(false);
    }
  };

  const addAddress = async (formData: AddressAdd) => {
    try {
      // Type safety check for the API call
      const rawResponse = await useAddressCustomer.createAddress(
        formData as unknown as Address
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () => location.reload());
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (error) {
      showToast("Failed to Create new address.", "error");
    }
  };

  const setPrimaryAddressEdit = async (addres_id: number) => {
    try {
      const rawResponse = await useAddressCustomer.updatePrimaryAddress(
        addres_id
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () => location.reload());
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (error) {
      showToast(`Failed to Edit address: ${error}`, "error");
    }
  };

  const editAddress = async (addres_id: number, formData: Address) => {
    try {
      const rawResponse = await useAddressCustomer.updateAddress(
        addres_id,
        formData
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () => location.reload());
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (error) {
      showToast(`Failed to Edit address: ${error}`, "error");
    }
  };

  const deleteAddress = async (address_id: number) => {
    try {
      const rawResponse = await useAddressCustomer.deleteAddress(address_id);
      const response = rawResponse as unknown as DeleteAddressResponse;

      if (response && response.ok) {
        showToast("Success Delete Address.", "success", 1500, () =>
          location.reload()
        );
      }
    } catch (error) {
      showToast("Failed to delete address.", "error");
    }
  };

  return {
    load,
    addressData,
    setAddressData,
    setPrimaryAddressEdit,
    addAddress,
    editAddress,
    deleteAddress,
  };
};

export default Services2;
