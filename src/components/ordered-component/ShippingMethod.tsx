// import React, { useEffect, useState } from "react";
// import { Address } from "@/types/address-types";
// import { CourierOption } from "@/app/ordered/page";
// import { formatRupiah } from "@/helper/currencyRp";
// import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";

// interface ShippingMethodCardProps {
//   selectedAddress: Address | null;
//   setSelectedCourier: React.Dispatch<
//     React.SetStateAction<CourierOption | null>
//   >;
//   onCourierSelect: (courier: CourierOption | null) => Promise<void>;
// }

// const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({
//   selectedAddress,
//   setSelectedCourier,
//   onCourierSelect,
// }) => {
//   const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [updating, setUpdating] = useState(false);

//   const STORE_POSTCODE = 40973;

//   const getCourier = async () => {
//     try {
//       if (!selectedAddress?.postcode) return;
//       setIsLoading(true);
//       const customerPostcode = parseInt(selectedAddress.postcode, 10);
//       const response = await CheckPricing(customerPostcode, STORE_POSTCODE);

//       const resCargo = response.data?.calculate_cargo || [];
//       const resRegular = response.data?.calculate_reguler || [];

//       const formattedCouriers: CourierOption[] = [
//         ...resCargo,
//         ...resRegular,
//       ].map((courier) => ({
//         ...courier,
//         value: courier.shipping_name,
//         label: `${courier.shipping_name} - Rp ${courier.shipping_cost
//           .toLocaleString()
//           .replaceAll(",", ".")}`,
//       }));

//       setCourierOptions(formattedCouriers);
//       setError("");
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to load courier options"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedAddress) {
//       getCourier();
//     }
//   }, [selectedAddress]);

//   const handleOptionChange = async (value: string) => {
//     setSelectedOption(value);
//     const selectedCourier =
//       courierOptions.find((option) => option.value === value) || null;
//     setSelectedCourier(selectedCourier);

//     setUpdating(true);
//     try {
//       await onCourierSelect(selectedCourier);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <div className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300">
//       <div className="flex items-center justify-between border-b border-gray-600 p-4">
//         <div className="flex items-center gap-3">
//           <span className="text-xl font-semibold tracking-wide">
//             Shipping Method
//           </span>
//         </div>
//         {selectedOption && (
//           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
//             Selected
//           </span>
//         )}
//       </div>
//       <div className="p-4">
//         {isLoading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
//           </div>
//         ) : !selectedAddress ? (
//           <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-4">
//             <p className="text-amber-200">
//               Please select a shipping address first
//             </p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
//             <p className="text-red-200">{error}</p>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-3">
//               {courierOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   className={`flex items-center space-x-3 border ${
//                     selectedOption === option.value
//                       ? "border-blue-500 bg-blue-900/20"
//                       : "border-gray-700 bg-gray-800"
//                   }
//                   rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer
//                   ${updating ? "opacity-70 pointer-events-none" : ""}`}
//                   onClick={() => !updating && handleOptionChange(option.value)}
//                 >
//                   <div className="flex-shrink-0">
//                     <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
//                       {selectedOption === option.value && (
//                         <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <div className="font-medium text-white">
//                       {option.shipping_name}
//                     </div>
//                     <div className="text-sm text-gray-400">
//                       Estimated delivery: {option.estimated_days}
//                     </div>
//                     <div className="font-semibold mt-1 text-blue-400">
//                       {formatRupiah
//                         ? formatRupiah(option.shipping_cost)
//                         : `Rp ${option.shipping_cost.toLocaleString("id-ID")}`}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {updating && (
//               <div className="mt-3 text-center text-blue-400 flex items-center justify-center gap-2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
//                 Updating shipping method...
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShippingMethodCard;
import React, { useEffect, useState } from "react";
import { Address } from "@/types/address-types";
import { CourierOption } from "@/app/ordered/page";
import { formatRupiah } from "@/helper/currencyRp";
import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";

interface ShippingMethodCardProps {
  selectedAddress: Address | null;
  setSelectedCourier: React.Dispatch<React.SetStateAction<CourierOption | null>>;
  onCourierSelect: (courier: CourierOption | null) => Promise<void>;
  defaultCourier: CourierOption | null;  // Add this prop to pass selected courier
}

const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({
  selectedAddress,
  setSelectedCourier,
  onCourierSelect,
  defaultCourier,  // Get the default courier option from parent
}) => {
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);  // Store selected courier's value
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const STORE_POSTCODE = 40973;

  const getCourier = async () => {
    try {
      if (!selectedAddress?.postcode) return;
      const customerPostcode = parseInt(selectedAddress.postcode, 10);
      const response = await CheckPricing(customerPostcode, STORE_POSTCODE);

      const resCargo = response.data?.calculate_cargo || [];
      const resRegular = response.data?.calculate_reguler || [];

      const formattedCouriers: CourierOption[] = [
        ...resCargo,
        ...resRegular,
      ].map((courier) => ({
        ...courier,
        value: courier.shipping_name,
        label: `${courier.shipping_name} - Rp ${courier.shipping_cost
          .toLocaleString()
          .replaceAll(",", ".")}`,
      }));

      setCourierOptions(formattedCouriers);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load courier options"
      );
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      getCourier();
    }
  }, [selectedAddress]);

  useEffect(() => {
    // Set the default courier option if available
    if (defaultCourier) {
      setSelectedOption(defaultCourier.value);
      setSelectedCourier(defaultCourier);
    }
  }, [defaultCourier, setSelectedCourier]);

  const handleOptionChange = async (value: string) => {
    setSelectedOption(value);
    const selectedCourier =
      courierOptions.find((option) => option.value === value) || null;
    setSelectedCourier(selectedCourier);

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
          <span className="text-xl font-semibold tracking-wide">Shipping Method</span>
        </div>
        {selectedOption && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            Selected
          </span>
        )}
      </div>
      <div className="p-4">
        {!selectedAddress ? (
          <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-4">
            <p className="text-amber-200">Please select a shipping address first</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {courierOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 border ${
                    selectedOption === option.value
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 bg-gray-800"
                  }
                  rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer
                  ${updating ? "opacity-70 pointer-events-none" : ""}`}
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
                    <div className="font-medium text-white">{option.shipping_name}</div>
                    <div className="text-sm text-gray-400">Estimated delivery: {option.estimated_days}</div>
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
