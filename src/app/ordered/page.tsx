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
import LoadingState from "@/components/ordered-component/LoadingState";
import EmptyOrderState from "@/components/ordered-component/EmptyOrderState";
import VoucherSelector from "@/components/ordered-component/VoucherSelector";
import { getAuthToken } from "@/utils/forAuth";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";

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
  const { isLoading, fetchLatestOrder, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

    // Start with the base product price (from order items)
    let basePrice = 0;

    // Calculate base price from items if available
    if (order.items && order.items.length > 0) {
      basePrice = order.items.reduce((total, item) => {
        return total + item.price * (item.quantity || 1);
      }, 0);
    } else {
      // If items aren't available, use the order's total_price as base
      basePrice = order.total_price;
    }

    // Add shipping cost if a courier is selected
    const shippingCost = selectedCourier ? selectedCourier.shipping_cost : 0;

    // Calculate discount amount
    let discountAmount = 0;
    if (selectedVoucher) {
      if (selectedVoucher.discount.discount_type === "percentage") {
        // For percentage discounts, apply to the subtotal (basePrice)
        discountAmount = Math.round(
          (basePrice * selectedVoucher.discount.discount_value) / 100
        );
      } else {
        // For fixed discounts, use the discount value directly
        discountAmount = selectedVoucher.discount.discount_value;
      }
    }

    // Calculate final price: base price + shipping - discount
    const finalPrice = basePrice + shippingCost - discountAmount;

    // Make sure price doesn't go below zero
    return Math.max(0, finalPrice);
  };

  // Calculate discount amount for display
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

      // Calculate the total price
      const newTotalPrice = calculateTotalPrice();

      console.log("Updating database price:", {
        basePrice: order.total_price,
        shippingCost: selectedCourier?.shipping_cost || 0,
        discount: selectedVoucher ? calculateDiscount() : 0,
        finalPrice: newTotalPrice,
      });

      // Update order in database with the calculated price
      const result = await orderService.updateOrder(
        token,
        order.order_id,
        newTotalPrice
      );

      console.log("Update order result:", result);

      // Refresh order data
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

  // Manual update price button handler
  const handleManualPriceUpdate = async () => {
    try {
      await updateDatabasePrice();
      toast.success("Price updated successfully");
    } catch (error) {
      console.error("Error manually updating price:", error);
      toast.error("Failed to update price");
    }
  };

  // Load order
  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const latestOrder = await fetchLatestOrder();

        if (latestOrder) {
          console.log("Latest order fetched:", latestOrder);
          console.log("Order status:", latestOrder.status);
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

  const handleCancelOrder = async (orderId: number) => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      // Refresh the order data
      const latestOrder = await fetchLatestOrder();
      if (latestOrder) {
        setOrder(latestOrder);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle courier selection
  const handleCourierChange = async (courier: CourierOption | null) => {
    // Update the state first for immediate UI feedback
    setSelectedCourier(courier);

    if (!order) return;

    try {
      // Now update the database with the new calculated price
      await updateDatabasePrice();

      if (courier) {
        toast.success(`Shipping method updated: ${courier.shipping_name}`);
      } else {
        toast.success("Shipping method removed");
      }
    } catch (error) {
      console.error("Error updating shipping method:", error);
      toast.error("Failed to update shipping method");
    }
  };

  // Handle voucher selection
  const handleSelectVoucher = async (voucher: Voucher | null) => {
    // Update the state first for immediate UI feedback
    setSelectedVoucher(voucher);

    if (!order) return;

    try {
      // Now update the database with the new calculated price
      await updateDatabasePrice();

      if (voucher) {
        toast.success(`Voucher ${voucher.voucher_code} applied successfully!`);
      } else {
        toast.success("Voucher removed");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error("Failed to apply voucher changes");
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

    // Make sure the price is updated in the database before proceeding to payment
    await updateDatabasePrice();

    setIsUpdating(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication error");
        return;
      }

      // Prepare shipping method object for the payment service
      const shippingMethod = {
        name: selectedCourier.shipping_name,
        cost: selectedCourier.shipping_cost,
      };

      // Get the current final price
      const finalPrice = getFinalPrice();

      // Log the payment request details
      console.log("Initiating payment:", {
        orderId: order.order_id,
        databasePrice: order.total_price,
        finalCalculatedPrice: finalPrice,
        shippingMethod,
        discount: selectedVoucher ? calculateDiscount() : 0,
      });

      // Initiate payment with the selected shipping method
      const paymentResponse = await paymentService.initiatePayment(
        token,
        order.order_id,
        shippingMethod
      );

      if (paymentResponse.success && paymentResponse.payment_url) {
        // Redirect to payment gateway
        window.location.href = paymentResponse.payment_url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!order) {
    return <EmptyOrderState />;
  }

  // Calculate total items
  const totalItems = order.items
    ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
        <PageHeader />
        <OrderConfirmationBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Order Details and Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courier Selection Card */}
            <ShippingMethodCard
              selectedAddress={selectedAddress}
              setSelectedCourier={setSelectedCourier}
              onCourierSelect={handleCourierChange}
            />

            {/* Voucher Selector */}
            <div>
              <VoucherSelector
                selectedVoucher={selectedVoucher}
                onSelectVoucher={handleSelectVoucher}
                storeId={order.store?.store_id}
                orderTotal={order.total_price}
              />
            </div>

            {/* Manual Update Price Button */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-white mb-3">
                After selecting shipping method and applying voucher, click the
                button below to update the price in the database:
              </p>
              <button
                onClick={handleManualPriceUpdate}
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

            {/* Order Details */}
            <OrderDetailsCard order={order} />

            {/* Shipping Information */}
            {order.shipping && (
              <ShippingInfoCard
                shipping={order.shipping}
                addressData={addressData}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            )}
          </div>

          {/* Right Column - Order Summary */}
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
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
