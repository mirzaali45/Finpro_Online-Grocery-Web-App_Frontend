// "use client";

// import { useState, useEffect } from "react";

// interface ProductFilterProps {
//   onFilterChange: (filters: {
//     category: string;
//     minPrice: number;
//     maxPrice: number;
//     brands: string[];
//   }) => void;
//   currentFilters: {
//     category: string;
//     minPrice: number;
//     maxPrice: number;
//     brands: string[];
//   };
// }

// export default function ProductFilter({
//   onFilterChange,
//   currentFilters,
// }: ProductFilterProps) {
//   const [filters, setFilters] = useState({
//     category: currentFilters.category || "",
//     minPrice: currentFilters.minPrice || 0,
//     maxPrice: currentFilters.maxPrice || Infinity,
//     brands: currentFilters.brands || [],
//   });

//   useEffect(() => {
//     onFilterChange(filters);
//   }, [filters]);

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFilters((prev) => ({ ...prev, category: e.target.value }));
//   };

//   const handlePriceChange = (type: "min" | "max", value: string) => {
//     const numValue = value === "" ? 0 : Number(value);
//     setFilters((prev) => ({
//       ...prev,
//       [type === "min" ? "minPrice" : "maxPrice"]:
//         type === "min"
//           ? Math.min(numValue, filters.maxPrice)
//           : value === ""
//           ? Infinity
//           : Math.max(numValue, filters.minPrice),
//     }));
//   };

//   const handleBrandToggle = (brand: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       brands: prev.brands.includes(brand)
//         ? prev.brands.filter((b) => b !== brand)
//         : [...prev.brands, brand],
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       category: "",
//       minPrice: 0,
//       maxPrice: Infinity,
//       brands: [],
//     });
//   };

//   return (
//     <div className="bg-neutral-900 p-4 rounded-lg sticky top-24">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-neutral-200">
//           Filter Products
//         </h2>
//         {(filters.category ||
//           filters.brands.length > 0 ||
//           filters.minPrice > 0 ||
//           filters.maxPrice < Infinity) && (
//           <button
//             onClick={resetFilters}
//             className="text-sm text-rose-500 hover:text-rose-400 transition-colors"
//           >
//             Reset
//           </button>
//         )}
//       </div>

//       <div className="space-y-4">
//         {/* Category Filter */}
//         <div>
//           <label className="block text-neutral-400 mb-2">Category</label>
//           <select
//             value={filters.category}
//             onChange={handleCategoryChange}
//             className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 border border-neutral-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
//           >
//             <option value="">All Categories</option>
//             <option value="electronics">Electronics</option>
//             <option value="computers">Computers</option>
//             <option value="accessories">Accessories</option>
//           </select>
//         </div>

//         {/* Price Range Filter */}
//         <div>
//           <label className="block text-neutral-400 mb-2">Price Range</label>
//           <div className="flex items-center space-x-2">
//             <input
//               type="number"
//               placeholder="Min"
//               value={filters.minPrice === 0 ? "" : filters.minPrice}
//               onChange={(e) => handlePriceChange("min", e.target.value)}
//               className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 border border-neutral-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
//             />
//             <span className="text-neutral-400">to</span>
//             <input
//               type="number"
//               placeholder="Max"
//               value={filters.maxPrice === Infinity ? "" : filters.maxPrice}
//               onChange={(e) => handlePriceChange("max", e.target.value)}
//               className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 border border-neutral-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
//             />
//           </div>
//         </div>

//         {/* Brands Filter */}
//         <div>
//           <label className="block text-neutral-400 mb-2">Brands</label>
//           <div className="space-y-2">
//             {["Apple", "Samsung", "Dell", "Lenovo"].map((brand) => (
//               <div key={brand} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={brand}
//                   checked={filters.brands.includes(brand)}
//                   onChange={() => handleBrandToggle(brand)}
//                   className="mr-2 bg-neutral-800 text-blue-500 rounded focus:ring-2 focus:ring-blue-500/50 transition-all"
//                 />
//                 <label
//                   htmlFor={brand}
//                   className="text-neutral-300 cursor-pointer"
//                 >
//                   {brand}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
