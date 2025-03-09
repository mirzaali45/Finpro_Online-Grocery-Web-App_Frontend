// utils/fullPageExport.ts
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface FullPageExportOptions {
  title?: string;
  filename?: string;
  pageOrientation?: "portrait" | "landscape";
  addDateToFilename?: boolean;
  quality?: number; // 0.1 to 1.0
  scale?: number; // 1 to 5
  margin?: number; // in mm
  waitForImages?: boolean;
  prepareDOMForExport?: boolean;
  restoreDOM?: boolean;
  renderDelay?: number; // milliseconds to wait before rendering
}

/**
 * Exports a full page component to PDF, optimized for dashboards and large content
 */
export const exportFullPageToPDF = async (
  elementRef: React.RefObject<HTMLElement>,
  options: FullPageExportOptions = {}
): Promise<boolean> => {
  if (!elementRef.current) return false;

  const {
    title,
    filename = "dashboard-export",
    pageOrientation = "landscape",
    addDateToFilename = true,
    quality = 1.0,
    scale = 2,
    margin = 5,
    waitForImages = true,
    prepareDOMForExport = true,
    restoreDOM = true,
    renderDelay = 500,
  } = options;

  // Store original state
  const element = elementRef.current;
  const originalStyle = element.style.cssText;
  const originalHeight = element.style.height;
  const scrollPosition = window.scrollY;
  const scrollableElements: Array<[HTMLElement, string]> = [];

  try {
    // Prepare DOM for export if requested
    if (prepareDOMForExport) {
      console.log("Preparing DOM for export...");

      // Modify main element
      element.style.maxWidth = "none";
      element.style.width = "100%";
      element.style.height = "auto";
      element.style.overflow = "visible";

      // Find all scrollable elements inside and make them visible
      const scrollables = element.querySelectorAll(
        '.overflow-auto, .overflow-y-auto, .overflow-x-auto, [style*="overflow: auto"], [style*="overflow:auto"], [style*="overflow-y: auto"], [style*="overflow-y:auto"]'
      );

      scrollables.forEach((el) => {
        const htmlEl = el as HTMLElement;
        scrollableElements.push([htmlEl, htmlEl.style.cssText]);
        htmlEl.style.overflow = "visible";
        htmlEl.style.maxHeight = "none";
        htmlEl.style.height = "auto";
      });

      // Scroll to top for consistent capture
      window.scrollTo(0, 0);
    }

    // Wait for specified delay to ensure content rendering is complete
    await new Promise((resolve) => setTimeout(resolve, renderDelay));

    // Capture as canvas
    console.log("Capturing page as canvas...");
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      imageTimeout: waitForImages ? 15000 : 0,
      onclone: (documentClone, element) => {
        // Additional modifications to the cloned document if needed
        console.log("Document cloned for export");
      },
    });

    // Generate PDF
    console.log("Generating PDF...");
    const imgData = canvas.toDataURL("image/jpeg", quality);

    const orientation = pageOrientation === "landscape" ? "l" : "p";
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
    });

    // Get dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit the page with margins
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add title if provided
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, margin, margin + 5);

      // Add timestamp
      pdf.setFontSize(10);
      pdf.text(
        `Generated on: ${new Date().toLocaleString()}`,
        margin,
        margin + 12
      );

      // Add the image further down to accommodate the title
      pdf.addImage(imgData, "JPEG", margin, margin + 20, imgWidth, imgHeight);
    } else {
      // Add the image at the top if no title
      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
    }

    // Generate filename with date if requested
    let finalFilename = filename;
    if (addDateToFilename) {
      const date = new Date();
      const dateStr = date.toISOString().split("T")[0];
      finalFilename = `${filename}-${dateStr}`;
    }

    // Save the PDF
    pdf.save(`${finalFilename}.pdf`);
    console.log("PDF saved successfully");

    return true;
  } catch (error) {
    console.error("Error generating full-page PDF:", error);
    return false;
  } finally {
    // Restore original DOM state if requested
    if (restoreDOM) {
      console.log("Restoring DOM to original state...");

      // Restore main element
      element.style.cssText = originalStyle;
      element.style.height = originalHeight;

      // Restore all scrollable elements
      scrollableElements.forEach(([element, originalStyle]) => {
        element.style.cssText = originalStyle;
      });

      // Restore scroll position
      window.scrollTo(0, scrollPosition);
    }
  }
};
