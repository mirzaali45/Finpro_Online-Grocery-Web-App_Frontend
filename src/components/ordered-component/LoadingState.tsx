import { CheckCircle } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center pt-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 justify-center">
          <CheckCircle className="w-7 h-7 text-blue-400" />
          Order Confirmation
        </h1>
        <div className="flex flex-col justify-center items-center h-64 text-white space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="text-gray-300">Loading your order...</p>
        </div>
      </div>
    </div>
  );
}
