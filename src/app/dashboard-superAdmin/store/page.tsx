// app/dashboard-superAdmin/store/page.tsx
import dynamic from "next/dynamic";

const DynamicStoreDashboard = dynamic(() => import("./StoreDashboardContent"), {
  ssr: false,
});

export default function StoreDashboardPage() {
  return <DynamicStoreDashboard />;
}
