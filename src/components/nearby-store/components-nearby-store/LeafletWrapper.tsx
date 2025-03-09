"use client";

import React, { useState, useEffect } from "react";
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

interface LeafletWrapperProps {
  location: Location;
  nearestStores: Store[];
}

// Add interface for LeafletMap props
interface LeafletMapProps {
  location: Location;
  nearestStores: Store[];
  instanceId: string;
}

// This is a key technique to avoid SSR issues and Container reuse issues
// By loading the map component with dynamic import and a new instance ID each time
const LeafletMap = ({
  location,
  nearestStores,
  instanceId,
}: LeafletMapProps) => {
  // Dynamically import the actual map component
  const MapComponent = dynamic(() => import("./LeafletMapComponent"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    ),
  });

  return (
    <div id={`map-container-${instanceId}`} className="w-full h-full">
      <MapComponent
        location={location}
        nearestStores={nearestStores}
        instanceId={instanceId}
      />
    </div>
  );
};

// Main wrapper component that ensures a fresh map instance on each render
export default function LeafletWrapper({
  location,
  nearestStores,
}: LeafletWrapperProps) {
  // Generate a unique ID for each instance of the map
  const [instanceId, setInstanceId] = useState<string>("");

  // Update the instance ID whenever the location changes
  // This forces a completely new map component to be created
  useEffect(() => {
    setInstanceId(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, [location.latitude, location.longitude]);

  // Don't render until we have an instance ID
  if (!instanceId) {
    return (
      <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
        <div className="text-gray-400">Initializing map...</div>
      </div>
    );
  }

  return (
    <LeafletMap
      location={location}
      nearestStores={nearestStores}
      instanceId={instanceId}
    />
  );
}
