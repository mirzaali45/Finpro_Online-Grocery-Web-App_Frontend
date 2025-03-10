"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useOrders } from "@/components/hooks/useOrders";
import { Order } from "@/types/orders-types";
import Services2 from "@/services/profile/services2";
import { Address } from "@/types/address-types";
import { Voucher } from "@/types/voucher-types";
import OrderSummary from "@/components/ordered-component/OrderSummary";
import ShippingMethodCard from "@/components/ordered-component/ShippingMethod";
import OrderDetailsCard from "@/components/ordered-component/OrderDetailsCard";
import ShippingInfoCard from "@/components/ordered-component/ShippingInfoCard";
import PageHeader from "@/components/ordered-component/PageHeader";
import OrderConfirmationBanner from "@/components/ordered-component/OrderConfirmationBanner";
import EmptyOrderState from "@/components/ordered-component/EmptyOrderState";
import VoucherSelector from "@/components/ordered-component/VoucherSelector";
import { getAuthToken } from "@/utils/forAuth";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { voucherService } from "@/services/voucher.service";

// Define CourierOption type
export interface CourierOption {
  shipping_name: string;
  shipping_cost: number;
  value: string;
  label: string;
  [key: string]: any;
}

export default function OrderedPage() {
  const router = useRouter();
  const { load, addressData } = Services2();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { fetchLatestOrder, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      setSelectedAddress(
        addressData.find((val: Address) => val.is_primary === true) ||
          addressData[0]
      );
    }
  }, [addressData]);

  // Calculate the total price including all factors
  const calculateTotalPrice = (): number => {
    if (!order) return 0;

    let basePrice = 0;

    if (order.items && order.items.length > 0) {
      basePrice = order.items.reduce((total, item) => {
        return total + item.price * (item.quantity || 1);
      }, 0);
    } else {
      basePrice = order.total_price;
    }

    const shippingCost = selectedCourier ? selectedCourier.shipping_cost : 0;

    let discountAmount = 0;
    if (selectedVoucher) {
      if (selectedVoucher.discount.discount_type === "percentage") {
        discountAmount = Math.round(
          (basePrice * selectedVoucher.discount.discount_value) / 100
        );
      } else {
        discountAmount = selectedVoucher.discount.discount_value;
      }
    }

    const finalPrice = basePrice + shippingCost - discountAmount;

    return Math.max(0, finalPrice);
  };

  // Calculate discount amount
  const calculateDiscount = (): number => {
    if (!selectedVoucher || !order) return 0;

    const basePrice = order.total_price;

    if (selectedVoucher.discount.discount_type === "percentage") {
      return Math.round(
        (basePrice * selectedVoucher.discount.discount_value) / 100
      );
    } else {
      return selectedVoucher.discount.discount_value;
    }
  };

  // Get final price for display
  const getFinalPrice = (): number => {
    return calculateTotalPrice();
  };

  // Update order in database with calculated price
  const updateDatabasePrice = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication error");
        return;
      }

      const newTotalPrice = calculateTotalPrice();

      console.log("Updating database price:", {
        basePrice: order.total_price,
        shippingCost: selectedCourier?.shipping_cost || 0,
        discount: selectedVoucher ? calculateDiscount() : 0,
        finalPrice: newTotalPrice,
      });

      const result = await orderService.updateOrder(
        token,
        order.order_id,
        newTotalPrice
      );

      console.log("Update order result:", result);

      const latestOrder = await fetchLatestOrder();
      if (latestOrder) {
        setOrder(latestOrder);
        console.log(
          "Order updated, new database price:",
          latestOrder.total_price
        );
      } else {
        console.error("Failed to fetch updated order");
        toast.error("Could not refresh order data");
      }
    } catch (error) {
      console.error("Failed to update order total price:", error);
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle courier selection
  const handleCourierChange = async (courier: CourierOption | null) => {
    setSelectedCourier(courier);

    if (!order) return;

    try {
      await updateDatabasePrice();
      toast.success(`Shipping method updated: ${courier?.shipping_name}`);
    } catch (error) {
      console.error("Error updating shipping method:", error);
      toast.error("Failed to update shipping method");
    }
  };

  // Handle voucher selection
  const handleSelectVoucher = async (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);

    if (!order) return;
    setApplyingVoucher(true);

    try {
      if (voucher) {
        const useVoucherResult = await voucherService.useVoucher(
          voucher.voucher_code,
          order.order_id
        );

        if (useVoucherResult.success) {
          const latestOrder = await fetchLatestOrder();
          if (latestOrder) {
            setOrder(latestOrder);
            toast.success(
              `Voucher ${voucher.voucher_code} applied successfully!`
            );
          }
        } else {
          toast.error(useVoucherResult.message || "Could not apply voucher");
          setSelectedVoucher(null);
        }
      } else {
        await updateDatabasePrice();
        toast.success("Voucher removed");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error("Failed to apply voucher");
      setSelectedVoucher(null);
    } finally {
      setApplyingVoucher(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: number) => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      const latestOrder = await fetchLatestOrder();
      if (latestOrder) {
        setOrder(latestOrder);
        toast.success("Order cancelled successfully.");

        // Redirect to the Home page after canceling the order
        router.push("/"); // This line will redirect to the Home page
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle payment initiation
  const handleInitiatePayment = async () => {
    if (!order || !selectedCourier) {
      toast.error(
        "Please select a shipping method before proceeding to payment"
      );
      return;
    }

    await updateDatabasePrice();

    setIsUpdating(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication error");
        return;
      }

      const shippingMethod = {
        name: selectedCourier.shipping_name,
        cost: selectedCourier.shipping_cost,
      };

      const finalPrice = getFinalPrice();

      console.log("Initiating payment:", {
        orderId: order.order_id,
        databasePrice: order.total_price,
        finalCalculatedPrice: finalPrice,
        shippingMethod,
        discount: selectedVoucher ? calculateDiscount() : 0,
      });

      const paymentResponse = await paymentService.initiatePayment(
        token,
        order.order_id,
        shippingMethod
      );

      if (paymentResponse.success && paymentResponse.payment_url) {
        window.location.href = paymentResponse.payment_url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("An error occurred during payment initiation");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const latestOrder = await fetchLatestOrder();

        if (latestOrder) {
          setOrder(latestOrder);
        } else {
          toast.error("Could not find your order");
          router.push("/orders");
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
        toast.error("There was a problem fetching your order");
      }
    };

    getLatestOrder();
  }, [fetchLatestOrder, router]);

  if (!order) {
    return <EmptyOrderState />;
  }

  const totalItems = order.items
    ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
        <PageHeader />
        <OrderConfirmationBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <ShippingMethodCard
              selectedAddress={selectedAddress}
              setSelectedCourier={setSelectedCourier}
              onCourierSelect={handleCourierChange}
              defaultCourier={null}
            />
            <div>
              <VoucherSelector
                selectedVoucher={selectedVoucher}
                onSelectVoucher={handleSelectVoucher}
                storeId={order.store?.store_id}
                orderTotal={order.total_price}
                isLoading={applyingVoucher}
              />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-white mb-3">
                After selecting shipping method and applying voucher, click the
                button below to update the price in the database:
              </p>
              <button
                onClick={updateDatabasePrice}
                disabled={isUpdating}
                className={`w-full ${
                  isUpdating
                    ? "bg-blue-800 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                } text-white py-2 px-4 rounded-lg font-medium transition-colors`}
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    <span>Updating Price...</span>
                  </div>
                ) : (
                  "Update Database Price"
                )}
              </button>
            </div>
            <OrderDetailsCard order={order} />
            {order.shipping && (
              <ShippingInfoCard
                shipping={order.shipping}
                addressData={addressData}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            )}
          </div>
          <div>
            <OrderSummary
              order={order}
              totalItems={totalItems}
              selectedCourier={selectedCourier}
              selectedVoucher={selectedVoucher}
              calculateDiscount={calculateDiscount}
              getFinalPrice={getFinalPrice}
              handleCancelOrder={handleCancelOrder}
              isCancelling={isCancelling}
              setOrder={setOrder}
              onInitiatePayment={handleInitiatePayment}
              isUpdating={isUpdating || applyingVoucher}
            />
          </div>
        </div>
      </div>
    </div>
  );
}