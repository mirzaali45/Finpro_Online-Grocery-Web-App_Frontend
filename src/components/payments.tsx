import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../services/checkout.service";
import Button from "../components/button";

const PaymentPage = () => {
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { order_id } = router.query;

  useEffect(() => {
    if (order_id) {
      const fetchSnapToken = async () => {
        try {
          const response = await axios.post("/api/payments/snap-token", {
            order_id: order_id,
          });

          setSnapToken(response.data.token);
          setRedirectUrl(response.data.redirect_url);
        } catch (error) {
          console.error("Failed to fetch Snap Token:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSnapToken();
    }
  }, [order_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Payment</h1>

      {snapToken ? (
        <>
          <div className="mb-6 text-center">
            <Button onClick={() => window.location.href = redirectUrl!}>
              Pay Now
            </Button>
          </div>
          <div className="text-center">
            <p className="text-gray-500">
              You will be redirected to Midtrans for payment.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center text-red-500">
          Payment process failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
