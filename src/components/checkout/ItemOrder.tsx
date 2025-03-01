import { fetchCartId } from "@/services/cart.service";
import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";
import { productService } from "@/services/product.service";
import ProfileServices from "@/services/profile/services1";
import Services2 from "@/services/profile/services2";
import { Address } from "@/types/address-types";
import { CartData } from "@/types/cart-types";
import { Product } from "@/types/product-types";
import { MapPin } from "lucide-react";
import ReactSelect from "react-select";
import React, { useEffect, useState } from "react";

interface CourierOption {
  shipping_name: string;
  shipping_cost: number;
  value: string;
  label: string;
}

interface Props {
  selectedAddress: Address;
}

export default function ItemOrder({ selectedAddress }: Props) {
  const { profile } = ProfileServices();
  const { load, addressData } = Services2();
  const [cartData, setCartData] = useState<CartData[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couriers, setCouriers] = useState<CourierOption[]>([]);

  // Store postcode (replace with actual store postcode)
  const STORE_POSTCODE = 40973;

  const getCourier = async () => {
    try {
      setIsLoading(true);
      // Ensure postcode is converted to a number
      const customerPostcode = selectedAddress?.postcode
        ? parseInt(selectedAddress.postcode, 10)
        : STORE_POSTCODE;

      const response = await CheckPricing(customerPostcode, STORE_POSTCODE);

      const resCargo = response.data?.calculate_cargo || [];
      const resRegular = response.data?.calculate_reguler || [];

      const formattedCouriers: CourierOption[] = [
        ...resCargo,
        ...resRegular,
      ].map((courier) => ({
        ...courier,
        value: courier.shipping_name,
        label: `${courier.shipping_name} - ${courier.shipping_cost
          .toLocaleString()
          .replaceAll(",", ".")}`,
      }));

      setCouriers(formattedCouriers);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load courier options"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (addressData && selectedAddress?.postcode) {
      getCourier();
    }
  }, [addressData, selectedAddress]);

  return (
    <div className="w-full p-4 rounded shadow bg-gray-600 my-2">
      <div className="px-2">
        <label className="text-white font-bold text-lg">Courier Delivery</label>
        <ReactSelect
          className="text-black"
          placeholder="Choose Courier Delivery"
          options={couriers}
        />
      </div>
    </div>
  );
}
