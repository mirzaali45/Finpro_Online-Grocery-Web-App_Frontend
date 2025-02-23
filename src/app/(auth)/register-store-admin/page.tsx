"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { RegisterFormCustomerValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import RegisterStoreAdmin from "@/components/register/RegisterStoreAdmin";

export default function StoreRegisterPage() {
  const router = useRouter();
  useEffect(() => {
      if (!localStorage.getItem('verify_email') && localStorage.getItem('is_login')) {
        router.push("/");
      }
  }, [router])

  const handleSubmit = async (values: RegisterFormCustomerValues) => {
    try {
      toast.info("Sign up...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.registerStoreAdmin(values);

      if (response.user.role === "store_admin") {
        toast.dismiss();
        toast.success("Register successful, please check youre email! Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            router.push("/verify-register");
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
      <RegisterStoreAdmin onSubmit={handleSubmit} />
    </>
  );
}
