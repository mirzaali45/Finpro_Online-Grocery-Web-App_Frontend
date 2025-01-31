"use client"
import Sidebar from "@/components/sidebarSuperAdmin";
import { useState } from "react";

export default function Inventory(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return(
        <div  className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className={`${isSidebarOpen ? "md:ml-20" : ""}`}>
               <Sidebar
                      isSidebarOpen={isSidebarOpen}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />  
            </div>
        </div>
    )
}