"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Building2, Save } from "lucide-react";
import { InputField } from "@/components/store-management/StoreInputFields";
import { StoreData, FormErrorsWithIndex, StoreDataV2 } from "@/types/store-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface EditStoreFormProps {
  formData: StoreData;
  errors: FormErrorsWithIndex;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<StoreData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  dataStore: StoreDataV2
}
function MapClickHandler({
  setFormData,
}: {
  setFormData: React.Dispatch<React.SetStateAction<StoreData>>;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });
  return null;
}

export default function EditStoreForm({
  formData,
  errors,
  handleChange,
  setFormData,
  handleSubmit,
  isSubmitting,
  dataStore
}: EditStoreFormProps) {
  // State untuk menyimpan posisi marker
  const [markerPosition, setMarkerPosition] = useState([formData.latitude || -6.19676128457438, formData.longitude || 106.83754574840799]);
  const handleNumberChange =
    (fieldName: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value ? parseFloat(value) : undefined,
      }));
    };
    // Efek untuk mengatur default values saat formData berubah
      useEffect(() => {
        if (formData) {
          setMarkerPosition([formData.latitude || -6.19676128457438, formData.longitude || 106.83754574840799]);
        }
      }, [formData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e).catch((error) => {
          console.error("Submit error:", error);
        });
      }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="store_name"
          label="Store Name"
          Icon={Building2}
          value={formData.store_name}
          error={errors.store_name}
          onChange={handleChange}
        />
        <InputField
          name="subdistrict"
          label="Subdistrict"
          Icon={MapPin}
          value={formData.subdistrict}
          error={errors.subdistrict}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="city"
          label="City"
          Icon={MapPin}
          value={formData.city}
          error={errors.city}
          onChange={handleChange}
        />
        <InputField
          name="province"
          label="Province"
          Icon={MapPin}
          value={formData.province}
          error={errors.province}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="address"
          label="Full Address"
          Icon={MapPin}
          value={formData.address}
          error={errors.address}
          onChange={handleChange}
        />
        <InputField
          name="postcode"
          label="Postcode"
          Icon={MapPin}
          value={formData.postcode}
          error={errors.postcode}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="latitude"
          label="Latitude"
          Icon={MapPin}
          type="number"
          value={formData.latitude?.toString()}
          error={errors.latitude?.toString()}
          onChange={handleNumberChange("latitude")}
        />
        <InputField
          name="longitude"
          label="Longitude"
          Icon={MapPin}
          type="number"
          value={formData.longitude}
          error={errors.longitude}
          onChange={handleNumberChange("longitude")}
        />
      </div>

      <div className="mb-6 h-[300px] w-full">
        <MapContainer
          center={markerPosition}
          zoom={7}
          className="h-full w-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {formData.latitude && formData.longitude && (
            <Marker position={markerPosition}>
              <Popup>
                <span>Store Location</span>
              </Popup>
            </Marker>
          )}
          <MapClickHandler setFormData={setFormData} />
        </MapContainer>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5 mr-2" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
