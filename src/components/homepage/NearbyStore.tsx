"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { StoreData } from "@/types/store-types";
import { storeService } from "@/services/store-admin.service";
import { Icon, DivIcon } from "leaflet";
import { useGeolocation } from "@/components/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distanceCalc";

// Dynamically import Leaflet components and CSS
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

interface StoreWithDistance extends StoreData {
  distance?: number;
  created_at?: string;
  updated_at?: string;
}

export default function NearbyStore() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [nearestStores, setNearestStores] = useState<StoreWithDistance[]>([]);
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

  // Fetch stores from database
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const fetchedStores = await storeService.getStores();

        // Filter out stores without coordinates - Fix for 'filter' not existing on StoreApiResponse
        // Assuming fetchedStores is array-like, we first ensure it's an array
        const storesArray = Array.isArray(fetchedStores)
          ? fetchedStores
          : [fetchedStores];

        // Filter out stores without coordinates with proper typing
        const validStores = storesArray.filter(
          (store: StoreWithDistance) => store.latitude && store.longitude
        );

        setStores(validStores);

        // If we already have location, sort stores by distance
        if (location) {
          const sorted = sortByDistance(
            validStores,
            location.latitude,
            location.longitude,
            (store: StoreWithDistance) => ({
              lat: store.latitude,
              lon: store.longitude,
            })
          );

          // Select 3 nearest stores
          setNearestStores(sorted.slice(0, 3));
        } else {
          // Without location, just show some stores
          setNearestStores(validStores.slice(0, 3));
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to fetch store locations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  // Sort stores when location is available
  useEffect(() => {
    if (location && stores.length > 0) {
      const sorted = sortByDistance(
        stores,
        location.latitude,
        location.longitude,
        (store: StoreWithDistance) => ({
          lat: store.latitude,
          lon: store.longitude,
        })
      );

      // Select 3 nearest stores
      setNearestStores(sorted.slice(0, 3));
    }
  }, [location, stores]);

  // Render loading state
  if (loading || locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Render error state
  if (error || locationError || stores.length === 0) {
    return (
      <div className="h-auto bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-gray-700/50">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {stores.length === 0 ? "No Stores Found" : "Error"}
          </h2>
          <p className="text-gray-300 mb-6">
            {error || locationError || "Unable to retrieve store information"}
          </p>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto bg-gradient-to-br from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Nearby Stores
          </h1>
          <p className="mt-4 text-gray-400">
            Find TechElite stores near your location
          </p>
        </motion.div>

        {location && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-700/50"
              style={{ height: "400px" }}
            >
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
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
                    position={[
                      typeof store.latitude === "string"
                        ? parseFloat(store.latitude)
                        : store.latitude || 0,
                      typeof store.longitude === "string"
                        ? parseFloat(store.longitude)
                        : store.longitude || 0,
                    ]}
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
            </motion.div>

            {/* New section to display user's address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Your Current Location
                  </h2>
                  <p className="text-gray-300">{location.address}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nearestStores.map((store, index) => (
            <motion.div
              key={store.store_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {store.store_name}
                </h3>
                <span className="absolute top-0 right-0 text-sm text-purple-400">
                  {store.distance?.toFixed(1)} km
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-gray-300">
                      {store.address}, {store.subdistrict}, {store.city},{" "}
                      {store.province} {store.postcode}
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-1"
                    >
                      View on Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {store.description && (
                  <div className="text-gray-400 italic">
                    {store.description}
                  </div>
                )}

                <motion.a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
