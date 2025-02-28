// @/services/log.service.ts
import { Log } from "@/types/log-types";

export const LogService = {
  createLog: (logData: Omit<Log, "id">) => {
    try {
      // Retrieve existing logs
      const existingLogs = JSON.parse(localStorage.getItem("appLogs") || "[]");

      // Create a new log entry with a unique ID
      const newLog = {
        ...logData,
        id: Date.now(), // Use timestamp as a simple unique identifier
      };

      // Add the new log
      const updatedLogs = [...existingLogs, newLog];

      // Limit log storage (optional)
      const MAX_LOGS = 100;
      const trimmedLogs = updatedLogs.slice(-MAX_LOGS);

      // Save back to local storage
      localStorage.setItem("appLogs", JSON.stringify(trimmedLogs));

      return newLog;
    } catch (error) {
      console.error("Error creating log:", error);
      return null;
    }
  },

  getLogs: (): Log[] => {
    try {
      return JSON.parse(localStorage.getItem("appLogs") || "[]");
    } catch (error) {
      console.error("Error retrieving logs:", error);
      return [];
    }
  },

  clearLogs: () => {
    localStorage.removeItem("appLogs");
  },
};
