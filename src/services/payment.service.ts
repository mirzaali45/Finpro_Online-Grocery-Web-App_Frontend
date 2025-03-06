// services/payment.service.ts
const API_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

// Define the shape of shipping method
interface ShippingMethod {
  name: string;
  cost: number;
}

// Define the response type with proper types
interface PaymentResponse {
  success: boolean;
  message?: string;
  payment_url?: string; // Note the optional type here
  order_id?: number;
}

// Define payment status response type
interface PaymentStatusResponse {
  success: boolean;
  message: string;
  previous_status?: string;
  current_status?: string;
  transaction_status?: string;
}

export const paymentService = {
  async initiatePayment(
    token: string,
    orderId: number,
    shippingMethod?: ShippingMethod
  ): Promise<PaymentResponse> {
    try {
      // Log request parameters for debugging
      console.log("Payment initiation parameters:", {
        orderId,
        hasToken: !!token,
        shippingDetails: shippingMethod,
      });

      // Create request body with shipping method
      const requestBody = {
        shipping_method: shippingMethod,
      };

      const response = await fetch(`${API_URL}/payments/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || errorData.msg || "Failed to initiate payment"
          );
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Server error: ${response.status}`);
        }
      }

      // Parse the response
      const responseData = await response.json();

      // Return a properly typed response object
      return {
        success: responseData.success || true,
        message: responseData.message,
        payment_url: responseData.payment_url,
        order_id: responseData.order_id,
      };
    } catch (error) {
      // Improve error handling
      console.error("Payment service error:", error);

      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        throw new Error(
          "Invalid response format from server. Please try again later."
        );
      }

      // Re-throw the error to be handled by the component
      throw error;
    }
  },

  // Method to check payment status (authenticated)
  async checkPaymentStatus(
    token: string,
    orderId: number
  ): Promise<PaymentStatusResponse> {
    try {
      console.log(`Checking payment status for order ${orderId}`);

      const response = await fetch(
        `${API_URL}/payments/${orderId}/check-status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error checking payment status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  },

  // Method to check payment status (public, no auth required)
  async checkPublicPaymentStatus(
    orderId: number
  ): Promise<PaymentStatusResponse> {
    try {
      console.log(`Checking public payment status for order ${orderId}`);

      const response = await fetch(
        `${API_URL}/payments/public/${orderId}/check-status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error checking payment status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking public payment status:", error);
      throw error;
    }
  },
};
