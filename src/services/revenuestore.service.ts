import {
  OrdersResponse,
  RevenueByPeriodResponse,
  OrdersQueryParams,
  RevenueQueryParams,
} from "../types/revenuestore-types";
import { parse, format, addDays } from "date-fns";

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const formatDateParam = (
  dateStr?: string,
  isEndDate = false
): string | undefined => {
  if (!dateStr) return undefined;

  try {
    const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
    if (isEndDate) {
      const nextDay = addDays(parsedDate, 1);
      return nextDay.toISOString();
    }
    return parsedDate.toISOString();
  } catch (e) {
    return dateStr;
  }
};

export const getCurrentDate = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

class RevenueStoreService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private formatQueryParams(params?: Record<string, any>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "startDate") {
          const formattedDate = formatDateParam(value.toString(), false);
          if (formattedDate) {
            searchParams.append(key, formattedDate);
          }
        } else if (key === "endDate") {
          const formattedDate = formatDateParam(value.toString(), true);
          if (formattedDate) {
            searchParams.append(key, formattedDate);
          }
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  async getStoreOrders(params?: OrdersQueryParams): Promise<OrdersResponse> {
    const queryString = this.formatQueryParams(params);
    try {
      const fullUrl = `${base_url_be}/revenueorder${queryString}`;
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getRevenueByPeriod(
    params?: RevenueQueryParams
  ): Promise<RevenueByPeriodResponse> {
    const queryString = this.formatQueryParams(params);

    try {
      const response = await fetch(
        `${base_url_be}/revenueorder/period${queryString}`,
        {
          method: "GET",
          headers: this.getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorData;

    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: "Unknown error occurred" };
    }

    const errorMessage =
      errorData.message || errorData.error || `API error: ${response.status}`;

    if (response.status === 401 || response.status === 403) {
    }

    return new Error(errorMessage);
  }
}

export default new RevenueStoreService();
