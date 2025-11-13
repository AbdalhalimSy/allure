"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import OTPInput from "@/components/ui/OTPInput";
import apiClient, { setAuthToken } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");
    if (emailParam) setEmail(emailParam);
    if (passwordParam) setPassword(passwordParam);
  }, [searchParams]);

  const handleResendOtp = async () => {
    if (!email) {
      return toast.error("Email is required");
    }
    try {
      setIsResending(true);
      await apiClient.post("/auth/resend-email-otp", { email });
      toast.success(t("auth.otpResent") || "OTP resent to your email");
      setOtp("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const submitOtp = async (code: string) => {
    // Prevent multiple simultaneous calls
    if (otpLoading) return;
    
    if (!code || code.length < 4) {
      return toast.error(t("auth.enterValidOtp") || "Enter the verification code from your email");
    }
    if (!email) {
      return toast.error("Email is required");
    }
    try {
      setOtpLoading(true);
      // Verify OTP
      await apiClient.post("/auth/verify-email", { email, code });

      // Auto login if password is available
      if (password) {
        const loginRes = await apiClient.post("/auth/login", { email, password });
        const token = loginRes?.data?.data?.token;
        if (token) {
          setAuthToken(token);
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_email", email);
          }
          setUser({ name: "Allure User", email });
          toast.success(t("auth.emailVerified") || "Email verified. Welcome!");
          router.push("/dashboard");
        } else {
          toast.success(t("auth.emailVerified") || "Email verified. Please login.");
          router.push("/login");
        }
      } else {
        toast.success(t("auth.emailVerified") || "Email verified. Please login.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const VerifyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path d="M20 8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9l5 4Zm-6.293 5.293L11 15l-1.707-1.707-1.414 1.414L11 17.828l4.121-4.121-1.414-1.414Z"/>
    </svg>
  );

  return (
    <AuthShell
      badge={t("auth.accountVerification") || "Account Verification"}
      title={t("auth.verifyEmail") || "Verify your email"}
      description={t("auth.verifyEmailDescription") || "We sent a link and an OTP code to your email."}
      icon={VerifyIcon}
      footer={
        <>
          {t("auth.rememberedPasswordQuestion")}{" "}
          <Link href="/login" className="font-semibold text-[#c49a47]">
            {t("auth.backToLogin")}
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          {t("auth.verifyEmailInfo") || "We've sent a verification link to your email. You can either click the link or enter the OTP code below."}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="otp" required>
              {t("auth.enterOtp") || "Verification code"}
            </Label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t("auth.otpHint") || "Enter the 4–6 digit code we sent to"} {" "}
              <strong>{email || t("auth.yourEmail") || "your email"}</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button
              type="button"
              className="font-semibold text-[#c49a47] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleResendOtp}
              disabled={otpLoading || isResending}
            >
              {isResending && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {t("auth.resendOtp") || "Resend code"}
            </button>
            <Link href="/login" className="text-gray-600 hover:text-[#c49a47] dark:text-gray-400">
              {t("auth.backToLogin") || "Back to login"}
            </Link>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            isLoading={otpLoading}
            onClick={() => submitOtp(otp)}
            disabled={otp.length < 4}
          >
            {t("auth.verify") || "Verify"}
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
