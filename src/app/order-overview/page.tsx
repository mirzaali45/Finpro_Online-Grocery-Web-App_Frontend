// app/profile/page.tsx
import dynamic from "next/dynamic";

const DynamicProfileContent = dynamic(() => import("./order-overview"), {
  ssr: false,
});

export default function ProfilePage() {
  return <DynamicProfileContent />;
}
