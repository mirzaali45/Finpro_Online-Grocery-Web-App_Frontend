"use client";

import React, { useState, useEffect } from "react";
import { StoreData } from "@/types/store-types";
import { storeService } from "@/services/store-admin.service";
import { useGeolocation } from "@/components/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distanceCalc";
import { storeDebugHelper } from "@/utils/storeDebugerHelper";

// Import sub-components
import StoreHeader from "@/components/nearby-store/components-nearby-store/StoreHeader";
import StoreMapView from "@/components/nearby-store/components-nearby-store/StoreMapView";
import CurrentLocationCard from "@/components/nearby-store/components-nearby-store/CurrentLocationCard";
import StoreCard from "@/components/nearby-store/components-nearby-store/StoreCard";
import LoadingView from "@/components/nearby-store/components-nearby-store/LoadingView";
import ErrorView from "@/components/nearby-store/components-nearby-store/ErrorView";

// Define store with distance type that ensures required fields for display
interface StoreWithDistance {
  store_id: number; // Make store_id required
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number; // Make latitude required
  longitude: number; // Make longitude required
  description?: string;
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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Add CSS for z-index control
  useEffect(() => {
    // Add stylesheet to control Leaflet z-index
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-container {
        z-index: 10 !important;
      }
      .leaflet-control {
        z-index: 20 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch stores from database
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const fetchedStores = await storeService.getStores();

        // Log the raw response for debugging
        storeDebugHelper.logStoreResponse(fetchedStores, "Raw API Response");

        // Extract stores array using helper (works with any format)
        const storesArray = storeDebugHelper.extractStores(fetchedStores);

        // Log the extracted stores
        console.log("Extracted stores array:", storesArray);
        console.log("Stores array length:", storesArray.length);

        // Validate stores have required fields
        const validStores: StoreWithDistance[] = storesArray
          .filter((store: any) => {
            // Check for required fields
            const hasStoreId = typeof store.store_id === 'number';
            const hasValidCoordinates = 
              typeof store.latitude === 'number' && 
              typeof store.longitude === 'number';
            
            if (!hasStoreId) {
              console.warn("Store missing ID:", store);
            }
            if (!hasValidCoordinates) {
              console.warn("Store missing valid coordinates:", store);
            }
            
            return hasStoreId && hasValidCoordinates && 
                   store.store_name && store.address && 
                   store.city && store.province && 
                   store.subdistrict && store.postcode;
          })
          .map((store: any) => ({
            store_id: store.store_id,
            store_name: store.store_name,
            address: store.address,
            subdistrict: store.subdistrict,
            city: store.city,
            province: store.province,
            postcode: store.postcode,
            latitude: typeof store.latitude === 'string' ? parseFloat(store.latitude) : store.latitude,
            longitude: typeof store.longitude === 'string' ? parseFloat(store.longitude) : store.longitude,
            description: store.description,
          }));

        console.log("Valid stores with required fields:", validStores.length);

        // Set debug info for UI
        if (validStores.length === 0) {
          setDebugInfo(
            `Found ${storesArray.length} stores, but none have valid required fields`
          );
        }

        setStores(validStores);

        // If we already have location, sort stores by distance
        if (location) {
          const sorted = sortByDistance(
            validStores,
            location.latitude,
            location.longitude,
            (store) => ({
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
        console.error("Store fetch error:", error);
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Unable to fetch store locations";
        setError(errorMsg);
        setDebugInfo(`Error fetching stores: ${errorMsg}`);
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
        (store) => ({
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
    return <LoadingView />;
  }

  // Render error state
  if (error || locationError || stores.length === 0) {
    return (
      <ErrorView 
        error={error || locationError || "No stores found"} 
        debugInfo={debugInfo}
        onRetry={() => {
          setError("");
          setLoading(true);
          window.location.reload();
        }}
      />
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 via-[#0c0c15] to-neutral-950 py-20 overflow-hidden relative">
      {/* Abstract background elements - matching BrandShowcase */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-[400px] -left-[300px] w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-3xl"></div>
        <div className="absolute -bottom-[400px] -right-[300px] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 relative z-10">
        {/* Header */}
        <StoreHeader />

        {/* Map and location info */}
        {location && (
          <>
            <StoreMapView 
              location={location} 
              nearestStores={nearestStores} 
            />
            <CurrentLocationCard location={location} />
          </>
        )}

        {/* Store cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nearestStores.map((store, index) => (
            <StoreCard 
              key={store.store_id} 
              store={store} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}