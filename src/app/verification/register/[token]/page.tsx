"use client";

import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import VerifyAndSetPass from "@/components/login/VerifyAndSetPass";
import { VerifyAndSetPassValues } from "@/types/auth-types";
import { AuthService } from "@/services/auth.service";

export default function VerifyTokenForm() {
  const router = useRouter();
  useEffect(() => {
      if (!localStorage.getItem('verify_email') && !localStorage.getItem('token') && (localStorage.getItem('is_login') || !localStorage.getItem('is_login'))) {
        router.push("/");
      }
      checkToken()
  }, [router])

  const checkToken = async () => {
    const pathParts = window.location.pathname.split("/");
    const tokenValue = pathParts[pathParts.length - 1];
    try {
      const res = await AuthService.checkTokenVerifyEmailExp(tokenValue)
      if (res.status === "ok") {
        return console.log(res.message)
      } else {
        return window.location.href = "/login-user-customer"
      }
    } catch(error) {
      if (error.message === "Token Expired") {
        return window.location.href = "/login-user-customer"
      }
      console.log(error)
    }
  }

  const handleSubmit = async (values: VerifyAndSetPassValues) => {
    try {
      toast.info("Verify and process the data...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.verifikasiAndSetPass(values);

      if (response.status === "success") {
        localStorage.removeItem('verify_email')
        localStorage.removeItem('token')
        toast.dismiss();
        toast.success("Verify successful, please login! Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            if (response.role === "customer") {
              router.push("/login-user-customer");
            } else if (response.role === "store_admin") {
              router.push("/login-store-admin");
            } else if (response.role === "super_admin") {
              router.push("/login-super-admin");
            }
          } ,
        });
      } else {
        toast.dismiss();
        toast.error("Failed To verify. Please Try again !.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        })
        setTimeout(() => {
          router.push("/verify-register");
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
      <VerifyAndSetPass onSubmit={handleSubmit} />
    </>
  );
}
