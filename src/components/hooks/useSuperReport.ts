// hooks/useInventoryReport.ts
'use client';

import { useState, useEffect } from 'react';
import { InventoryReportService } from "@/services/reports-superadmin"
import { 
  InventoryReportData, 
  InventoryReportFilters, 
  InventoryReportResponse 
} from "@/types/reports-superadmin-types";

export const useInventoryReport = (initialFilters?: InventoryReportFilters) => {
  const [data, setData] = useState<InventoryReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<InventoryReportFilters>(initialFilters || {});

  const fetchReport = async (reportFilters?: InventoryReportFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filtersToUse = reportFilters || filters;
      const response = await InventoryReportService.getInventoryReport(filtersToUse);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters and refetch data
  const updateFilters = (newFilters: InventoryReportFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchReport();
  }, [filters]);

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch: fetchReport
  };
};