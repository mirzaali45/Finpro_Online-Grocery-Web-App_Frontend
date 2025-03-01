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

interface Props {
  selectedAddress: Address;
}

// Define courier type
interface Courier {
  shipping_name: string;
  shipping_cost: number;
  value?: string;
  label?: string;
}

export default function ItemOrder({ selectedAddress }: Props) {
  const { profile } = ProfileServices();
  const { load, addressData } = Services2();
  const [cartData, setCartData] = useState<CartData[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couriers, setCouriers] = useState<Courier[]>([]);

  const getCourier = async () => {
    try {
      setIsLoading(true);
      // const userId = localStorage.getItem("user_id");
      // if (!userId) throw new Error("Please login to view your cart");

      // Convert postcode to number if it's a string
      const postcode = selectedAddress?.postcode
        ? parseInt(selectedAddress.postcode, 10)
        : 0;

      const response = await CheckPricing(postcode, 40973); //nanti angka 40973 ini diganti dengan postcode store
      const resCargo = response.data?.calculate_cargo || [];
      const resRegular = response.data?.calculate_reguler || [];
      setCouriers([...resCargo, ...resRegular]);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (addressData && selectedAddress) {
      getCourier();
    }
  }, [addressData, selectedAddress]);

  return (
    <div className="w-full p-4 rounded shadow bg-gray-600 my-2">
      {/* Product Detail Here */}
      <div className="px-2">
        <label className="text-white font-bold text-lg">Courier Delivery</label>
        <ReactSelect
          className="text-black"
          placeholder="Choose Courier Delivery"
          options={couriers.map((val: Courier) => ({
            ...val,
            value: val.shipping_name,
            label: `${val.shipping_name} - ${val.shipping_cost
              .toLocaleString()
              ?.replaceAll(",", ".")}`,
          }))}
        />
      </div>
    </div>
  );
}
