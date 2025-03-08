import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { formatRupiah } from "@/helper/currencyRp";
import { Order, OrderStatus } from "@/types/orders-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsCardProps {
  order: Order;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  // Format date safely with fallback
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime())
        ? date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recently";
    } catch {
      return "Recently";
    }
  };

  // Format status safely with fallback
  const formatStatus = (status: OrderStatus | undefined | null): string => {
    if (!status) return "PROCESSING";
    return status.replace("_", " ").toUpperCase();
  };

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.completed:
        return "bg-green-600 text-white";
      case OrderStatus.cancelled:
        return "bg-red-600 text-white";
      case OrderStatus.shipped:
        return "bg-blue-600 text-white";
      case OrderStatus.processing:
        return "bg-purple-600 text-white";
      case OrderStatus.awaiting_payment:
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-600 pb-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-purple-400" />
          <div>
            <CardTitle className="text-xl font-semibold tracking-wide">
              Order #{order.order_id}
            </CardTitle>
            <p className="text-sm text-gray-400">
              Placed on {formatDate(order.order_date)}
            </p>
          </div>
        </div>
        <Badge
          className={`${getStatusColor(order.status)} px-3 py-1 rounded-full`}
        >
          {formatStatus(order.status)}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-medium mb-3 flex items-center text-gray-300">
          <Package className="h-5 w-5 mr-2 text-blue-400" />
          Items in Your Order
        </h3>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.product_id}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center border-b border-gray-600 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="h-16 w-16 relative flex-shrink-0 rounded overflow-hidden bg-gray-900 mb-3 sm:mb-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Product image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-600">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="sm:ml-4 flex-grow">
                  <h4 className="font-medium text-white">
                    {item.name || "Product"}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity || 0}
                  </p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="font-medium text-white">
                    {formatRupiah(item.total_price || 0)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatRupiah(item.price || 0)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No items found in this order.</p>
        )}
      </CardContent>
    </Card>
  );
}
