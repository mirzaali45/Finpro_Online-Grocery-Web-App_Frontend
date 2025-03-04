// orderService.ts
import { ApiResponse, Order, OrderStatus } from "@/types/orders-types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const orderService = {
  async getMyOrders(
    token: string,
    status?: OrderStatus
  ): Promise<ApiResponse<Order[]>> {
    const url = new URL(`${API_URL}/orders/my-orders`);

    if (status) {
      url.searchParams.append("status", status);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to fetch orders");
    }

    return await response.json();
  },

  async createOrderFromCart(
    token: string,
    userId: number
  ): Promise<ApiResponse<Order>> {
    // Changed return type from Order[] to Order to match backend changes
    const response = await fetch(`${API_URL}/orders/from-cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to create order");
    }

    return await response.json();
  },

  async cancelOrder(
    token: string,
    orderId: number
  ): Promise<ApiResponse<{ order_id: number }>> {
    const response = await fetch(`${API_URL}/orders/my-orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to cancel order");
    }

    return await response.json();
  },
};
