import { MapPin } from "lucide-react";
import { Address } from "@/types/address-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddressClient from "@/components/checkout/AddressClient";

interface ShippingInfoCardProps {
  shipping: any; // Replace with proper shipping type when available
  addressData: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

export default function ShippingInfoCard({
  shipping,
  addressData,
  selectedAddress,
  setSelectedAddress,
}: ShippingInfoCardProps) {
  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center border-b border-gray-600 pb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-teal-400" />
          <CardTitle className="text-xl font-semibold tracking-wide">
            Shipping Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Badge className="bg-blue-900 text-blue-300">
              {shipping.status ? shipping.status.toUpperCase() : "PENDING"}
            </Badge>
            <span>Shipping Status</span>
          </div>
          <div className="flex flex-col p-3 bg-gray-700/50 rounded-lg">
            <span className="text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-400" />
              Delivery Address
            </span>
            {selectedAddress ? (
              <main className="h-auto flex lg:flex-row flex-col max-w-5xl w-full justify-center mx-auto container gap-5">
                <div className="w-full">
                  <AddressClient
                    addressData={addressData}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                  />
                </div>
              </main>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
