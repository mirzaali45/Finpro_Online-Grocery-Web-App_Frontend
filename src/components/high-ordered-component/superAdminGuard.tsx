"use client";
// components/guards/SuperAdminGuard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = AuthService.getToken();

      if (!token) {
        setIsChecking(false);
        router.push("/login-super-admin");
        return;
      }

      try {
        const decodedToken = AuthService.parseToken();
        if (!decodedToken || decodedToken.role !== "super_admin") {
          setIsChecking(false);
          router.push("/login-super-admin");
          return;
        }

        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsChecking(false);
        router.push("/login-super-admin");
      }
    };

    checkAuth();
  }, [router]);


  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="loader-dominoes-container">
          <div className="loader-dominoes"></div>
          <p className="loading-text">Checking Authorization</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
