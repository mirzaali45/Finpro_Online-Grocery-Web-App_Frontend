"use client";
import ProfileServices from "@/services/profile/services1";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import FormSetPassword from "./FormSetPassword";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Section1 = () => {
  const {
    profile,
    isChangeAvatar,
    newFile,
    getDataUser,
    saveChanges,
    handlePickImage,
    handleChangeAvatar,
    setProfile,
    setPasswordHandle,
    isSaveAvatar,
  } = ProfileServices();
  const [modalSetPass, setModalSetPass] = useState(false);
  const [modalEnterRefCode, setModalEnterRefCode] = useState(false);
  const handleLogout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("exp_token");
      signOut({ callbackUrl: "/" });
    }
  };
  return (
    <section className="max-w-4xl mx-auto px-8 pt-8 pb-16 mt-8 bg-gray-800 rounded-md">
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
          {isChangeAvatar ? (
            <Image
              src={newFile.url}
              alt="Profile Picture"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <Image
              src={
                profile.avatar
                  ? profile.avatar
                  : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Profile Picture"
              width={96}
              height={96}
              className="object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-2xl text-white font-bold">
            {profile.firstName} {profile.lastName || ""}
          </h1>
          <p className="text-gray-600">
            Referral Code: {profile.referral_code}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className={`${
            !isChangeAvatar
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-lime-500 hover:bg-lime-600"
          } text-white px-4 py-2 relative rounded mb-6`}
          onClick={() =>
            isChangeAvatar
              ? handleChangeAvatar()
              : console.log("isi terlebih dahulu")
          }
          disabled={isSaveAvatar}
        >
          {isChangeAvatar ? "Save New Avatar" : "Change Avatar"}
          <input
            type="file"
            accept="image/*"
            style={{ top: "0" }}
            className={`absolute left-0 w-full h-full opacity-0 cursor-pointer ${
              isChangeAvatar ? "hidden" : "flex"
            }`}
            onChange={(e) => handlePickImage(e)}
          />
        </button>
        {profile && !profile.is_google ? (
          <button
            onClick={() => setModalSetPass(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
          >
            Set Password
          </button>
        ) : (
          ""
        )}
        <button
          onClick={() => handleLogout()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-6"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400">First Name:</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
            placeholder="Enter first name"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">Last Name:</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
            placeholder="Enter last name"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">Email:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Enter email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">Phone:</label>
          <input
            type="number"
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: parseInt(e.target.value, 10) })
            }
            placeholder="Enter phone"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">Role:</label>
          <input
            type="text"
            value={profile.role}
            disabled
            // onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="w-full border border-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">Status:</label>
          <input
            type="text"
            value={profile.status}
            disabled
            // onChange={(e) => setProfile({ ...profile, status: e.target.value })}
            className="w-full border border-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            onClick={() => saveChanges()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mb-6"
          >
            Save Changes
          </button>
        </div>
      </div>
      {/* modal set password */}
      {profile && profile.password === "" ? (
        <Modal
          isOpen={modalSetPass}
          onClose={() => setModalSetPass(false)}
          title="Set Password"
        >
          <FormSetPassword onsubmit={setPasswordHandle} />
        </Modal>
      ) : (
        ""
      )}
      {/* modal input referral */}
      {profile && profile.password === "" ? (
        <Modal
          isOpen={modalSetPass}
          onClose={() => setModalSetPass(false)}
          title="Set Password"
        >
          <FormSetPassword onsubmit={setPasswordHandle} />
        </Modal>
      ) : (
        ""
      )}
    </section>
  );
};

export default Section1;
