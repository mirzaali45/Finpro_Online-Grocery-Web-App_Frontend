import React, { useEffect, useState } from "react";
import { Voucher } from "@/types/voucher-types";
import { voucherService } from "@/services/voucher.service";

interface VoucherSelectorProps {
  selectedVoucher: Voucher | null;
  onSelectVoucher: (voucher: Voucher | null) => void;
  storeId?: number;
  orderTotal: number;
  isLoading?: boolean;
}

const VoucherSelector: React.FC<VoucherSelectorProps> = ({
  selectedVoucher,
  onSelectVoucher,
  storeId,
  orderTotal,
  isLoading = false,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [fetchingVouchers, setFetchingVouchers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setFetchingVouchers(true);
        const response = await voucherService.getMyVouchers();

        if (response.success) {
          // Filter vouchers based on:
          // 1. Not redeemed
          // 2. Not expired
          // 3. Store specific (if applicable)
          // 4. Minimum order requirement
          const validVouchers = response.data.filter((voucher) => {
            const isNotRedeemed = !voucher.is_redeemed;
            const isNotExpired = new Date(voucher.expires_at) > new Date();

            // Check store specificity if a storeId is provided
            const isValidStore = storeId
              ? voucher.discount.store_id === null ||
                voucher.discount.store_id === storeId
              : true;

            // Check minimum order requirement
            const meetsMinimumOrder = voucher.discount.minimum_order
              ? orderTotal >= voucher.discount.minimum_order
              : true;

            return (
              isNotRedeemed && isNotExpired && isValidStore && meetsMinimumOrder
            );
          });

          setVouchers(validVouchers);
        } else {
          setError("Failed to load vouchers");
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("Error loading your vouchers");
      } finally {
        setFetchingVouchers(false);
      }
    };

    fetchVouchers();
  }, [storeId, orderTotal]);

  const handleSelectVoucher = (voucher: Voucher) => {
    if (isLoading) return; // Prevent selection during loading state

    if (selectedVoucher && selectedVoucher.voucher_id === voucher.voucher_id) {
      // If clicked on the currently selected voucher, deselect it
      onSelectVoucher(null);
    } else {
      // Select the new voucher
      onSelectVoucher(voucher);
    }
    // Close the dropdown
    setIsOpen(false);
  };

  const handleRemoveVoucher = () => {
    if (isLoading) return; // Prevent removal during loading state
    onSelectVoucher(null);
  };

  const formatDiscountValue = (discount: any) => {
    if (discount.discount_type === "percentage") {
      return `${discount.discount_value}%`;
    } else {
      return `${discount.discount_value} points`;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-medium text-white mb-4">Apply Voucher</h3>

      {selectedVoucher ? (
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-300 text-sm font-medium">
                Applied Voucher
              </p>
              <p className="text-white font-bold">
                {selectedVoucher.voucher_code}
              </p>
              <p className="text-gray-300 text-sm">
                Discount: {formatDiscountValue(selectedVoucher.discount)}
              </p>
            </div>
            <button
              onClick={handleRemoveVoucher}
              disabled={isLoading}
              className={`text-red-400 hover:text-red-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading || fetchingVouchers || vouchers.length === 0}
            className={`w-full flex justify-between items-center bg-gray-700 rounded-lg p-3 ${
              fetchingVouchers || vouchers.length === 0 || isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
          >
            <span className="text-white">
              {fetchingVouchers
                ? "Loading vouchers..."
                : vouchers.length === 0
                ? "No applicable vouchers"
                : "Select a voucher"}
            </span>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            ) : (
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            )}
          </button>

          {isOpen && vouchers.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.voucher_id}
                  onClick={() => handleSelectVoucher(voucher)}
                  className="p-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0"
                >
                  <div className="flex justify-between">
                    <p className="text-white font-medium">
                      {voucher.voucher_code}
                    </p>
                    <p className="text-blue-300 font-bold">
                      {formatDiscountValue(voucher.discount)}
                    </p>
                  </div>
                  <p className="text-gray-300 text-xs mt-1">
                    {voucher.discount.minimum_order
                      ? `Min. Order: ${voucher.discount.minimum_order}`
                      : "No minimum order"}
                  </p>
                  <p className="text-gray-300 text-xs">
                    Expires:{" "}
                    {voucherService.formatVoucherExpiration(voucher.expires_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default VoucherSelector;
