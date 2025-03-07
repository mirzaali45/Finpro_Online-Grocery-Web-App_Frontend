import { CheckCircle } from "lucide-react";

export default function PageHeader() {
  return (
    <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
      <CheckCircle className="w-7 h-7 text-blue-400" />
      Order Confirmation
    </h1>
  );
}
