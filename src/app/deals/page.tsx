import DealsComponent from "@/components/customer-discount/DealsCard";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16 sm:pt-20">
      <div className="w-full mx-auto py-6 sm:py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent px-4">
          Exclusive Deals & Discounts
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4 text-sm sm:text-base">
          Discover the best offers from our partner stores and save on your
          favorite products
        </p>
        <DealsComponent />
      </div>
    </div>
  );
}
