import { CheckCircle } from "lucide-react";

export default function OrderConfirmationBanner() {
  return (
    <div className="mb-6 bg-green-800/20 border border-green-600 p-4 rounded-lg">
      <div className="flex items-center">
        <div className="mr-3 bg-green-900/50 p-2 rounded-full">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <p className="font-bold text-green-400">Thank you for your order!</p>
          <p className="text-green-300">
            Your order has been successfully placed and is now being processed.
          </p>
        </div>
      </div>
    </div>
  );
}
