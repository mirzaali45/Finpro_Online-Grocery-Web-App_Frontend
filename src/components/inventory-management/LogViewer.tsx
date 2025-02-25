// @/components/LogViewer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { LogService } from "@/services/log.service";
import { Log } from "@/types/log-types";
import { X } from "lucide-react";

interface LogViewerProps {
  onClose: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchedLogs = LogService.getLogs();
    setLogs(
      fetchedLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
  }, []);

  const handleClearLogs = () => {
    LogService.clearLogs();
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            Application Logs
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearLogs}
              className="text-red-500 hover:bg-red-50 p-2 rounded"
            >
              Clear Logs
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-grow p-4">
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No logs available
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2">Action</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Module</th>
                  <th className="text-left p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.description}</td>
                    <td className="p-2">{log.module}</td>
                    <td className="p-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
