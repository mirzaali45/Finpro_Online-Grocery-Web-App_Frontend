"use client"

import Image from "next/image";
import { Product } from "@/types/product-types";
import { productService } from "@/components/hooks/useProductAdmin";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "next/navigation";

export default function ProductPage() {
 const [loading, setLoading] = useState<boolean>(false);
 const [products, setProducts] = useState<Product[]>([]);
 const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
 const searchParams = useSearchParams(); //get parameter

  
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

 useEffect(() => {
   fetchProducts();
 }, []);

 useEffect(() => {
  // cek apakah ada parameter category yang diterima dan products sudah diload
  const getCategory = searchParams.get("category");
  // jika ada maka filtering dan pastikan products sudah diload
  if (getCategory && Array.isArray(products)) {
    const filterByCategory = products.filter((item) => item.category.category_name.toLocaleLowerCase() === getCategory)
    if (products.find((item) => item.category.category_name.toLocaleLowerCase() === getCategory)) { //jika ada maka print produk berdasarkan category tersebut
      setFilteredProducts(filterByCategory)
    } else { // jika tidak ada maka munculkan toast
      toast.dismiss();
      toast.error("Category tidak tersedia !", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
      });

    }
   }
 }, [products])

 const fetchProducts = async () => {
   setLoading(true);
   try {
     const data = await productService.getProducts();
     setProducts(data);
     console.log(data)
   } catch (error) {
     console.error("Error fetching products:", error);
   } finally {
     setLoading(false);
   }
 };

 if (loading) {
   return <div>Loading...</div>;
 }

 return (
  <div className=" bg-gray-900 w-full">
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
   <div className="container mx-auto px-4 py-8">
    <div className="pt-20 flex flex-col md:flex-row mb-8 justify-between">
      <div className="text-left text-2xl font-bold text-neutral-100">
        Our Products
      </div>
      <div className="gap-3 flex items-start">
        <button onClick={() => handleGetLocUser()} className="button bg-white text-black py-2 px-4 rounded-md flex">Sort By Your Location <i className="bi bi-filter ml-2"></i></button>
        <button onClick={() => fetchProducts()} className="button bg-white text-black py-2 px-4 rounded-md">Reset <i className="bi bi-arrow-clockwise ml-2"></i></button>
      </div>
    </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
     {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
         <div
           key={product.product_id}
           className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
         >
           <div className="relative h-48">
             <Image
               src={
                 product.ProductImage?.[0]?.url || "/product-placeholder.jpg"
               }
               alt={product.name}
               fill
               className="object-cover"
             />
           </div>
           <div className="p-4 bg-neutral-800">
             <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
             <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.address}</span>
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.store_name}</span>
                  {/* jika pengguna ingin melihat latitude dan longitude toko penjual maka uncomment code dibawah ini */}
                  {/* <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.latitude}</span>
                  <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-cyan-50 ring-1 ring-gray-500/10 ring-inset">{product.store.longitude}</span> */}
                </div>
             <div className="flex justify-between text-white items-center mt-4">
               <span className="text-xl font-bold">
                 Rp.{product.price.toLocaleString()}
               </span>
             </div>
               <div className="grid grid-cols-2 mt-3 gap-2">
                 <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                   See More
                 </button>
                 <button className={`bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm ${localStorage.getItem("is_login") && localStorage.getItem("token") ? "inline" : "hidden"}`}>
                   Add to Cart
                 </button>
               </div>
           </div>
         </div>
       ))}
     </div>
   </div>
   </div>
 );
}