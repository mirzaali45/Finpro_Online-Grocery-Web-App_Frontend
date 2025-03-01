"use client";

import React, { useState } from "react";
import { useRevenueByPeriod, useStoreOrders } from "../hooks/useRevenueStore";
import {
  OrderStatus,
  RevenueQueryParams,
  OrdersQueryParams,
} from "@/types/revenuestore-types";
import RevenueAnalysisSection from "./RevenueAnalyticsSession";
import OrdersSection from "./OrderSelection";

const RevenueDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [revenueParams, setRevenueParams] = useState<RevenueQueryParams>({
    period: "monthly",
    year: currentYear,
  });

  // Use the enhanced hook with date range functionality
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    params: ordersParams,
    setDateRange: handleDateRangeChange,
    setParams: setOrdersParams,
  } = useStoreOrders();

  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueByPeriod(revenueParams);

  const handlePeriodChange = (period: "monthly" | "yearly") => {
    setRevenueParams((prev) => ({ ...prev, period }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRevenueParams((prev) => ({ ...prev, year: parseInt(e.target.value) }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as OrderStatus | "";
    setOrdersParams({
      status: status === "" ? undefined : status,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Store Revenue Dashboard
        </h1>
      </div>

      <RevenueAnalysisSection
        revenueParams={revenueParams}
        revenueData={revenueData}
        revenueLoading={revenueLoading}
        revenueError={revenueError}
        currentYear={currentYear}
        handlePeriodChange={handlePeriodChange}
        handleYearChange={handleYearChange}
      />

      <OrdersSection
        ordersData={ordersData}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
        ordersParams={{
          startDate: ordersParams.startDate || "",
          endDate: ordersParams.endDate || "",
          status: ordersParams.status,
        }}
        handleDateRangeChange={handleDateRangeChange}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default RevenueDashboard;
