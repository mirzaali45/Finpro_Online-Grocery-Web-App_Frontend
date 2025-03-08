"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Icon, DivIcon } from "leaflet";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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

export default function StoreMapView({
  location,
  nearestStores,
}: StoreMapViewProps) {
  const [storeMarkerIcon, setStoreMarkerIcon] = useState<
    Icon | DivIcon | undefined
  >(undefined);

  // Ensure this only runs on client
  useEffect(() => {
    // Dynamic import of Leaflet to ensure it's only loaded on client
    const loadLeaflet = async () => {
      try {
        const L = await import("leaflet");
        const icon = L.icon({
          iconUrl: "/store-pin.png",
          iconSize: [38, 50],
          iconAnchor: [19, 50],
          popupAnchor: [0, -50],
        });
        setStoreMarkerIcon(icon);
      } catch (error) {
        console.error("Failed to load Leaflet:", error);
      }
    };

    loadLeaflet();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-xl overflow-hidden shadow-xl border border-gray-800 relative shadow-gray-900/50"
      style={{ height: "450px" }}
    >
      {/* Map container elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-800/10"></div>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-10" // Lower z-index for map
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <div className="font-semibold">Your Location</div>
            <div className="text-sm">{location.address}</div>
          </Popup>
        </Marker>

        {/* Store markers */}
        {nearestStores.map((store) => (
          <Marker
            key={store.store_id}
            position={[store.latitude, store.longitude]}
            icon={storeMarkerIcon}
          >
            <Popup>
              <div className="font-semibold">{store.store_name}</div>
              <div className="text-sm">
                {store.address}, {store.subdistrict}, {store.city}
              </div>
              <div className="text-sm text-gray-600">
                {store.distance?.toFixed(1)} km away
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-lg py-2 px-4 z-20 border border-gray-800">
        <span className="text-sm font-medium text-gray-300">
          Interactive Map
        </span>
      </div>
    </motion.div>
  );
}
