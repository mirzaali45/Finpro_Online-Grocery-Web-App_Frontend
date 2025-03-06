// OrderSummary.tsx
import React from "react";
import { Order } from "@/types/orders-types";
import { CourierOption } from "@/app/ordered/page";
import { Voucher } from "@/types/voucher-types";
import { formatRupiah } from "@/helper/currencyRp";

// Update the props interface to include the new props
interface OrderSummaryProps {
  order: Order;
  totalItems: number;
  selectedCourier: CourierOption | null;
  selectedVoucher: Voucher | null;
  calculateDiscount: () => number;
  getFinalPrice: () => number;
  handleCancelOrder: (orderId: number) => Promise<void>;
  isCancelling: boolean;
  setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  onInitiatePayment?: () => Promise<void>;
  isUpdating?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  totalItems,
  selectedCourier,
  selectedVoucher,
  calculateDiscount,
  getFinalPrice,
  handleCancelOrder,
  isCancelling,
  setOrder,
  onInitiatePayment,
  isUpdating = false,
}) => {
  const discount = calculateDiscount();
  const finalPrice = getFinalPrice();
  const shippingCost = selectedCourier ? selectedCourier.shipping_cost : 0;

  // Calculate the base subtotal (product prices only, before shipping and discounts)
  const baseSubtotal = order.total_price;

  const handlePaymentClick = async () => {
    if (onInitiatePayment) {
      await onInitiatePayment();
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-gray-600 p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-wide">
            Order Summary
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Order ID</span>
          <span className="font-medium">{order.order_id}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Subtotal ({totalItems} items)</span>
          <span className="font-medium">
            {formatRupiah
              ? formatRupiah(baseSubtotal)
              : `Rp ${baseSubtotal.toLocaleString("id-ID")}`}
          </span>
        </div>

        {selectedCourier && (
          <div className="flex justify-between">
            <span className="text-gray-300">
              Shipping ({selectedCourier.shipping_name})
            </span>
            <span className="font-medium">
              {formatRupiah
                ? formatRupiah(shippingCost)
                : `Rp ${shippingCost.toLocaleString("id-ID")}`}
            </span>
          </div>
        )}

        {selectedVoucher && (
          <div className="flex justify-between text-green-400">
            <span>Discount ({selectedVoucher.voucher_code})</span>
            <span className="font-medium">
              -
              {formatRupiah
                ? formatRupiah(discount)
                : `Rp ${discount.toLocaleString("id-ID")}`}
            </span>
          </div>
        )}

        <div className="border-t border-gray-700 my-4"></div>

        <div className="flex justify-between text-xl">
          <span className="font-bold">Total</span>
          <span className="font-bold text-blue-300">
            {formatRupiah
              ? formatRupiah(finalPrice)
              : `Rp ${finalPrice.toLocaleString("id-ID")}`}
          </span>
        </div>

        {/* Display Database Price (This is for debugging and can be removed in production) */}
        <div className="flex justify-between text-sm text-gray-400">
          <span>Database Price</span>
          <span>
            {formatRupiah
              ? formatRupiah(order.total_price)
              : `Rp ${order.total_price.toLocaleString("id-ID")}`}
          </span>
        </div>

        <div className="pt-4 space-y-3">
          <button
            className={`w-full ${
              !selectedCourier || isUpdating
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            } 
              text-white h-12 rounded-lg font-medium transition-colors`}
            onClick={handlePaymentClick}
            disabled={!selectedCourier || isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Proceed to Payment"
            )}
          </button>

          {!selectedCourier && (
            <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3">
              <p className="text-amber-200 text-sm">
                Please select a shipping method to proceed
              </p>
            </div>
          )}

          <button
            className={`w-full ${
              isCancelling || isUpdating
                ? "bg-red-800 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }
              text-white h-10 rounded-lg font-medium transition-colors`}
            onClick={() => handleCancelOrder(order.order_id)}
            disabled={isCancelling || isUpdating}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
      <div className="border-t border-gray-700 p-4 text-sm text-gray-400">
        <p>
          By proceeding to payment, you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
