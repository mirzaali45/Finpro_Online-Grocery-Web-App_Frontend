"use client";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { RegisterFormCustomerValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import ResetPassword from "@/components/register/ResetPassword";

export default function StoreResetPass() {
  const router = useRouter();
  useEffect(() => {
      if (localStorage.getItem('token') && localStorage.getItem('is_login')) {
        router.push("/");
      }
  }, [router])

  const handleSubmit = async (values: RegisterFormCustomerValues) => {
    try {
      toast.info("Send a password reset link...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.resetPass(values);

      if (response.user.role === "customer") {
        toast.dismiss();
        toast.success("Reset password link successfull sended, please check youre email!...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            router.push("/verify-reset-password");
          },
        });
      } else {
        toast.dismiss();
        toast.error("Access denied.Youre not customer !.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        })
        setTimeout(() => {
          router.push("/");
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
      <ResetPassword onSubmit={handleSubmit} />
    </>
  );
}
