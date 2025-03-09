"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface MapComponentProps {
  location: Location;
  nearestStores: Store[];
  instanceId: string;
}

interface MapUpdaterProps {
  center: L.LatLngExpression;
}

// Define default icon URLs for consistent access
const DEFAULT_ICON_URLS = {
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
};

// Component to handle map updates - safer approach
const MapUpdater = ({ center }: MapUpdaterProps) => {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update the map view safely
    try {
      map.setView(center, map.getZoom());
    } catch (e) {
    }

    // Use a ref to safely handle the timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a new timeout that safely tries to invalidate the map size
    timeoutRef.current = setTimeout(() => {
      try {
        // Check if map is still mounted and has a container
        if (
          map &&
          map.getContainer() &&
          document.body.contains(map.getContainer())
        ) {
          map.invalidateSize();
        }
      } catch (e) {
        console.error("Error invalidating map size:", e);
      }
    }, 300); // Give more time for the map to initialize properly

    // Also handle window resize events
    const resizeHandler = () => {
      try {
        if (
          map &&
          map.getContainer() &&
          document.body.contains(map.getContainer())
        ) {
          map.invalidateSize();
        }
      } catch (e) {
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      // Clear any pending timeouts when the component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [map, center]);

  return null;
};

// Create a component to initialize store icons
const StoreIcons = ({
  onIconsLoaded,
}: {
  onIconsLoaded: (icon: L.Icon) => void;
}) => {
  useEffect(() => {
    // Fix default Leaflet icons
    L.Icon.Default.mergeOptions(DEFAULT_ICON_URLS);

    try {
      // Custom store icon (with error handling)
      const icon = new L.Icon({
        iconUrl: "/store-pin.png",
        iconSize: [38, 50],
        iconAnchor: [19, 50],
        popupAnchor: [0, -50],
        shadowUrl: DEFAULT_ICON_URLS.shadowUrl,
      });
      onIconsLoaded(icon);
    } catch (error) {
      console.error("Error setting up store icon:", error);
      // Create a standard icon with default values as fallback
      const fallbackIcon = new L.Icon({
        ...DEFAULT_ICON_URLS,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      onIconsLoaded(fallbackIcon);
    }
  }, [onIconsLoaded]);

  return null;
};

const LeafletMapComponent = ({
  location,
  nearestStores,
  instanceId,
}: MapComponentProps) => {
  const [storeIcon, setStoreIcon] = useState<L.Icon | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerId = `leaflet-map-${instanceId}`;

  // Set center coordinates
  const center: L.LatLngExpression = [location.latitude, location.longitude];

  // Ensure the map container is visible before rendering the map
  useEffect(() => {
    // A short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Log when this component is mounted/unmounted to help with debugging
  useEffect(() => {
    return () => {
    };
  }, [instanceId]);

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
        <div className="text-gray-400">Preparing map...</div>
      </div>
    );
  }

  return (
    <div id={mapContainerId} className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} />

        <StoreIcons onIconsLoaded={setStoreIcon} />

        {/* User location marker */}
        <Marker
          position={
            [location.latitude, location.longitude] as L.LatLngExpression
          }
        >
          <Popup>
            <div className="font-semibold">Your Location</div>
            <div className="text-sm">{location.address}</div>
          </Popup>
        </Marker>

        {/* Store markers - only render when icon is loaded */}
        {storeIcon &&
          nearestStores.map((store) => (
            <Marker
              key={`${store.store_id}-${instanceId}`}
              position={[store.latitude, store.longitude] as L.LatLngExpression}
              icon={storeIcon}
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
    </div>
  );
};

export default LeafletMapComponent;
