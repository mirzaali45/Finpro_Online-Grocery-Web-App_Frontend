import { OrderItem } from "@/types/orders-types";
import React from "react";

const CardOrderItems = ({ dataItems }: { dataItems: OrderItem[] }) => {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-300 bg-white">
      <div className="bg-gray-100 px-5 py-4 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900">Order Details :</h3>
      </div>

      <div className="divide-y divide-gray-300">
        {dataItems.map((data, index) => (
          <div key={index} className="p-5 hover:bg-gray-100 transition-all">
            {/* Mobile View (Stacked) */}
            <div className="block md:hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-gray-900">
                  {data.name}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  x{data.quantity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    💰
                  </span>
                  <span className="text-gray-900 font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(data.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    🏷️
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(data.total_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop View (Horizontal) */}
            <div className="hidden md:flex md:items-center md:justify-between md:flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <span className="text-lg font-medium text-gray-900">
                  {data.name}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  x{data.quantity}
                </span>
              </div>

              <div className="flex gap-6 flex-wrap justify-end w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    🏷️
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0, // Hapus angka desimal
                    }).format(data.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dataItems.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No items in this order
        </div>
      )}
    </div>
  );
};

export default CardOrderItems;
