"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Types for props
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Store {
  store_id: number;
  store_name: string;
  latitude: number;
  longitude: number;
  address: string;
  subdistrict: string;
  city: string;
  distance?: number;
}

interface StoreMapViewProps {
  location: Location;
  nearestStores: Store[];
}

// Dynamically import the entire wrapper component to avoid any SSR issues
const LeafletWrapper = dynamic(() => import("./LeafletWrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function StoreMapView({
  location,
  nearestStores,
}: StoreMapViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-xl overflow-hidden shadow-xl border border-gray-800 relative shadow-gray-900/50"
      style={{ height: "450px" }}
    >
      {/* Map container elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-800/10"></div>

      {/* Leaflet wrapper handles all the map logic and ensures proper cleanup */}
      <div className="relative w-full h-full">
        <LeafletWrapper location={location} nearestStores={nearestStores} />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-lg py-2 px-4 z-20 border border-gray-800">
        <span className="text-sm font-medium text-gray-300">
          Interactive Map
        </span>
      </div>
    </motion.div>
  );
}
