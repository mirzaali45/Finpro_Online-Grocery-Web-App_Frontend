import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { addressSchema } from "@/helper/validation-schema-add-address";

// Ikon default untuk marker Leaflet
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

const initialValues = {
  address_name: "",
  address: "",
  subdistrict: "",
  city: "",
  city_id: "",
  province: "",
  province_id: "",
  postcode: "",
  latitude: "",
  longitude: "",
};

const fields = [
  { name: "address_name", label: "Address Name", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "subdistrict", label: "Subdistrict", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "city_id", label: "City ID", type: "text" },
  { name: "province", label: "Province", type: "text" },
  { name: "province_id", label: "Province ID", type: "text" },
  { name: "postcode", label: "Postcode", type: "text" },
  { name: "latitude", label: "Latitude", type: "number" },
  { name: "longitude", label: "Longitude", type: "number" },
];

interface LocationPickerProps {
  setFieldValue: (field: string, value: number) => void;
}

// interface FormAddressAddProps {
//   onsubmit: (values: {
//     address_name: string;
//     address: string;
//     subdistrict: string;
//     city: string;
//     city_id: string;
//     province: string;
//     province_id: string;
//     postcode: string;
//     latitude: string;
//     longitude: string;
//   }) => void;
// }
interface FormAddressAddProps {
  onsubmit: (values: typeof initialValues) => void;
}


const LocationPicker: React.FC<LocationPickerProps> = ({ setFieldValue }) => {
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const FormAddressAdd: React.FC<FormAddressAddProps> = ({ onsubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={addressSchema}
    onSubmit={(values) => {
      console.log("Submitted Data:", values);
      onsubmit(values);
    }}
  >
    {({ isSubmitting, setFieldValue, values }) => (
  <Form className="space-y-4">
    {fields.map((field) => (
      <div key={field.name}>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-500">
          {field.label}
        </label>
        <Field
          id={field.name}
          name={field.name}
          type={field.type}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <ErrorMessage
          name={field.name}
          component="p"
          className="mt-1 text-sm text-red-600"
        />
      </div>
    ))}

    {/* Map Section */}
    <div className="mt-5">
      <h3 className="text-sm font-medium text-gray-500">Select Location on Map</h3>
      <MapContainer
        center={[
          Number(values.latitude) || -6.19676128457438,
          Number(values.longitude) || 106.83754574840799,
        ]}
        zoom={8}
        style={{ height: "300px", width: "100%", marginTop: "1rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {values.latitude && values.longitude && (
          <Marker position={[Number(values.latitude), Number(values.longitude)]}>
            <Popup>
              <span>Your New Selected Address</span>
            </Popup>
          </Marker>
        )}
        <LocationPicker setFieldValue={setFieldValue} />
      </MapContainer>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
        isSubmitting ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700"
      }`}
    >
      {isSubmitting ? "Submitting..." : "Submit Address"}
    </button>
  </Form>
)}
  </Formik>
);

export default FormAddressAdd;
