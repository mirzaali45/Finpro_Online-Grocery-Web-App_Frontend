import { useRouter } from "next/navigation";
import { CheckCircle, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyOrderState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center pt-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 justify-center">
          <CheckCircle className="w-7 h-7 text-blue-400" />
          Order Confirmation
        </h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 flex flex-col items-center justify-center space-y-6 py-12 max-w-2xl mx-auto">
          <div className="bg-gray-700/50 p-6 rounded-full">
            <Package className="w-20 h-20 text-blue-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">No Order Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn&apos;t find your recent order.
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-lg mt-4 flex items-center gap-2 text-lg"
            onClick={() => router.push("/orders")}
          >
            <ShoppingCart className="w-5 h-5" />
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
