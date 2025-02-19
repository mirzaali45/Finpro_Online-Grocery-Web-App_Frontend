"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import StoreSideBar from "@/components/sidebarStoreAdmin";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
 userId: number;
}

interface FormData {
 store_id: number;
 product_id: number;
 thumbnail: string;
 discount_code: string;
 discount_type: string;
 discount_value: string;
 minimum_order: string;
 expires_at: string;
 userUser_id: number;
}

export default function DiscountStore() {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const [formData, setFormData] = useState<FormData>({
   store_id: 1,
   product_id: 1,
   thumbnail: "",
   discount_code: "",
   discount_type: "percentage",
   discount_value: "",
   minimum_order: "",
   expires_at: "",
   userUser_id: 0,
 });

 useEffect(() => {
   const token = localStorage.getItem('token');
   if (token) {
     try {
       const decoded = jwtDecode<DecodedToken>(token);
       setFormData(prev => ({
         ...prev,
         userUser_id: decoded.userId
       }));
     } catch (error) {
       console.error('Error decoding token:', error);
       setError('Invalid authentication token');
       router.push('/login');
     }
   } else {
     router.push('/login');
   }
 }, [router]);

 const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target;
   setFormData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };

 const validateForm = () => {
   const discountValue = Number(formData.discount_value);
   const minimumOrder = Number(formData.minimum_order);

   if (!formData.discount_code.trim()) {
     throw new Error('Discount code is required');
   }
   if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
     throw new Error('Discount value must be between 1 and 100');
   }
   if (isNaN(minimumOrder) || minimumOrder < 0) {
     throw new Error('Minimum order cannot be negative');
   }
   if (!formData.expires_at) {
     throw new Error('Expiry date is required');
   }
   
   const expiryDate = new Date(formData.expires_at);
   if (expiryDate <= new Date()) {
     throw new Error('Expiry date must be in the future');
   }
 };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  try {
    validateForm();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    // Format the data exactly as expected by the backend
    const apiData = {
      store_id: 1, // Hardcoded for now
      product_id: 1, // Hardcoded for now
      thumbnail: formData.thumbnail || "default-thumbnail",
      discount_code: formData.discount_code.trim().toUpperCase(),
      discount_type: "percentage",
      discount_value: Number(formData.discount_value),
      minimum_order: Number(formData.minimum_order),
      expires_at: new Date(formData.expires_at).toISOString(),
      userUser_id: 0 // Will be set from token
    };

    // Log the data being sent for debugging
    console.log('Sending data:', JSON.stringify(apiData, null, 2));

    const response = await fetch('http://localhost:8000/api/discount/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(apiData),
    });

    // Log the response for debugging
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (response.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(responseText || 'Failed to create discount');
    }

    const result = JSON.parse(responseText);
    console.log('Discount created:', result);
    
    router.push('/dashboard-storeAdmin/discount');
  } catch (error) {
    console.error('Error creating discount:', error);
    setError(error instanceof Error ? error.message : 'Failed to create discount');
  } finally {
    setIsLoading(false);
  }
};

 return (
   <div className="min-h-screen bg-gray-100">
     <StoreSideBar />
     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
       <h1 className="text-2xl font-bold mb-6">Create New Discount</h1>
       
       {error && (
         <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
           {error}
         </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <label
             htmlFor="discount_code"
             className="block text-sm font-medium text-gray-700 mb-1"
           >
             Discount Code
           </label>
           <input
             id="discount_code"
             name="discount_code"
             type="text"
             value={formData.discount_code}
             onChange={handleInputChange}
             placeholder="SUMMER2025"
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
           />
         </div>

         <div>
           <label
             htmlFor="discount_value"
             className="block text-sm font-medium text-gray-700 mb-1"
           >
             Discount Value (%)
           </label>
           <input
             id="discount_value"
             name="discount_value"
             type="number"
             min="1"
             max="100"
             value={formData.discount_value}
             onChange={handleInputChange}
             placeholder="20"
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label
             htmlFor="minimum_order"
             className="block text-sm font-medium text-gray-700 mb-1"
           >
             Minimum Order Amount
           </label>
           <input
             id="minimum_order"
             name="minimum_order"
             type="number"
             min="0"
             value={formData.minimum_order}
             onChange={handleInputChange}
             placeholder="100"
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label
             htmlFor="expires_at"
             className="block text-sm font-medium text-gray-700 mb-1"
           >
             Expiry Date
           </label>
           <input
             id="expires_at"
             name="expires_at"
             type="datetime-local"
             value={formData.expires_at}
             onChange={handleInputChange}
             required
             min={new Date().toISOString().slice(0, 16)}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label
             htmlFor="thumbnail"
             className="block text-sm font-medium text-gray-700 mb-1"
           >
             Thumbnail URL
           </label>
           <input
             id="thumbnail"
             name="thumbnail"
             type="text"
             value={formData.thumbnail}
             onChange={handleInputChange}
             placeholder="Image URL"
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div className="flex justify-end space-x-4 pt-4">
           <button
             type="button"
             onClick={() => router.back()}
             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled={isLoading}
           >
             Cancel
           </button>
           <button
             type="submit"
             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
             disabled={isLoading}
           >
             {isLoading ? (
               <span className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Creating...
               </span>
             ) : (
               'Create Discount'
             )}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
}