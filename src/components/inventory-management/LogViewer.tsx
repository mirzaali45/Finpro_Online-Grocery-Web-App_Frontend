// components/inventory-management/LogViewer.tsx
import { useState, useEffect, FC, FormEvent } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import LogService from "@/services/log.service";
import { LogEntry, PaginatedResponse } from "@/types/log-types";
import { format } from "date-fns";

interface LogViewerProps {
  onClose: () => void;
}

export const LogViewer: FC<LogViewerProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterModule, setFilterModule] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const options = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        module: filterModule || undefined,
        action: filterAction || undefined,
      };

      const response = await LogService.getLogs(options);

      // If response includes pagination metadata
      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        "pagination" in response
      ) {
        const paginatedResponse = response as PaginatedResponse<LogEntry>;
        setLogs(paginatedResponse.data);
        setPagination(paginatedResponse.pagination);
      } else {
        // Handle case where all logs are returned without pagination
        const logEntries = response as LogEntry[];
        setLogs(logEntries);
        setPagination({
          ...pagination,
          total: logEntries.length,
          totalPages: Math.ceil(logEntries.length / pagination.pageSize),
          hasNextPage:
            pagination.page <
            Math.ceil(logEntries.length / pagination.pageSize),
          hasPrevPage: pagination.page > 1,
        });
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load only
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subsequent loads when page changes
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "module") {
      setFilterModule(value);
    } else {
      setFilterAction(value);
    }

    // Reset to page 1 when filters change
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));

    // Fetch with new filters
    setTimeout(fetchLogs, 0);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchLogs();
  };

  const handleClearLogs = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all logs? This action cannot be undone."
      )
    ) {
      try {
        const success = await LogService.clearLogs();
        if (success) {
          setLogs([]);
          setPagination({
            ...pagination,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } catch (error) {
        console.error("Error clearing logs:", error);
      }
    }
  };

  const getFilteredLogs = () => {
    if (!searchQuery) return logs;

    return logs.filter((log) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(searchLower) ||
        log.description.toLowerCase().includes(searchLower) ||
        log.module.toLowerCase().includes(searchLower)
      );
    });
  };

  const formatTimestamp = (timestamp: string | Date): string => {
    try {
      return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
    } catch (error) {
      return String(timestamp);
    }
  };

  const displayedLogs = getFilteredLogs();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            System Logs
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterModule}
                onChange={(e) => handleFilterChange("module", e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="">All Modules</option>
                <option value="Inventory Management">
                  Inventory Management
                </option>
                {/* Add other modules as needed */}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                value={filterAction}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
              >
                <option value="">All Actions</option>
                <option value="Add">Add</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
                <option value="Refresh">Refresh</option>
                <option value="Error">Error</option>
                <option value="Edit">Edit</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleClearLogs}
              className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Logs
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Loading logs...
                </p>
              </div>
            </div>
          ) : displayedLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No logs found
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {searchQuery || filterModule || filterAction
                  ? "Try changing your search or filter criteria"
                  : "No system logs available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {displayedLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.action === "Add"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : log.action === "Update"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : log.action === "Delete"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : log.action === "Error"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log.module}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-lg truncate">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total > 0
              ? `Showing ${Math.min(
                  (pagination.page - 1) * pagination.pageSize + 1,
                  pagination.total
                )}-${Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )} of ${pagination.total} logs`
              : "No logs found"}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
