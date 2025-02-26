// DiscountCard.tsx
import React from "react";
import Image from "next/image";
import { Discount } from "@/types/discount-types";
import { formatRupiah } from "@/helper/currencyRp";

interface DiscountCardProps {
  discount: Discount;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-purple-900/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {discount.thumbnail ? (
        <div className="relative w-full h-52 sm:h-56 md:h-60 lg:h-64">
          <Image
            src={discount.thumbnail}
            alt={discount.product?.name || "Discount"}
            fill
            style={{ objectFit: "contain", objectPosition: "center" }}
            className="rounded-t-xl opacity-95 hover:opacity-100 transition-opacity p-2"
          />
          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 m-2 sm:m-3 rounded-full font-bold text-xs sm:text-sm">
            {discount.discount_type === "percentage"
              ? `${discount.discount_value}%`
              : formatRupiah(discount.discount_value)}
          </div>
        </div>
      ) : (
        <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-r from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center">
          <div className="text-xl sm:text-2xl font-bold text-white">
            {discount.discount_type === "percentage"
              ? `${discount.discount_value}%`
              : formatRupiah(discount.discount_value)}
            <span className="ml-2">OFF</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-100 line-clamp-2">
          {discount.product ? discount.product.name : "Store-wide Discount"}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-1">
          {discount.store.store_name}
        </p>

        <div className="space-y-1 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-700 mt-auto">
          <p className="flex justify-between">
            <span>Code:</span>
            <span className="font-medium text-purple-400">
              {discount.discount_code}
            </span>
          </p>
          {discount.minimum_order > 0 && (
            <p className="flex justify-between">
              <span>Min Order:</span>
              <span>{formatRupiah(discount.minimum_order)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Expires:</span>
            <span>{new Date(discount.expires_at).toLocaleDateString()}</span>
          </p>
        </div>

        <button className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm sm:text-base">
          Apply Discount
        </button>
      </div>
    </div>
  );
};
