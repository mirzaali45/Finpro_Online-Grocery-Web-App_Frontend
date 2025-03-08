"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, User, Navigation } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface CurrentLocationCardProps {
  location: Location;
}

export default function CurrentLocationCard({
  location,
}: CurrentLocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-gray-800 hover:border-gray-700 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
          <User className="w-6 h-6 text-gray-300" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            Your Current Location
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </h2>

          <p className="text-gray-300 text-lg">{location.address}</p>
        </div>

        <div className="mt-4 md:mt-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-all duration-300"
          >
            <Navigation className="w-4 h-4" />
            <span>View on Maps</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
