"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorViewProps {
  error: string;
  debugInfo: string | null;
  onRetry: () => void;
}

export default function ErrorView({
  error,
  debugInfo,
  onRetry,
}: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[400px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gray-800/5 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -right-[300px] w-[600px] h-[600px] rounded-full bg-gray-800/5 blur-3xl"></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(50, 50, 50, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 50, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-gray-800"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 border border-gray-700">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {error.includes("No stores") ? "No Stores Found" : "Error"}
          </h2>

          <p className="text-gray-300 mb-6">{error}</p>

          {/* Added debug info */}
          {debugInfo && (
            <div className="w-full text-sm text-gray-400 mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700/50">
              <p className="font-medium text-gray-300 mb-1">
                Debug Information:
              </p>
              <p>{debugInfo}</p>
              <p className="mt-1 text-xs text-gray-500">
                Check browser console for more details
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg transition-colors shadow-lg border border-gray-600"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="font-medium">Try Again</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
