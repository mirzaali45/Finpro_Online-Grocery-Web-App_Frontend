"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { productService } from "@/components/hooks/useProductAdmin";
import { Product } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";
import { toast, ToastContainer } from "react-toastify";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      const sortedProducts = data.sort((a, b) => b.price - a.price).slice(0, 4);
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // calculate lat and long data store product and data user location
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam kilometer
  }
  

  // handle to get latt and long user location and sort product
  const handleGetLocUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Your latitude : " + latitude + " Your Longtitude : " + longitude)
        const sortedByLocation = [...products]
        .filter(product => product.store.latitude !== null && product.store.longitude !== null)
        .sort((a, b) => {
          const distanceA = calculateDistance(latitude, longitude, a.store.latitude, a.store.longitude);
          const distanceB = calculateDistance(latitude, longitude, b.store.latitude, b.store.longitude);
          return distanceA - distanceB;
        });
      
       setProducts(sortedByLocation);
      
        
        console.log(sortedByLocation);
        toast.dismiss();
        toast.success("Product Sortered !", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
        });
      },
      (error) => {
        alert(`Error getting location: ${error.message}`);
      }
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-950 py-12">
    <ToastContainer
       position="bottom-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="colored"
     />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="text-left text-2xl font-bold text-neutral-100">
            Featured Products
          </div>
          <div className="gap-3 flex items-start">
            <button onClick={() => handleGetLocUser()} className="button bg-white text-black py-2 px-4 rounded-md">Sort By Your Location <i className="bi bi-filter ml-2"></i></button>
            <button onClick={() => fetchProducts()} className="button bg-white py-2 text-black px-4 rounded-md">Reset <i className="bi bi-arrow-clockwise ml-2"></i></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 w-full">
                {product.ProductImage?.[0]?.url && (
                  <Image
                    src={product.ProductImage[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                )}
              </div>

              <div className="p-4 text-neutral-100">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.address}</span>
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.store_name}</span>
                  {/* jika pengguna ingin melihat latitude dan longitude toko penjual maka uncomment code dibawah ini */}
                  {/* <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.latitude}</span>
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.longitude}</span> */}
                </div>

                <div className="flex justify-center flex-col items-start mt-4">
                  <span className="text-lg font-bold text-neutral-200">
                    {formatRupiah(product.price)}
                  </span>
                  <div className='w-full grid grid-cols-2 mt-3 gap-2'>
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      See More
                    </button>
                    <button className={`bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm ${localStorage.getItem("is_login") && localStorage.getItem("token") ? "inline" : "hidden"}`}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
