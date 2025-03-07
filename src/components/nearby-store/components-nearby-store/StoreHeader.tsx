"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function StoreHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-gray-800/80 rounded-full mb-6 border border-gray-700/50">
        <MapPin className="w-4 h-4 text-gray-300" />
        <span className="text-sm font-medium text-gray-300">Store Locator</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
        Find Nearby Stores
      </h1>

      <div className="h-1 w-20 bg-gradient-to-r from-gray-700 to-gray-600 mx-auto rounded-full mb-6"></div>

      <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
        Discover TechElite stores in your area for the best tech shopping
        experience
      </p>
    </motion.div>
  );
}
