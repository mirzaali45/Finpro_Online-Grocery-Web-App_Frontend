// services/log.service.ts
import {
  LogEntry,
  LogDetails,
  LogFilterOptions,
  PaginatedResponse,
} from "@/types/log-types";

const LOGS_STORAGE_KEY = "inventory_logs";

// Helper function to safely access localStorage (only in browser)
const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const LogService = {
  /**
   * Get all logs with optional filtering and pagination
   * @param {LogFilterOptions} options - Filter and pagination options
   * @returns {Promise<LogEntry[] | PaginatedResponse<LogEntry>>} Logs or paginated logs
   */
  getLogs: async (
    options: LogFilterOptions = {}
  ): Promise<LogEntry[] | PaginatedResponse<LogEntry>> => {
    try {
      const localStorage = getLocalStorage();
      if (!localStorage) return [];

      const logsString =
        localStorage.getItem(LOGS_STORAGE_KEY) || '{"logs":[]}';
      let { logs } = JSON.parse(logsString) as { logs: LogEntry[] };

      // Apply filters
      if (options.module) {
        logs = logs.filter(
          (log) => log.module.toLowerCase() === options.module!.toLowerCase()
        );
      }

      if (options.action) {
        logs = logs.filter(
          (log) => log.action.toLowerCase() === options.action!.toLowerCase()
        );
      }

      if (options.startDate && options.endDate) {
        const startDate = new Date(options.startDate);
        const endDate = new Date(options.endDate);

        logs = logs.filter((log) => {
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= endDate;
        });
      }

      // Sort by timestamp (newest first)
      logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Apply pagination if requested
      if (options.page && options.pageSize) {
        const page = options.page;
        const pageSize = options.pageSize;
        const startIndex = (page - 1) * pageSize;

        const paginatedLogs = logs.slice(startIndex, startIndex + pageSize);

        // Return with pagination metadata
        return {
          data: paginatedLogs,
          pagination: {
            total: logs.length,
            page,
            pageSize,
            totalPages: Math.ceil(logs.length / pageSize),
            hasNextPage: page < Math.ceil(logs.length / pageSize),
            hasPrevPage: page > 1,
          },
        };
      }

      // Return all logs if no pagination requested
      return logs;
    } catch (error) {
      console.error("Error getting logs:", error);
      return [];
    }
  },

  /**
   * Create a new log entry
   * @param {Omit<LogEntry, 'id'>} logData - Log data
   * @returns {Promise<LogEntry>} Created log entry
   */
  createLog: async (logData: Omit<LogEntry, "id">): Promise<LogEntry> => {
    try {
      const localStorage = getLocalStorage();
      if (!localStorage) {
        throw new Error("localStorage not available");
      }

      const logsString =
        localStorage.getItem(LOGS_STORAGE_KEY) || '{"logs":[]}';
      const { logs } = JSON.parse(logsString) as { logs: LogEntry[] };

      // Generate a new ID
      const newId =
        logs.length > 0 ? Math.max(...logs.map((log) => log.id)) + 1 : 1;

      // Create new log entry
      const newLog: LogEntry = {
        id: newId,
        ...logData,
        timestamp: logData.timestamp || new Date().toISOString(),
      };

      // Add to logs array
      logs.push(newLog);

      // Save back to localStorage
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify({ logs }));

      return newLog;
    } catch (error) {
      console.error("Error creating log:", error);
      throw new Error("Failed to create log");
    }
  },

  /**
   * Delete a log by ID
   * @param {number} id - Log ID to delete
   * @returns {Promise<boolean>} Success or failure
   */
  deleteLog: async (id: number): Promise<boolean> => {
    try {
      const localStorage = getLocalStorage();
      if (!localStorage) return false;

      const logsString =
        localStorage.getItem(LOGS_STORAGE_KEY) || '{"logs":[]}';
      const { logs } = JSON.parse(logsString) as { logs: LogEntry[] };

      const filteredLogs = logs.filter((log) => log.id !== id);

      // If no logs were removed, the ID didn't exist
      if (filteredLogs.length === logs.length) {
        return false;
      }

      // Save back to localStorage
      localStorage.setItem(
        LOGS_STORAGE_KEY,
        JSON.stringify({ logs: filteredLogs })
      );

      return true;
    } catch (error) {
      console.error("Error deleting log:", error);
      return false;
    }
  },

  /**
   * Clear all logs
   * @returns {Promise<boolean>} Success or failure
   */
  clearLogs: async (): Promise<boolean> => {
    try {
      const localStorage = getLocalStorage();
      if (!localStorage) return false;

      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify({ logs: [] }));
      return true;
    } catch (error) {
      console.error("Error clearing logs:", error);
      return false;
    }
  },
};

export default LogService;
