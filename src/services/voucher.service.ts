import { VoucherResponse } from "@/types/voucher-types";

class VoucherService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL_BE || "";
  }

  async getMyVouchers(): Promise<VoucherResponse> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/voucher/my-vouchers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vouchers");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  }

  async redeemVoucher(voucherId: number): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/voucher/redeem/${voucherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to redeem voucher");
      }
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      throw error;
    }
  }

  formatVoucherExpiration(expiresAt: string): string {
    return new Date(expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  isVoucherValid(voucher: VoucherResponse["data"][0]): boolean {
    const now = new Date();
    const expirationDate = new Date(voucher.expires_at);
    return !voucher.is_redeemed && expirationDate > now;
  }
}

export const voucherService = new VoucherService();
