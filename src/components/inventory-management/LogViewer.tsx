"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  RefreshCw,
  Filter,
  Calendar,
  ArrowUpDown,
  ArrowRightLeft,
  Download,
} from "lucide-react";
import LogService from "@/services/log.service";
import { InventoryService } from "@/services/useInventoryAdmin";
import { LogEntry } from "@/types/log-types";
import { Inventory } from "@/types/inventory-types";
interface InventoryLogItem {
  id: number;
  name: string;
  store: string;
  quantity: number;
}

export const LogViewer = ({ onClose }: { onClose: () => void }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [inventoryMap, setInventoryMap] = useState<Map<number, Inventory>>(
    new Map()
  );
  const [filter, setFilter] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchInventoryData();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Get only inventory management logs
      const filterOptions = {
        module: "Inventory Management",
        ...filter,
      };

      // Get logs with filtering
      const logData = await LogService.getLogs(filterOptions);

      // Filter to only show Update, Delete, and Transfer actions if no specific action filter
      const filteredLogs = filter.action
        ? logData
        : logData.filter(
            (log: LogEntry) =>
              log.action === "Update" ||
              log.action === "Delete" ||
              log.action === "Transfer"
          );

      setLogs(filteredLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryData = async () => {
    try {
      // Get all inventory items to build a reference map
      const response = await InventoryService.getInventory();
      const inventoryItems = response.data;

      // Create a map of inventory IDs to inventory items for quick lookup
      const map = new Map<number, Inventory>();
      inventoryItems.forEach((item) => {
        map.set(item.inv_id, item);
      });

      setInventoryMap(map);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchLogs();
  };

  const resetFilters = () => {
    setFilter({
      action: "",
      startDate: "",
      endDate: "",
    });
    fetchLogs();
  };

  const formatDate = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Format date for CSV file name
  const formatDateForFileName = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Helper function to parse and display log description content
  const renderLogDescription = (log: LogEntry) => {
    try {
      // For Update, Delete, and Transfer actions, try to parse the description if it's JSON
      if (log.description.startsWith("{") || log.description.startsWith("[")) {
        const data = JSON.parse(log.description);

        // Handle Update logs
        if (log.action === "Update" && data.updates) {
          const operation =
            data.updates.operation === "add" ? "increased by" : "decreased by";
          const inventoryItem = inventoryMap.get(data.itemId);

          if (inventoryItem) {
            return (
              <div>
                <span className="font-medium">
                  {inventoryItem.product.name}
                </span>
                <div className="text-xs text-gray-500">ID: {data.itemId}</div>
                <div className="mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Store:
                  </span>{" "}
                  {inventoryItem.store.store_name} |
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Warehouse Stock:
                  </span>{" "}
                  <span
                    className={
                      data.updates.operation === "add"
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-amber-600 dark:text-amber-400 font-medium"
                    }
                  >
                    {operation} {data.updates.qty || "N/A"}
                  </span>
                </div>
              </div>
            );
          } else {
            // Fallback if inventory item not found in map
            return (
              <div>
                <span className="font-medium">Item ID: {data.itemId}</span>
                <div className="mt-1">
                  Warehouse Stock {operation} {data.updates.qty || "N/A"}
                </div>
              </div>
            );
          }
        }

        // Handle Transfer logs
        if (log.action === "Transfer" && data.transferAmount) {
          const inventoryItem = inventoryMap.get(data.itemId);

          if (inventoryItem) {
            return (
              <div>
                <span className="font-medium">
                  {inventoryItem.product.name}
                </span>
                <div className="text-xs text-gray-500">ID: {data.itemId}</div>
                <div className="mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Location:
                  </span>{" "}
                  {inventoryItem.store.store_name} |
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Action:
                  </span>{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Transferred {data.transferAmount} units
                  </span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    from warehouse to store
                  </span>
                </div>
              </div>
            );
          } else {
            // Fallback if inventory item not found in map
            return (
              <div>
                <span className="font-medium">Item ID: {data.itemId}</span>
                <div className="mt-1">
                  Transferred {data.transferAmount} units from warehouse to
                  store
                </div>
              </div>
            );
          }
        }

        // Handle Delete logs with single item
        if (log.action === "Delete" && data.item) {
          // First check if we can find this item in our inventory map (unlikely for deleted items)
          const inventoryItem = inventoryMap.get(data.item.id);

          if (inventoryItem) {
            return (
              <div>
                <span className="font-medium">
                  {inventoryItem.product.name}
                </span>
                <div className="mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Store:
                  </span>{" "}
                  {inventoryItem.store.store_name} |
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Quantity:
                  </span>{" "}
                  {inventoryItem.qty}
                </div>
              </div>
            );
          } else {
            // Use the data from the log itself
            return (
              <div>
                <span className="font-medium">{data.item.name}</span>
                <div className="mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Store:
                  </span>{" "}
                  {data.item.store} |
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    Quantity:
                  </span>{" "}
                  {data.item.quantity}
                </div>
              </div>
            );
          }
        }

        // Handle Delete logs with multiple items
        if (log.action === "Delete" && data.items) {
          return (
            <div>
              <span className="font-medium">
                Deleted {data.items.length} items
              </span>
              <div className="mt-1">
                {data.items
                  .map((item: InventoryLogItem, index: number) => {
                    // Try to get more details from inventory (unlikely for deleted items)
                    const inventoryItem = inventoryMap.get(item.id);
                    const displayName = inventoryItem
                      ? inventoryItem.product.name
                      : item.name;
                    const storeName = inventoryItem
                      ? inventoryItem.store.store_name
                      : item.store;

                    return (
                      <div key={index} className="text-sm">
                        {displayName} from {storeName}
                      </div>
                    );
                  })
                  .slice(0, 2)}
                {data.items.length > 2 && (
                  <div className="text-xs text-gray-500 mt-1">
                    and {data.items.length - 2} more...
                  </div>
                )}
              </div>
            </div>
          );
        }
      }

      // Default to showing the raw description
      return <span>{log.description}</span>;
    } catch (e) {
      // If JSON parsing fails, just show the original description
      return <span>{log.description}</span>;
    }
  };

  // Helper function to extract text description for CSV export
  const getPlainTextDescription = (log: LogEntry) => {
    try {
      if (log.description.startsWith("{") || log.description.startsWith("[")) {
        const data = JSON.parse(log.description);

        // Handle Update logs
        if (log.action === "Update" && data.updates) {
          const operation =
            data.updates.operation === "add" ? "increased by" : "decreased by";
          const inventoryItem = inventoryMap.get(data.itemId);

          if (inventoryItem) {
            return `${inventoryItem.product.name} at ${inventoryItem.store.store_name} - Warehouse Stock ${operation} ${data.updates.qty}`;
          } else {
            return `Item ID ${data.itemId} - Warehouse Stock ${operation} ${data.updates.qty}`;
          }
        }

        // Handle Transfer logs
        if (log.action === "Transfer" && data.transferAmount) {
          const inventoryItem = inventoryMap.get(data.itemId);

          if (inventoryItem) {
            return `${inventoryItem.product.name} at ${inventoryItem.store.store_name} - Transferred ${data.transferAmount} units from warehouse to store`;
          } else {
            return `Item ID ${data.itemId} - Transferred ${data.transferAmount} units from warehouse to store`;
          }
        }

        // Handle Delete logs
        if (log.action === "Delete") {
          if (data.item) {
            const name = data.item.name || `Item ID ${data.item.id}`;
            return `Deleted ${name} from ${data.item.store}`;
          } else if (data.items) {
            return `Deleted ${data.items.length} items`;
          }
        }
      }

      // Default to the raw description
      return log.description;
    } catch (e) {
      return log.description;
    }
  };

  // Function to download logs as CSV
  const downloadLogs = () => {
    setIsDownloading(true);

    try {
      // Create CSV header
      const headers = ["ID", "Action", "Module", "Description", "Timestamp"];
      const csvContent = [
        headers.join(","),
        ...logs.map((log) =>
          [
            log.id,
            log.action,
            log.module,
            `"${getPlainTextDescription(log).replace(/"/g, '""')}"`, // Escape quotes for CSV
            formatDate(log.timestamp),
          ].join(",")
        ),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `inventory-logs-${formatDateForFileName(new Date())}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading logs:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get action-specific styles
  const getActionStyles = (action: string) => {
    switch (action) {
      case "Update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Delete":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Transfer":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Helper function to get action-specific icons
  const getActionIcon = (action: string) => {
    switch (action) {
      case "Update":
        return (
          <ArrowUpDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "Delete":
        return <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "Transfer":
        return (
          <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        );
      default:
        return (
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Inventory Logs
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadLogs}
              disabled={isDownloading || logs.length === 0}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              title="Download logs as CSV"
            >
              <Download
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${
                  isDownloading ? "animate-pulse" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Filter logs"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={fetchLogs}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Refresh logs"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="action"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Action
                </label>
                <select
                  id="action"
                  name="action"
                  value={filter.action}
                  onChange={handleFilterChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="">All Actions</option>
                  <option value="Update">Update</option>
                  <option value="Delete">Delete</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Loading logs...
                </p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No logs found
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {filter.action || filter.startDate || filter.endDate
                  ? "Try adjusting the filters to see more results."
                  : "No inventory logs available."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:block">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.action === "Update"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : log.action === "Delete"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : log.action === "Transfer"
                            ? "bg-indigo-100 dark:bg-indigo-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        {getActionIcon(log.action)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getActionStyles(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {log.module}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {renderLogDescription(log)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>
            Showing {logs.length} logs • Only display Update, Delete and
            Transfer actions by default
          </span>
          {logs.length > 0 && (
            <button
              onClick={downloadLogs}
              disabled={isDownloading}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline"
            >
              <Download className="w-3 h-3" />
              {isDownloading ? "Downloading..." : "Download CSV"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
