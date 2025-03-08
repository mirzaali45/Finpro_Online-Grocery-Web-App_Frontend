// ShippingMethodCard.tsx
import React, { useEffect, useState } from "react";
import { Address } from "@/types/address-types";
import { CourierOption } from "@/app/ordered/page";
import { formatRupiah } from "@/helper/currencyRp";

interface ShippingMethodCardProps {
  selectedAddress: Address | null;
  setSelectedCourier: React.Dispatch<
    React.SetStateAction<CourierOption | null>
  >;
  onCourierSelect: (courier: CourierOption | null) => Promise<void>;
}

const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({
  selectedAddress,
  setSelectedCourier,
  onCourierSelect,
}) => {
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Simulate fetching courier options based on the selected address
  useEffect(() => {
    const fetchCourierOptions = async () => {
      if (!selectedAddress) return;

      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulated courier options data
        // In a real app, this would come from an API
        const options: CourierOption[] = [
          {
            shipping_name: "Economy Delivery",
            shipping_cost: 10000,
            value: "economy",
            label: "Economy Delivery (2-3 days) - Rp 10,000",
            estimated_days: "2-3 days",
          },
          {
            shipping_name: "Regular Delivery",
            shipping_cost: 20000,
            value: "regular",
            label: "Regular Delivery (1-2 days) - Rp 20,000",
            estimated_days: "1-2 days",
          },
          {
            shipping_name: "Same Day Delivery",
            shipping_cost: 40000,
            value: "sameday",
            label: "Same Day Delivery - Rp 40,000",
            estimated_days: "Today",
          },
        ];

        setCourierOptions(options);
      } catch (error) {
        console.error("Error fetching courier options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourierOptions();
  }, [selectedAddress]);

  const handleOptionChange = async (value: string) => {
    setSelectedOption(value);
    const selectedCourier =
      courierOptions.find((option) => option.value === value) || null;
    setSelectedCourier(selectedCourier);

    // Show updating state
    setUpdating(true);
    try {
      await onCourierSelect(selectedCourier);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-gray-600 p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-wide">
            Shipping Method
          </span>
        </div>
        {selectedOption && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            Selected
          </span>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        ) : !selectedAddress ? (
          <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-4">
            <p className="text-amber-200">
              Please select a shipping address first
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {courierOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    flex items-center space-x-3 border ${
                      selectedOption === option.value
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-gray-700 bg-gray-800"
                    }
                    rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer
                    ${updating ? "opacity-70 pointer-events-none" : ""}
                  `}
                  onClick={() => !updating && handleOptionChange(option.value)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                      {selectedOption === option.value && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {option.shipping_name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Estimated delivery: {option.estimated_days}
                    </div>
                    <div className="font-semibold mt-1 text-blue-400">
                      {formatRupiah
                        ? formatRupiah(option.shipping_cost)
                        : `Rp ${option.shipping_cost.toLocaleString("id-ID")}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {updating && (
              <div className="mt-3 text-center text-blue-400 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
                Updating shipping method...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShippingMethodCard;
