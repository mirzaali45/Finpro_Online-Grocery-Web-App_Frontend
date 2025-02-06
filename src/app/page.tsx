"use client";

import { useState, useEffect } from "react";
import { fetchProducts, addToCart } from "../services/api";
import Navbar from "../components/navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "../context/cartcontext";

export default function Home() {

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Navbar /> */}
    </div>
  );
}
