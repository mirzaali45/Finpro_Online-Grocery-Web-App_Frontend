"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginFormCustomerValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginUser from "@/components/login/loginUser";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function StoreLoginPage() {
  const router = useRouter();
  useEffect(() => {
      if (!localStorage.getItem('verify_email') && localStorage.getItem('is_login')) {
        router.push("/");
      }
  }, [router])

  const handleSubmit = async (values: LoginFormCustomerValues) => {
    try {
      toast.info("Logging in...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.login(values);

      if (response.user.role === "customer") {
        toast.dismiss();
        toast.success("Login successful! Redirecting...", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            // router.push("/");
            window.location.href = "/"
            // history.back(); 
          },
        });
      } else {
        toast.dismiss();
        toast.error("Access denied.Store-Admin privileges required.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
        })
        setTimeout(() => {
          // router.push("/");
          window.location.href = "/"
        }, 5000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Login failed", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        hideProgressBar: false,
      });
    }
  };
  

  const handlegoogle = async () => {
    try {
      // Gunakan Google untuk memilih akun
      const res = await signIn("google", { callbackUrl: "/waiting" });
      if (!res) throw new Error("Gagal login dengan Google");
    } catch (error) {
      // return console.log('error', error)
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <LoginUser onSubmit={handleSubmit} handleGoogleLogin={handlegoogle} />
    </>
  );
}
