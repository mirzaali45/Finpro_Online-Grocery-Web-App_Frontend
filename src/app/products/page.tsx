"use client"

import Image from "next/image";
import { Product } from "@/types/product-types";
import { productService } from "@/components/hooks/useProductAdmin";
import { useEffect, useState } from "react";

interface ProductPageProps {
 product: Product;
}

export default function ProductPage() {
 const [loading, setLoading] = useState<boolean>(false);
 const [products, setProducts] = useState<Product[]>([]);

 useEffect(() => {
   fetchProducts();
 }, []);

 const fetchProducts = async () => {
   setLoading(true);
   try {
     const data = await productService.getProducts();
     setProducts(data);
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
   <div className="container mx-auto px-4 py-8">
     <div className="flex justify-between items-center mb-6 mt-20">
       <h2 className="text-2xl font-bold">Our Products</h2>
     </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       {products.map((product) => (
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
           <div className="p-4">
             <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
             <p className="text-gray-600 text-sm mb-2 line-clamp-2">
               {product.description}
             </p>
             <div className="flex justify-between items-center mt-4">
               <span className="text-xl font-bold">
                 Rp.{product.price.toLocaleString()}
               </span>
               <div className="flex gap-2">
                 <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                   See More
                 </button>
                 <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                   Add to Cart
                 </button>
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
}