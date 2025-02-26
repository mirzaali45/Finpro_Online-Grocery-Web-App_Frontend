// discountService.ts
import { Discount } from "@/types/discount-types";

export const fetchDiscounts = async (
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data: Discount[];
  pagination: {
    totalPages: number;
    page: number;
    limit: number;
    total: number;
  };
}> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount?page=${page}&limit=${limit}`
    );
    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};
