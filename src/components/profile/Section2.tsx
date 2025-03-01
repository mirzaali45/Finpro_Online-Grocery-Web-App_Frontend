import services2 from "@/services/profile/services2";
import React, { useState } from "react";
import Modal from "../product-management/Modal";
import FormAddressAdd from "./FormAddressAdd";
import FormAddressEdit from "./FormAddressEdit";
import { HouseIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Address, AddressFormData, Location } from "@/types/address-types";

const Section2 = () => {
  const {
    load,
    addressData,
    setAddressData,
    setPrimaryAddressEdit,
    addAddress,
    editAddress,
    deleteAddress,
  } = services2();

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const [formEditData, setFormEditData] = useState<Address>({
    address_id: 0,
    address_name: "",
    address: "",
    subdistrict: "",
    city: "",
    city_id: "",
    province: "",
    province_id: "",
    postcode: "",
    latitude: 0,
    longitude: 0,
    is_primary: false,
  });

  const [location, setLocation] = useState<Location>({
    province: null,
    city: null,
    subdistrict: null,
  });

  // Wrapper function to handle add address
  const handleAddAddress = (values: {
    address_name: string;
    address: string;
    postcode: string;
    latitude: string;
    longitude: string;
  }) => {
    const payload: {
      address_name: string;
      address: string;
      postcode: string;
      latitude: string;
      longitude: string;
      subdistrict: string;
      city: string;
      city_id: string;
      province: string;
      province_id: string;
    } = {
      address_name: values.address_name,
      address: values.address,
      postcode: values.postcode,
      latitude: values.latitude,
      longitude: values.longitude,
      subdistrict: location.subdistrict?.label || "",
      city: location.city?.label || "",
      city_id: String(location.city?.value || ""),
      province: location.province?.label || "",
      province_id: String(location.province?.value || ""),
    };
    return addAddress(payload);
  };

  // Wrapper function to handle edit address with correct type
  const handleEditAddress = (id: number, values: AddressFormData) => {
    const addressPayload: Address = {
      ...values,
      address_id: id,
      city_id: String(values.city_id),
      province_id: String(values.province_id),
      postcode: String(values.postcode),
    };
    return editAddress(id, addressPayload);
  };

  return (
    <>
      <div className="mt-10 text-center">
        <h1>My Address</h1>
      </div>
      <section className="mt-5 max-w-4xl text-white py-5 mx-auto px-8 pt-8 pb-16 bg-gray-800 rounded-md">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <h1>Manage Your Address</h1>
          <button
            onClick={() => setModalAdd(true)}
            className="button bg-blue-500 py-2 px-4 rounded-md"
          >
            <i className="bi-house-add mr-3"></i>Add Address
          </button>
        </div>
        <div className="flex flex-wrap mt-5 gap-3 w-full">
          {addressData
            .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
            .map((data, index) => (
              <div
                key={index}
                className="box-address bg-gray-700 px-5 rounded-md py-4 w-full"
              >
                <div>
                  <h1>
                    <HouseIcon
                      className={`${
                        data.is_primary ? "text-blue-500" : "text-white"
                      }`}
                    />
                    {data.address_name}{" "}
                    {data.is_primary ? " - Primary Address" : ""}
                  </h1>
                  <h1>{data.address}</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                  <div className="w-full flex my-2 gap-3 flex-wrap">
                    <p className="text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md">
                      {data.province}
                    </p>
                    <p className="text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md">
                      {data.city}
                    </p>
                    <p
                      className={`text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md ${
                        data.subdistrict ? "block" : "hidden"
                      }`}
                    >
                      {data.subdistrict}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setModalEdit(true);
                        setFormEditData(data);
                      }}
                      className="button hover:bg-opacity-100 hover:text-white transition-all ease-in-out bg-green-500 rounded-md px-3 py-2 bg-opacity-20"
                    >
                      <PencilIcon className="text-white" />
                    </button>
                    <button
                      onClick={() => deleteAddress(data.address_id)}
                      className="button hover:bg-opacity-100 hover:text-white transition-all ease-in-out bg-red-500 rounded-md px-3 py-2 bg-opacity-20"
                    >
                      <Trash2Icon className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* modal add address */}
        <Modal
          isOpen={modalAdd}
          onClose={() => setModalAdd(false)}
          title="Add address"
        >
          <FormAddressAdd
            onsubmit={handleAddAddress}
            location={location}
            setLocation={setLocation}
          />
        </Modal>
        {/* modal edit address */}
        <Modal
          isOpen={modalEdit}
          onClose={() => setModalEdit(false)}
          title="Edit address"
        >
          <FormAddressEdit
            formData={formEditData}
            onSubmit={handleEditAddress}
            setPrimaryAddress={setPrimaryAddressEdit}
            location={location}
            setLocation={setLocation}
          />
        </Modal>
      </section>
    </>
  );
};

export default Section2;
