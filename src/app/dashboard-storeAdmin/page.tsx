"use client";

import OrderList from "@/components/store-revenue/OrderList";
import RevenueDashboard from "@/components/store-revenue/RevenueDashboard";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportFullPageToPDF } from "@/utils/pdfEksportsFull";

export default function DashboardRevenuePage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToPDF = async () => {
    if (dashboardRef.current) {
      setIsExporting(true);

      try {
        const result = await exportFullPageToPDF(dashboardRef, {
          title: "Revenue Dashboard",
          filename: "revenue-dashboard",
          pageOrientation: "landscape",
          scale: 2,
          margin: 5,
          quality: 1.0,
          renderDelay: 800,
        });

        if (result) {
          console.log("PDF exported successfully");
        } else {
          console.error("Failed to export PDF");
        }
      } catch (error) {
        console.error("Error exporting PDF:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Revenue Overview</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToPDF}
          disabled={isExporting}
          className="flex items-center gap-2 self-end sm:self-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Generating PDF...</span>
              <span className="sm:hidden">Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Dashboard</span>
              <span className="sm:hidden">Export</span>
            </>
          )}
        </Button>
      </div>

      <div ref={dashboardRef} className="space-y-8 pdf-export-container">
        <RevenueDashboard />
        <div className="mt-8 page-break-inside-avoid">
          <OrderList />
        </div>
      </div>
    </main>
  );
}
