"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ToastContainerElement from "@/components/ToastContainerElement";
import Image from "next/image";

export default function VerifyResetEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {

      toast.info("Redirecting to homepage...", {
        position: "bottom-right",
      });

      // Beri delay sebelum redirect agar toast bisa muncul
      setTimeout(() => {
        router.push("/");
      }, 3000);

      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/verify-change-email`, {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message);
          setSuccess(true);

          // Hapus tanda reset email dari localStorage

          localStorage.removeItem("verify_token");
          localStorage.removeItem("token"); // Tambahkan ini agar token lama benar-benar hilang
          setTimeout(() => {
            router.push("/login-user-customer"); // Redirect ke login setelah sukses
          }, 3000);
        } else {

          toast.error(data.message || "Verification failed! Redirecting to homepage...");
          
          setTimeout(() => {
            router.push("/");
          }, 3000); // Delay sebelum redirect ke home
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again later.");
        
        setTimeout(() => {
          router.push("/");
        }, 3000); // Delay sebelum redirect ke home saat error
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <>
      <ToastContainerElement />
      <div className="min-h-screen flex items-center justify-center mt-10 bg-gradient-to-br from-black to-gray-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-black flex flex-col items-center max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
          <Image src={"/mail-sent.svg"} width={200} height={200} alt="email-sent" />
          <h1 className="font-bold m-0">
            {loading ? "Verifying..." : success ? "Email Verified!" : "Verification Failed"}
          </h1>
          <p>
            {loading
              ? "Please wait while we verify your email..."
              : success
              ? "Your email has been successfully verified. Login with your new email."
              : "Invalid or expired verification link. Redirecting to homepage..."}
          </p>
        </div>
      </div>
    </>
  );
}
