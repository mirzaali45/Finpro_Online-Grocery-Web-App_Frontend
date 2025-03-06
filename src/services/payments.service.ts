// payments.Service.ts
const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE}`;

interface PaymentResponse {
  success: boolean;
  message?: string;
  payment_url?: string;
  order_id?: number;
}

export const paymentService = {
  async initiatePayment(
    token: string,
    order_id: number,
    shippingMethod?: { name: string, cost: number }
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_URL}/payments/${order_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          shipping_method: shippingMethod 
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.msg || "Failed to initiate payment");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Server error: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        throw new Error("Invalid response from server. Please try again later.");
      }
      throw error;
    }
  }
};