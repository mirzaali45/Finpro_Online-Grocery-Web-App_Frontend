import { useState } from "react";
import { useRouter } from "next/router";
import axios from "../services/checkout.service";
import Button from "../components/button";


const CheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const userId = 1; // Hardcoded, replace with actual user ID
      const response = await axios.post("/api/orders", {
        userId,
      });

      if (response.data && response.data.snap_token) {
        // Redirect to payment page
        router.push(`/payment?order_id=${response.data.order_id}`);
      }
    } catch (error) {
      setErrorMessage("There was an error processing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Checkout</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <Button onClick={handleCheckout} disabled={isLoading}>
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>
    </div>
  );
};

export default CheckoutPage;
