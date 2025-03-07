"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReverifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Gunakan useSearchParams
  const [loading, setLoading] = useState(true);
  const token = searchParams.get("token"); // Ambil token dari URL

  useEffect(() => {
    const verifyEmailChange = async () => {
      try {
        toast.info("Verifying email...", { autoClose: false, isLoading: true });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/verify-change-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          
        const data = await response.json();
        
        toast.dismiss(); // Hapus loading toast

        if (response.ok) {
          toast.success("Email successfully changed! Redirecting to login...", {
            autoClose: 3000,
            theme: "colored",
          });

          setTimeout(() => {
            router.push("/login-user-customer");
          }, 3000);
        } else {
          toast.error(data.message || "Email verification failed!", {
            autoClose: 5000,
            theme: "colored",
          });

          setTimeout(() => {
            router.push("/");
          }, 5000);
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Something went wrong! Please try again later.", {
          autoClose: 5000,
          theme: "colored",
        });

        setTimeout(() => {
          router.push("/");
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    verifyEmailChange();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="bottom-right" />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center">
          {loading ? "Verifying your email..." : "Redirecting..."}
        </h2>
      </div>
    </div>
  );
}
