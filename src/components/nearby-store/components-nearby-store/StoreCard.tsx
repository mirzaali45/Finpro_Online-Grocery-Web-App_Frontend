"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Clock,
  Phone,
  Building,
} from "lucide-react";

interface Store {
  store_id: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number;
  longitude: number;
  description?: string;
  distance?: number;
}

interface StoreCardProps {
  store: Store;
  index: number;
}

export default function StoreCard({ store, index }: StoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-black/30 hover:translate-y-[-2px] group"
    >
      {/* Top section with store name and distance */}
      <div className="relative border-b border-gray-700/50 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-800 border border-gray-700">
            <Building className="w-5 h-5 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">
            {store.store_name}
          </h3>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
            <Clock className="w-3.5 h-3.5" />
            Open Now
          </span>

          {store.distance !== undefined && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-gray-800 text-green-400 border border-gray-700">
              <Navigation className="w-3.5 h-3.5" />
              {store.distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>

      {/* Store details */}
      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gray-300">
              {store.address}, {store.subdistrict}, {store.city},{" "}
              {store.province} {store.postcode}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1 mt-1 group-hover:underline"
            >
              View on Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Phone number (dummy) */}
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-300">
              {/* Using a dummy phone number format */}
              +62 {Math.floor(Math.random() * 900) + 100}-
              {Math.floor(Math.random() * 9000) + 1000}-
              {Math.floor(Math.random() * 9000) + 1000}
            </p>
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 text-gray-400 italic text-sm">
            {store.description}
          </div>
        )}

        {/* Get directions button */}
        <motion.a
          href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-700 hover:border-gray-600 rounded-lg flex items-center justify-center gap-2 group-hover:shadow-lg transition-all duration-300"
        >
          <span className="font-medium text-white">Get Directions</span>
          <Navigation className="w-4 h-4 text-white" />
        </motion.a>
      </div>
    </motion.div>
  );
}
