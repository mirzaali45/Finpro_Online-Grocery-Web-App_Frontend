"use client";
import React, { useState, useEffect } from "react";
import { Discount } from "@/types/discount-types";
import { fetchDiscounts } from "@/services/discount.service";
import { usePagination } from "@/services/pagination-discount";
import { Pagination } from "@/components/customer-discount/Pagination";
import { ProductDiscountCard } from "@/components/customer-discount/DealsComponent";

export default function DealsPageContent() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pagination = usePagination(8);

  useEffect(() => {
    loadDiscounts();
  }, [pagination.currentPage]);

  const loadDiscounts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDiscounts(
        pagination.currentPage,
        pagination.limit
      );

      if (data.success) {
        setDiscounts(data.data);
        pagination.updateFromResponse(data.pagination);
      } else {
        throw new Error("Failed to fetch discounts");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center p-6">{error}</div>;
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8 md:py-12">
        No deals available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-6">
        {discounts.map((discount) => (
          <ProductDiscountCard key={discount.discount_id} discount={discount} />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
