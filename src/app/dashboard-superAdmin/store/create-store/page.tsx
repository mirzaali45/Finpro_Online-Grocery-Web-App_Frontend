"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Building2, Save } from "lucide-react";
import { useStoreForm } from "@/helper/use-store-form";
import { InputField } from "@/components/storeInputFields";
import { StoreService } from "@/services/store.service";
import Swal from "sweetalert2";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Sidebar from "@/components/sidebarSuperAdmin";

export default function CreateStore() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, errors, handleChange, validateForm, setFormData } =
    useStoreForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm()) {
        await StoreService.createStore(formData);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Store created successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        router.push("/dashboard-superAdmin/store");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create store";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberChange =
    (fieldName: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value ? parseFloat(value) : undefined,
      }));
    };
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Map event handling
  function MapClickHandler() {
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
       <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6 flex items-center">
            <Store className="h-8 w-8 mr-4" />
            <h1 className="text-2xl font-bold">Create New Store</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                name="city_id"
                label="City ID"
                Icon={MapPin}
                value={formData.city_id}
                error={errors.city_id}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                name="province"
                label="Province"
                Icon={MapPin}
                value={formData.province}
                error={errors.province}
                onChange={handleChange}
              />
              <InputField
                name="province_id"
                label="Province ID"
                Icon={MapPin}
                value={formData.province_id}
                error={errors.province_id}
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
                label="Latitude (Optional)"
                Icon={MapPin}
                type="number"
                value={formData.latitude?.toString() || ""}
                onChange={handleNumberChange("latitude")}
              />
              <InputField
                name="longitude"
                label="Longitude (Optional)"
                Icon={MapPin}
                type="number"
                value={formData.longitude?.toString() || ""}
                onChange={handleNumberChange("longitude")}
              />
            </div>

            <div className="mb-6">
              <MapContainer
                center={[formData.latitude || 0, formData.longitude || 0]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {formData.latitude && formData.longitude && (
                  <Marker
                    position={[formData.latitude, formData.longitude]}
                    icon={new L.Icon.Default()}
                  >
                    <Popup>
                      <span>Store Location</span>
                    </Popup>
                  </Marker>
                )}
                <MapClickHandler /> {/* Add this component */}
              </MapContainer>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Creating..." : "Create Store"}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
