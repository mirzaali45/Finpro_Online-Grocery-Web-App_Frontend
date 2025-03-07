"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { formatRupiah } from "@/helper/currencyRp";

interface Product {
  product_id: number;
  name: string;
  price?: number;
  ProductImage?: {
    url: string;
  }[];
}

interface Discount {
  discount_id: number;
  discount_code: string;
  discount_type: "percentage" | "point";
  discount_value: number;
  product_id: number;
  store_id?: number;
  product?: Product;
  minimum_order: number;
  expires_at: string;
  is_active: boolean;
  thumbnail?: string;
}

export default function DiscountList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [formData, setFormData] = useState({
    discount_code: "",
    discount_type: "percentage",
    discount_value: 0,
    minimum_order: 0,
    expires_at: "",
    thumbnail: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  useEffect(() => {
    if (selectedDiscount) {
      setFormData({
        discount_code: selectedDiscount.discount_code,
        discount_type: selectedDiscount.discount_type,
        discount_value: selectedDiscount.discount_value,
        minimum_order: selectedDiscount.minimum_order || 0,
        expires_at: new Date(selectedDiscount.expires_at)
          .toISOString()
          .split("T")[0],
        thumbnail: selectedDiscount.thumbnail || "",
      });
      setThumbnailFile(null); // Reset file input when selecting a new discount
    }
  }, [selectedDiscount]);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount/store`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }

      const data = await response.json();
      setDiscounts(data.data || []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      toast.error("Failed to load discounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsUpdateModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "discount_value" || name === "minimum_order"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDiscount) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      // Validate percentage discount
      if (
        formData.discount_type === "percentage" &&
        formData.discount_value > 100
      ) {
        toast.error("Percentage discount cannot exceed 100%");
        return;
      }

      // Create a base data object with properly formatted values
      const baseData = {
        discount_code: formData.discount_code,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        minimum_order: Number(formData.minimum_order) || 0,
        product_id: Number(selectedDiscount.product_id),
        store_id: Number(selectedDiscount.store_id),
        expires_at: formData.expires_at,
      };

      console.log("Update data:", baseData); // Debug log

      // If we have a new thumbnail file, need to use FormData instead of JSON
      if (thumbnailFile) {
        const formDataObj = new FormData();

        // For FormData, we need to ensure store_id and product_id are explicitly numbers
        formDataObj.append("discount_code", baseData.discount_code);
        formDataObj.append("discount_type", baseData.discount_type);
        formDataObj.append("discount_value", String(baseData.discount_value));
        formDataObj.append("minimum_order", String(baseData.minimum_order));
        formDataObj.append("product_id", String(baseData.product_id));
        formDataObj.append("store_id", String(baseData.store_id));
        formDataObj.append("expires_at", baseData.expires_at);

        // Append the file
        formDataObj.append("thumbnail", thumbnailFile);

        console.log("Sending with file upload"); // Debug log

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount/${selectedDiscount.discount_id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              // Do not set Content-Type when sending FormData
            },
            body: formDataObj,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData); // Debug log
          throw new Error(errorData.message || "Failed to update discount");
        }
      } else {
        // No new file, just send JSON data
        console.log("Sending without file upload"); // Debug log

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount/${selectedDiscount.discount_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(baseData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData); // Debug log
          throw new Error(errorData.message || "Failed to update discount");
        }
      }

      toast.success("Discount updated successfully");
      setIsUpdateModalOpen(false);
      fetchDiscounts(); // Refresh the list
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update discount"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isDiscountActive = (expiresAt: string) => {
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    return now < expiryDate;
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-pulse text-xl">Loading discounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Store Discounts</h2>
      </div>

      {discounts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No discounts found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applies To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {discounts.map((discount) => (
                <tr
                  key={discount.discount_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {discount.thumbnail && (
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={discount.thumbnail}
                            alt={`${discount.discount_code} thumbnail`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="font-medium text-gray-900 dark:text-white">
                        {discount.discount_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        discount.discount_type === "percentage"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {discount.discount_type === "percentage"
                        ? "Percentage"
                        : "Point"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.discount_type === "percentage"
                      ? `${discount.discount_value}%`
                      : formatRupiah(discount.discount_value)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.product_id === 0 ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        All Products
                      </span>
                    ) : (
                      <span className="text-sm">
                        {discount.product?.name ||
                          `Can Apply to All Product in Store`}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.minimum_order > 0 ? (
                      <span className="text-sm">
                        {formatRupiah(discount.minimum_order)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm">
                      {formatDate(discount.expires_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        isDiscountActive(discount.expires_at)
                          ? "success"
                          : "destructive"
                      }
                    >
                      {isDiscountActive(discount.expires_at)
                        ? "Active"
                        : "Expired"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(discount)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Discount</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="discount_code">Discount Code</Label>
                <Input
                  id="discount_code"
                  name="discount_code"
                  value={formData.discount_code}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_type">Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) =>
                    handleSelectChange("discount_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="point">Point</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_value">
                  Discount Value (
                  {formData.discount_type === "percentage" ? "%" : "Points"})
                </Label>
                <Input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max={
                    formData.discount_type === "percentage" ? "100" : undefined
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minimum_order">Minimum Order</Label>
                <Input
                  id="minimum_order"
                  name="minimum_order"
                  type="number"
                  value={formData.minimum_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expires_at">Expiration Date</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex gap-4 items-center">
                  {formData.thumbnail && !thumbnailFile && (
                    <div className="relative h-16 w-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={formData.thumbnail}
                        alt="Current thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {thumbnailFile && (
                    <div className="h-16 w-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <p className="text-xs text-center px-1">
                        New file selected
                      </p>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image to change the thumbnail
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Discount"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
