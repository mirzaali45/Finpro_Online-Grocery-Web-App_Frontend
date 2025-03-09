import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useStoreOrders } from "@/components/hooks/useRevenueStore";
import { formatRupiah } from "@/helper/currencyRp";
import { Download, Loader2 } from "lucide-react";
import { exportFullPageToPDF } from "@/utils/pdfEksportsFull";

// Define colors for order status
const STATUS_COLORS: Record<string, string> = {
  completed: "#8b5cf6", // purple
  shipped: "#4ade80", // green
  cancelled: "#ef4444", // red
  processing: "#f59e0b", // amber
  pending: "#3b82f6", // blue
  awaiting_payment: "#cbd5e1", // slate
};

// Interface matching the actual format from your API
interface OrderItem {
  id: number;
  order_id: string;
  customer_name?: string;
  order_date?: string;
  status?: string;
  order_status?: string;
  total_price: number;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  created_at?: string;
  updated_at?: string;
}

const OrderList: React.FC = () => {
  const orderListRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const ordersPerPage = 10;

  // Fetch order data
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch,
  } = useStoreOrders();

  // Extract orders from API response
  // Use a double assertion to overcome type incompatibility
  const orders = (ordersData?.orders || []) as unknown as OrderItem[];

  // Filter orders based on status
  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => {
          const status = order.status || order.order_status;
          return status === selectedFilter;
        });

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Helper to get order status safely
  const getOrderStatus = (order: OrderItem): string => {
    return order.status || order.order_status || "unknown";
  };

  // Prepare chart data
  const prepareStatusChartData = () => {
    if (!orders || orders.length === 0) {
      return [{ name: "No Data", value: 1, status: "no_data" }];
    }

    const statusCounts: Record<string, number> = {};

    // Count orders by status
    orders.forEach((order) => {
      const status = getOrderStatus(order) || "undefined";
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });

    // Convert to array format for the chart
    return Object.entries(statusCounts).map(([status, count]) => ({
      name:
        status === "undefined" || status === "unknown"
          ? "Undefined"
          : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
      value: count,
      status: status,
    }));
  };

  const statusChartData = prepareStatusChartData();

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Invalid date";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string | undefined) => {
    if (!status || status === "undefined" || status === "unknown")
      return "#6e7d94"; // Gray for undefined status
    return STATUS_COLORS[status] || "#64748b"; // Default color
  };

  // Helper function to get customer name
  const getCustomerName = (order: OrderItem): string => {
    // If customer_name is directly available
    if (order.customer_name) return order.customer_name;

    // If user object is available
    if (order.user) {
      const firstName = order.user.first_name || "";
      const lastName = order.user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (fullName) return fullName;
      if (order.user.email) return order.user.email;
    }

    return "Unknown User";
  };

  // Helper function to get order date
  const getOrderDate = (order: OrderItem): string => {
    return order.order_date || order.updated_at || order.created_at || "";
  };

  // Helper function to get order ID
  const getOrderId = (order: OrderItem): string => {
    if (order.order_id) {
      // If order_id is already a string like "ORD-000123"
      if (
        typeof order.order_id === "string" &&
        order.order_id.startsWith("ORD-")
      ) {
        return order.order_id;
      }
      // If order_id is a number, format it
      return `ORD-${String(order.order_id).padStart(6, "0")}`;
    }
    if (order.id) {
      return `ORD-${String(order.id).padStart(6, "0")}`;
    }
    return "Unknown Order";
  };

  // Calculate revenue from completed and shipped orders
  const calculateTotalRevenue = (orders: OrderItem[]): number => {
    return orders
      .filter((order) => {
        const status = getOrderStatus(order);
        return status === "completed" || status === "shipped";
      })
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0);
  };

  const totalRevenue = calculateTotalRevenue(filteredOrders);

  // Handle PDF export
  const handleExportToPDF = async () => {
    if (orderListRef.current) {
      setIsExporting(true);

      try {
        const result = await exportFullPageToPDF(orderListRef, {
          title: "Order Management",
          filename: "order-management",
          pageOrientation: "landscape",
          scale: 2,
          margin: 5,
          quality: 1.0,
          renderDelay: 1000, // Give components enough time to render fully
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
    <div ref={orderListRef} className="space-y-6 pdf-export-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToPDF}
              disabled={isExporting || ordersLoading}
              className="whitespace-nowrap"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={ordersLoading}
            >
              {ordersLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Overview of orders by status</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : ordersError ? (
              <div className="flex justify-center items-center h-64 text-destructive">
                Failed to load order data
              </div>
            ) : statusChartData.length > 0 ? (
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getStatusColor(entry.status)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} orders`, "Count"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                No order data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order List */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              {selectedFilter === "all"
                ? "All orders"
                : `${
                    selectedFilter.charAt(0).toUpperCase() +
                    selectedFilter.slice(1).replace(/_/g, " ")
                  } orders`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : ordersError ? (
              <div className="flex justify-center items-center h-80 text-destructive">
                Failed to load order data
              </div>
            ) : currentOrders.length > 0 ? (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">
                          Order ID
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Customer
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Date
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="text-right whitespace-nowrap">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order, index) => (
                        <TableRow
                          key={index}
                          className="page-break-inside-avoid"
                        >
                          <TableCell className="font-medium whitespace-nowrap">
                            {getOrderId(order)}
                          </TableCell>
                          <TableCell>{getCustomerName(order)}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(getOrderDate(order))}
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(
                                  getOrderStatus(order)
                                ),
                                color: "white",
                              }}
                            >
                              {getOrderStatus(order) !== "unknown" &&
                              getOrderStatus(order) !== "undefined"
                                ? getOrderStatus(order)
                                    .charAt(0)
                                    .toUpperCase() +
                                  getOrderStatus(order)
                                    .slice(1)
                                    .replace(/_/g, " ")
                                : "Unknown Status"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            {formatRupiah(order.total_price || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
                <p className="mb-2">No orders found</p>
                <p className="text-sm">
                  {selectedFilter !== "all"
                    ? `There are no ${selectedFilter} orders.`
                    : "There are no orders to display."}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-between w-full text-sm text-muted-foreground gap-2">
              <div>
                Total Orders: <strong>{filteredOrders.length}</strong>
              </div>
              <div>
                Total Revenue: <strong>{formatRupiah(totalRevenue)}</strong>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderList;
