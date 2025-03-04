import React, { useEffect, useState } from "react";
import {
  fetchCartId,
  updateCartItem,
  removeFromCart,
} from "@/services/cart.service";
import ProfileServices from "@/services/profile/services1";
import Services2 from "@/services/profile/services2";
import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";
import ReactSelect from "react-select";
import Image from "next/image";
import { toast } from "react-toastify";
import { formatRupiah } from "@/helper/currencyRp";
import CartTotal from "./PaymentOrder"; 
import { Address } from "@/types/address-types";
import { CartData } from "@/types/cart-types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CourierOption } from "@/types/courir-types";
import { calculateDiscountedPrice, ProductWithDiscount } from "@/types/calculateDiscount-types";


interface Props {
  selectedAddress: Address;
}

const ItemOrder: React.FC<Props> = ({ selectedAddress }) => {
  const { profile } = ProfileServices();
  const { load, addressData } = Services2();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [selectedCourierValue, setSelectedCourierValue] = useState<string>("");

  const STORE_POSTCODE = 40973;

  const getCourier = async () => {
    try {
      setIsLoading(true);
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

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCartId(profile?.userId);
      if (!response || !response.data) throw new Error("Invalid cart data");
      setCartData(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (addressData && selectedAddress?.postcode) getCourier();
    loadCart();
  }, [addressData, selectedAddress]);

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(cartItemId);
      await updateCartItem(cartItemId, newQuantity);
      await loadCart();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId);
      await loadCart();
      toast.success("Deleted item from cart");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="w-full p-4 rounded shadow bg-gray-600 my-2">
      <div className="px-2">
        <label className="text-white font-bold text-lg">Courier Delivery</label>
        <ReactSelect
          className="text-black"
          placeholder="Choose Courier Delivery"
          options={couriers}
          onChange={(selectedOption) =>
            setSelectedCourierValue(selectedOption?.value || "")
          }
        />
      </div>

      <div className="mt-4">
        <h2 className="text-white font-bold text-lg mb-2">Your Cart</h2>
        {isLoading ? (
          <p className="text-white">Loading cart...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : cartData?.items?.length ? (
          cartData.items.map((item) => {
            const productWithDiscount =
              item.product as unknown as ProductWithDiscount;
            const hasDiscount =
              productWithDiscount.Discount &&
              productWithDiscount.Discount.length > 0;
            const discountedPrice =
              calculateDiscountedPrice(productWithDiscount);
            return (
              <div
                key={item.cartitem_id}
                className="flex items-center justify-between bg-gray-700 p-2 rounded-lg mb-2"
              >
                <Image
                  src={
                    item.product.ProductImage[0]?.url ||
                    "/product-placeholder.jpg"
                  }
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="rounded"
                />
                <div className="flex-1 ml-2">
                  <span className="text-white block">{item.product.name}</span>
                  {hasDiscount ? (
                    <div className="flex items-center text-sm">
                      <span className="text-red-400 line-through mr-2">
                        {formatRupiah(item.product.price)}
                      </span>
                      <span className="text-green-400">
                        {formatRupiah(discountedPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white">
                      {formatRupiah(item.product.price)}
                    </span>
                  )}
                </div>
                <div
                  key={item.cartitem_id}
                  className="flex items-center justify-between bg-gray-700 p-2 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.cartitem_id,
                          item.quantity - 1
                        )
                      }
                      disabled={isUpdating === item.cartitem_id}
                    >
                      <Minus size={14} className="text-white" />
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.cartitem_id,
                          item.quantity + 1
                        )
                      }
                      disabled={isUpdating === item.cartitem_id}
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.cartitem_id)}
                    disabled={isUpdating === item.cartitem_id}
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white">Your cart is empty</p>
        )}
      </div>

      {/* Cart Total Component */}
      <CartTotal
        items={cartData?.items || []}
        couriers={couriers}
        selectedCourierValue={selectedCourierValue}
      />
    </div>
  );
};

export default ItemOrder;
