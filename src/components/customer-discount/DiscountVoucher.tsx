"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDiscounts } from "@/services/discount.service";
import { voucherService } from "@/services/voucher.service";
import { Discount } from "@/types/discount-types";
import { MapPin, Clock, ShoppingBag, Tag, AlertCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const DiscountsList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimingVouchers, setClaimingVouchers] = useState<{
    [key: number]: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const page = 1;
  const limit = 8;

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const result = await fetchDiscounts(page, limit);
        if (result.success) {
          // Filter out expired discounts
          const currentDate = new Date();
          const activeDiscounts = result.data.filter((discount) => {
            const expiryDate = new Date(discount.expires_at);
            return expiryDate > currentDate;
          });

          setDiscounts(activeDiscounts);
          console.log("Active discounts:", activeDiscounts);
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

  const handleClaimVoucher = async (discountId: number) => {
    try {
      setClaimingVouchers((prev) => ({ ...prev, [discountId]: true }));
      const result = await voucherService.claimDiscount(discountId);

      if (result.success) {
        toast.success("Voucher added to your profile", {
          style: {
            background: "#1E1E1E",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #333",
          },
          iconTheme: {
            primary: "#10B981",
            secondary: "#1E1E1E",
          },
        });
      } else {
        toast.error(result.message || "Failed to claim voucher", {
          style: {
            background: "#1E1E1E",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #333",
          },
          iconTheme: {
            primary: "#EF4444",
            secondary: "#1E1E1E",
          },
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        let toastMessage = "Failed to claim voucher";

        if (errorMessage.includes("already claimed")) {
          toastMessage = "You've already claimed this voucher";
        } else if (errorMessage.includes("expired")) {
          toastMessage = "This voucher has expired";
        } else if (errorMessage.includes("Authentication required")) {
          toastMessage = "Please login to claim vouchers";
        } else {
          toastMessage = errorMessage || "Failed to claim voucher";
        }

        toast.error(toastMessage, {
          style: {
            background: "#1E1E1E",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #333",
          },
          iconTheme: {
            primary: "#EF4444",
            secondary: "#1E1E1E",
          },
        });
        console.error("Error claiming voucher:", err);
      } else {
        toast.error("An unexpected error occurred", {
          style: {
            background: "#1E1E1E",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #333",
          },
        });
        console.error("Unexpected error claiming voucher:", err);
      }
    } finally {
      setClaimingVouchers((prev) => ({ ...prev, [discountId]: false }));
    }
  };

  // Helper function to format expiration date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);

    // Get the difference in days between now and expiry date
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) {
      // Return "Ends in X days" with appropriate styling
      return (
        <span className="text-sm font-medium text-rose-500">
          {diffDays === 1 ? "Ends tomorrow" : `Ends in ${diffDays} days`}
        </span>
      );
    } else {
      // Return the normal date format
      return <span className="text-sm">Ends: {date.toLocaleDateString()}</span>;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="text-gray-400 font-medium">Loading Discounts...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md flex items-center"
        >
          <AlertCircle className="text-red-500 mr-4 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-1">
              Error Loading Discounts
            </h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <Toaster position="top-right" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {discounts.map((discount) => (
          <motion.div
            key={discount.discount_id}
            variants={itemVariants}
            whileHover="hover"
            className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800 transition-all"
          >
            <div className="relative">
              {discount.thumbnail ? (
                <img
                  src={discount.thumbnail}
                  alt={discount.discount_code}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-neutral-800 flex flex-col items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mb-2 opacity-30" />
                  <span className="text-sm font-medium">No Image</span>
                </div>
              )}

              {/* Badge overlay */}
              <div className="absolute top-3 left-3">
                <div className="bg-gradient-to-r from-rose-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  {discount.discount_type}
                </div>
              </div>

              {/* Discount value badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                  <span>
                    {discount.discount_type === "percentage"
                      ? `${
                          discount.discount_value > 100
                            ? "100"
                            : discount.discount_value
                        }% OFF`
                      : `Rp${discount.discount_value.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">
                {discount.discount_code}
              </h3>

              <div className="flex flex-col space-y-3 mb-4">
                <div className="flex items-center text-neutral-400">
                  <MapPin className="mr-2 w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium">
                    {discount.store?.store_name || "Unknown Store"}
                  </span>
                </div>

                {/* Expiration date display */}
                <div className="flex items-center text-neutral-400">
                  <Clock className="mr-2 w-4 h-4 text-neutral-500" />
                  {formatExpiryDate(discount.expires_at)}
                </div>

                <div className="flex items-center text-neutral-400">
                  <Tag className="mr-2 w-4 h-4 text-neutral-500" />
                  <span className="text-sm">
                    {discount.minimum_order
                      ? `Min. Order: Rp${discount.minimum_order.toLocaleString()}`
                      : "All Products In Store"}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  claimingVouchers[discount.discount_id]
                    ? "bg-neutral-700 text-neutral-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/20"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!claimingVouchers[discount.discount_id]) {
                    handleClaimVoucher(discount.discount_id);
                  }
                }}
                disabled={claimingVouchers[discount.discount_id]}
              >
                {claimingVouchers[discount.discount_id] ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    <span>Claiming...</span>
                  </div>
                ) : (
                  "Claim Voucher"
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {discounts.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-neutral-400"
        >
          <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
          <h3 className="text-xl font-medium mb-2">No Discounts Available</h3>
          <p className="text-neutral-500 text-center max-w-md">
            There are currently no active discounts available. Please check back
            later.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DiscountsList;
