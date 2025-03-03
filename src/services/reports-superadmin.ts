// services/inventory-report.service.ts
import { InventoryReportFilters, InventoryReportResponse } from '@/types/reports-superadmin-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class InventoryReportService {
  /**
   * Get inventory report for super admin with optional filters
   */
  static async getInventoryReport(filters?: InventoryReportFilters): Promise<InventoryReportResponse> {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters?.storeId) {
        queryParams.append('storeId', filters.storeId.toString());
      }
      
      if (filters?.productId) {
        queryParams.append('productId', filters.productId.toString());
      }
      
      if (filters?.lowStock !== undefined) {
        queryParams.append('lowStock', filters.lowStock.toString());
      }
      
      if (filters?.threshold !== undefined) {
        queryParams.append('threshold', filters.threshold.toString());
      }
      
      // Get the token from localStorage (you might want to use a more secure method)
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Build the URL with query parameters
      const url = `${API_BASE_URL}/reports-superadmin/${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      
      // Make the request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch inventory report');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      throw error;
    }
  }
}