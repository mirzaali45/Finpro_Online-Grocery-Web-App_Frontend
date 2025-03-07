"use client";

import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangeEmailForm from "@/components/profile/ChangeEmailForm";
import { ChangeEmailValues } from "@/types/auth-types";
import { AuthService } from "@/services/auth.service";

export default function ResetEmailPage() {
  const router = useRouter();

  const handleSubmit = async (values: ChangeEmailValues) => {
    try {
      toast.info("Sending email verification...", {
        autoClose: false,
        isLoading: true,
      });

      const response = await AuthService.requestChangeEmail(values.email);

      toast.dismiss();
      toast.success(response.message, {
        autoClose: 3000,
        onClose: () => {
          // Hapus token & redirect ke halaman verifikasi
          localStorage.removeItem("token");
          localStorage.setItem("verify_token", "true");
          router.push("/verify-reset-email");
        },
      });
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Request change email failed"
      );
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />
      <ChangeEmailForm onSubmit={handleSubmit} />
    </>
  );
}
