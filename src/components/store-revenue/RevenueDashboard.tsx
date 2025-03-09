import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useRevenueByPeriod,
  useStoreOrders,
} from "@/components/hooks/useRevenueStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { ArrowDown, ArrowUp, Loader2, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/helper/currencyRp";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RevenueDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedView, setSelectedView] = useState<"line" | "bar">("line");

  // Fetch revenue data for the selected year
  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
    setParams: setRevenueParams,
    refresh: refreshRevenue,
  } = useRevenueByPeriod({
    period: "monthly",
    year:
      selectedYear <= new Date().getFullYear()
        ? selectedYear
        : new Date().getFullYear(), // Prevent future years
  });

  // Fetch order data for the current year
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useStoreOrders();

  // Format the data for the chart
  const formatChartData = () => {
    if (!revenueData || !revenueData.revenue) return [];

    // Create an array with all months initialized to zero
    const formattedData = monthNames.map((name, index) => ({
      name,
      month: index + 1,
      revenue: 0,
    }));

    // Fill in the actual revenue data we have
    if (Array.isArray(revenueData.revenue)) {
      revenueData.revenue.forEach((item: any) => {
        if (item.month && item.month >= 1 && item.month <= 12) {
          const monthIndex = item.month - 1;
          // Ensure we're using the raw number from the API response
          formattedData[monthIndex].revenue = Number(item.total_revenue);
        }
      });
    }

    return formattedData;
  };

  const chartData = formatChartData();

  // Handle year change
  const handleYearChange = (year: string) => {
    const parsedYear = parseInt(year, 10);
    setSelectedYear(parsedYear);
    setRevenueParams({ year: parsedYear });
  };

  // Generate year options for dropdown (current year and past years)
  const generateYearOptions = () => {
    const years = [];
    const startYear = 2020; // Set a reasonable starting year for your business data
    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  };

  // Calculate total revenue for the year
  const calculateTotalRevenue = () => {
    if (!chartData) return 0;
    return chartData.reduce((sum, month) => sum + month.revenue, 0);
  };

  // Find month with highest revenue
  const findBestMonth = () => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce(
      (best, current) => (current.revenue > best.revenue ? current : best),
      chartData[0]
    );
  };

  // Find the maximum revenue value
  const getMaxRevenue = () => {
    if (!chartData || chartData.length === 0) return 0;
    return Math.max(...chartData.map((item) => item.revenue));
  };

  // Calculate average monthly revenue
  const calculateAverageMonthlyRevenue = () => {
    const total = calculateTotalRevenue();
    // Count months with data
    const monthsWithData =
      chartData.filter((month) => month.revenue > 0).length || 1;
    return total / monthsWithData;
  };

  // Calculate revenue growth vs previous month
  const calculateMonthlyGrowth = () => {
    if (!chartData || chartData.length === 0)
      return { growth: 0, isPositive: false };

    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentMonthRevenue = chartData[currentMonth].revenue;
    const lastMonthRevenue = chartData[lastMonth].revenue;

    if (lastMonthRevenue === 0) return { growth: 0, isPositive: false };

    const growthRate =
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    return {
      growth: Math.abs(growthRate),
      isPositive: growthRate >= 0,
    };
  };

  const totalRevenue = calculateTotalRevenue();
  const totalOrders = ordersData?.totalOrders || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const bestMonth = findBestMonth();
  const averageMonthlyRevenue = calculateAverageMonthlyRevenue();
  const monthlyGrowth = calculateMonthlyGrowth();
  const maxRevenue = getMaxRevenue();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Revenue Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View:</span>
            <div className="flex bg-gray-200 rounded-md overflow-hidden">
              <Button
                variant={selectedView === "line" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView("line")}
                className="cursor-pointer hover:bg-gray-300"
              >
                Line
              </Button>
              <Button
                variant={selectedView === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView("bar")}
                className="cursor-pointer hover:bg-gray-300"
              >
                Bar
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-32 bg-gray-200 cursor-pointer hover:bg-gray-300">
                <SelectValue placeholder={selectedYear.toString()} />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                {generateYearOptions().map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={refreshRevenue}
            disabled={revenueLoading}
          >
            {revenueLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">
              {formatRupiah(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">
                For {selectedYear}
              </p>
            </div>
          </CardContent>
          <div className="absolute -right-12 -top-12 rounded-full p-20 bg-primary/10" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">
              {totalOrders.toLocaleString("id-ID")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">From your store</p>
            </div>
          </CardContent>
          <div className="absolute -right-12 -top-12 rounded-full p-20 bg-indigo-500/10" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle className="text-2xl">
              {formatRupiah(averageOrderValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Per order</p>
            </div>
          </CardContent>
          <div className="absolute -right-12 -top-12 rounded-full p-20 bg-amber-500/10" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Growth</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {monthlyGrowth.isPositive ? (
                <ArrowUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <ArrowDown className="h-5 w-5 text-rose-500" />
              )}
              {monthlyGrowth.growth.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Compared to last month
              </p>
            </div>
          </CardContent>
          <div className="absolute -right-12 -top-12 rounded-full p-20 bg-teal-500/10" />
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue ({selectedYear})</CardTitle>
            <CardDescription>Revenue breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : revenueError ? (
              <div className="flex flex-col justify-center items-center h-80">
                <p className="text-destructive font-medium mb-2">
                  Failed to load revenue data
                </p>
                <p className="text-sm text-muted-foreground max-w-md text-center">
                  {revenueError}. Please check if the backend server is running
                  at{" "}
                  {process.env.NEXT_PUBLIC_BASE_URL_BE || "the configured URL"}.
                </p>
                <Button
                  onClick={refreshRevenue}
                  className="mt-4"
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedView === "line" ? (
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => {
                          // Format large numbers with appropriate scale
                          if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                          }
                          return value.toString();
                        }}
                        domain={[0, "auto"]}
                        allowDataOverflow={false}
                      />

                      <Tooltip
                        formatter={(value) => [
                          formatRupiah(Number(value)),
                          "Revenue",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => {
                          // Format large numbers with appropriate scale
                          if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                          }
                          return value.toString();
                        }}
                        domain={[0, "auto"]}
                        allowDataOverflow={false}
                      />

                      <Tooltip
                        formatter={(value) => [
                          formatRupiah(Number(value)),
                          "Revenue",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Insights</CardTitle>
            <CardDescription>Key metrics for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Best Performing Month</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{bestMonth?.name || "-"}</p>
                <p className="font-medium text-emerald-600">
                  {bestMonth ? formatRupiah(bestMonth.revenue) : "-"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">
                Average Monthly Revenue
              </p>
              <p className="text-lg font-bold">
                {formatRupiah(averageMonthlyRevenue)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Monthly Order Average</p>
              <p className="text-lg font-bold">
                {totalOrders > 0
                  ? Math.round(
                      totalOrders /
                        (chartData.filter((d) => d.revenue > 0).length || 1)
                    ).toLocaleString()
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Orders per month</p>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Data updated{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RevenueDashboard;
