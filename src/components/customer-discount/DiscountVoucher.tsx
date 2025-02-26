"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchDiscounts } from "@/services/discount.service";
import { Discount } from "@/types/discount-types";
import { MapPin } from "lucide-react";

const DiscountsList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const page = 1;
  const limit = 8;

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const result = await fetchDiscounts(page, limit);
        if (result.success) {
          setDiscounts(result.data);
        } else {
          setError("Failed to fetch discounts");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadDiscounts();
  }, [page, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-pulse text-gray-400">Loading Discounts...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {discounts.map((discount) => (
          <motion.div
            key={discount.discount_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-gray-700"
          >
            {discount.thumbnail ? (
              <img
                src={discount.thumbnail}
                alt={discount.discount_code}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  {discount.discount_type}
                </span>
                <span className="text-gray-400 text-sm">
                  Ends: {new Date().toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {discount.discount_code}
              </h3>

              <div className="flex items-center text-gray-400 mb-3">
                <MapPin className="mr-2 w-4 h-4" />
                <span className="text-sm">
                  {discount.store?.store_name || "Unknown Store"}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-green-500 font-semibold">
                  {discount.discount_value}% OFF
                </div>
                <div className="text-gray-400 text-sm">For: All Product In this Store</div>
              </div>

              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                Claim Voucher
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DiscountsList;
