// components/product-list/FilterByPrice.tsx
"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface FilterByPriceProps {
  onPriceChange: (priceRange: [number, number]) => void;
  minPrice?: number;
  maxPrice?: number;
  initialRange?: [number, number];
}

export function FilterByPrice({
  onPriceChange,
  minPrice = 0,
  maxPrice = 10000000,
  initialRange
}: FilterByPriceProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialRange || [minPrice, maxPrice]
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Format price value to show in rupiah
  const formatPrice = (value: number) => {
    return `Rp ${value.toLocaleString()}`;
  };

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
  };

  const handleApplyFilter = () => {
    onPriceChange(priceRange);
    console.log("Applying price filter:", priceRange);
  };

  const handleReset = () => {
    const defaultRange: [number, number] = [minPrice, maxPrice];
    setPriceRange(defaultRange);
    onPriceChange(defaultRange);
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-4 w-full">
      <button 
        className="flex justify-between items-center w-full text-left text-neutral-200 font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Filter by Price</span>
        <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Min: {formatPrice(priceRange[0])}</span>
              <span>Max: {formatPrice(priceRange[1])}</span>
            </div>
            
            <Slider
              min={minPrice}
              max={maxPrice}
              step={10000}
              value={priceRange}
              onValueChange={handleRangeChange}
              className="py-4"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApplyFilter}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}