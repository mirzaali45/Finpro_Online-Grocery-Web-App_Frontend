import { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { getAuthToken } from "@/utils/forAuth";
import { CourierOption } from "@/app/ordered/page";

interface PaymentButtonProps {
  order_id: string;
  selectedCourier: CourierOption | null;
  disabled?: boolean; // Add disabled prop
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  order_id,
  selectedCourier,
  disabled = false,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token using your authentication utility
      const token = getAuthToken();

      if (!token) {
        throw new Error("You need to be logged in to make a payment");
      }

      if (!selectedCourier) {
        throw new Error("Please select a shipping method first");
      }

      console.log("Initiating payment for order:", order_id);
      console.log("With shipping method:", selectedCourier.shipping_name);

      const response = await paymentService.initiatePayment(
        token,
        parseInt(order_id),
        {
          name: selectedCourier.shipping_name,
          cost: selectedCourier.shipping_cost,
        }
      );

      console.log("Payment response:", response);

      // Fix for TypeScript error - check that payment_url exists and is a string
      if (
        response &&
        response.payment_url &&
        typeof response.payment_url === "string"
      ) {
        toast.success("Payment initiated! Redirecting to payment gateway...");

        // Add a small delay to show the toast message before redirecting
        setTimeout(() => {
          window.location.href = response.payment_url as string;
        }, 1000);
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message);
      toast.error(err.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
        onClick={handlePayment}
        disabled={loading || !selectedCourier || disabled}
      >
        <CreditCard className="h-5 w-5" />
        {loading ? "Processing..." : "Pay Now"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {disabled && !error && (
        <p className="text-amber-400 text-xs mt-1">
          Please apply changes before making a payment
        </p>
      )}
    </>
  );
};

export default PaymentButton;
