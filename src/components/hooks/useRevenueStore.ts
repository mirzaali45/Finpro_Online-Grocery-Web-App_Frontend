import { useState, useEffect, useCallback } from "react";
import revenueStoreService from "@/services/revenuestore.service";
import {
  OrdersResponse,
  RevenueByPeriodResponse,
  OrdersQueryParams,
  RevenueQueryParams,
} from "@/types/revenuestore-types";
import { format } from "date-fns";

export const useStoreOrders = (initialParams?: OrdersQueryParams) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse | null>(null);

  const currentDate = new Date(new Date().setHours(12, 0, 0, 0));

  const defaultStartDate = new Date(currentDate);
  defaultStartDate.setDate(currentDate.getDate() - 30);

  const [params, setParams] = useState<OrdersQueryParams>({
    startDate:
      initialParams?.startDate || format(defaultStartDate, "yyyy-MM-dd"),
    endDate: initialParams?.endDate || format(currentDate, "yyyy-MM-dd"),
    status: initialParams?.status,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching orders with params:", params);
      // Add timestamp to avoid caching issues
      const paramsWithTimestamp = {
        ...params,
        _t: Date.now(),
      };
      const response = await revenueStoreService.getStoreOrders(
        paramsWithTimestamp
      );
      console.log("Orders response:", response);
      setData(response);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<OrdersQueryParams>) => {
    console.log("Updating order params:", newParams);
    setParams((prev) => {
      const updated = { ...prev, ...newParams };

      // Validate date range if both dates are provided
      if (updated.startDate && updated.endDate) {
        const startDate = new Date(updated.startDate);
        const endDate = new Date(updated.endDate);

        if (startDate > endDate) {
          console.warn(
            "Invalid date range: Start date cannot be after end date"
          );
          return prev;
        }
      }

      return updated;
    });
  }, []);

  // New method that directly accepts start and end date strings
  const setDateRange = useCallback(
    (startDateStr: string, endDateStr: string) => {
      console.log(`Setting date range: ${startDateStr} to ${endDateStr}`);

      if (!startDateStr && !endDateStr) {
        // Clear date range
        updateParams({
          startDate: undefined,
          endDate: undefined,
        });
        return;
      }

      updateParams({
        startDate: startDateStr,
        endDate: endDateStr,
      });
    },
    [updateParams]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setParams: updateParams,
    setDateRange,
    params,
  };
};

export const useRevenueByPeriod = (initialParams?: RevenueQueryParams) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RevenueByPeriodResponse | null>(null);

  const currentDate = new Date(new Date().setHours(12, 0, 0, 0));

  const [params, setParams] = useState<RevenueQueryParams>({
    period: initialParams?.period || "monthly",
    year: initialParams?.year || currentDate.getFullYear(),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching revenue with year: ${params.year}, period: ${params.period}`
      );

      // Clear previous data to ensure UI updates
      setData(null);

      // Use a new request each time
      const paramsCopy = {
        ...params,
        _t: Date.now(),
      };

      const response = await revenueStoreService.getRevenueByPeriod(paramsCopy);

      // Log the response for debugging
      console.log(
        `Revenue data for ${params.period} ${
          params.period === "monthly" ? params.year : ""
        }:`,
        response.revenue && response.revenue.length
          ? `${response.revenue.length} data points`
          : "No data"
      );

      setData(response);
    } catch (err) {
      console.error("Error fetching revenue:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<RevenueQueryParams>) => {
    console.log("Updating revenue params:", newParams);
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  // Add a direct refresh method that forces a new API call
  const refreshData = useCallback(() => {
    console.log("Manually refreshing revenue data...");
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    refresh: refreshData, // Add new refresh method
    setParams: updateParams,
    params,
  };
};
