"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useI18n } from "@/contexts/I18nContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import OTPInput from "@/components/ui/OTPInput";
import apiClient, { setAuthToken, setActiveProfileId } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { useClientFcmToken } from "@/hooks/useClientFcmToken";

const getDeviceName = () => {
  if (typeof navigator === "undefined") return "web";
  return navigator.userAgent?.slice(0, 255) || "web";
};

const getPlatform = () => "web";

interface VerifyEmailFormProps {
  email: string;
  password?: string;
  onSuccess?: () => void;
  showBackToLogin?: boolean;
}

export default function VerifyEmailForm({
  email,
  password,
  onSuccess,
  showBackToLogin = true,
}: VerifyEmailFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { setUser, fetchProfile } = useAuth();

  const [otp, setOtp] = useState("");
  const getClientFcmToken = useClientFcmToken();
  const [otpLoading, setOtpLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResendOtp = async (): Promise<void> => {
    if (!email) {
      toast.error(t("auth.emailRequired") || "Email is required");
      return;
    }
    try {
      setIsResending(true);
      await apiClient.post("/auth/resend-email-otp", { email });
      toast.success(t("auth.otpResent") || "OTP resent to your email");
      setOtp("");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t("auth.failedToResendOtp") || "Failed to resend OTP"));
    } finally {
      setIsResending(false);
    }
  };

  const submitOtp = async (code: string): Promise<void> => {
    // Prevent multiple simultaneous calls
    if (otpLoading) return;

    if (!code || code.length < 4) {
      toast.error(
        t("auth.enterValidOtp") ||
          "Enter the verification code from your email"
      );
      return;
    }
    if (!email) {
      toast.error(t("auth.emailRequired") || "Email is required");
      return;
    }
    try {
      setOtpLoading(true);
      // Verify OTP
      await apiClient.post("/auth/verify-email", { email, code });

      // Auto login if password is available
      if (password) {
        // Try to get FCM token, but make it optional
        const tokenForRequest = await getClientFcmToken();

        const loginRes = await apiClient.post("/auth/login", {
          email,
          password,
          device_name: getDeviceName(),
          platform: getPlatform(),
          fcm_token: tokenForRequest || undefined,
        });
        const token = loginRes?.data?.data?.token;
        const talent = loginRes?.data?.data?.talent;
        const userData = loginRes?.data?.data?.user;
        if (token) {
          // Set auth token
          setAuthToken(token);
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_email", email);
          }
          // Set active profile id BEFORE fetching profile
          if (talent?.primary_profile_id) {
            setActiveProfileId(talent.primary_profile_id);
          }
          // Set initial user (profile details will be enriched in fetchProfile)
            setUser({
              id: userData?.id,
              name: userData?.name || "Allure User",
              email: userData?.email || email,
              talent,
            });
          // Fetch full profile now that profile_id is stored
          await fetchProfile();
          toast.success(t("auth.emailVerified") || "Email verified. Welcome!");
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/");
          }
        } else {
          toast.success(
            t("auth.emailVerified") || "Email verified. Please login."
          );
          router.push("/login");
        }
      } else {
        toast.success(
          t("auth.emailVerified") || "Email verified. Please login."
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/login");
        }
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t("auth.verificationFailed") || "Verification failed"));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
        {t("auth.verifyEmailInfo") ||
          "We've sent a verification link to your email. You can either click the link or enter the OTP code below."}
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
            onComplete={(code) => submitOtp(code)}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t("auth.otpHint") ||
              "Enter the 4–6 digit code we sent to"}{" "}
            <strong>{email || (t("auth.yourEmail") || "your email")}</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <button
            type="button"
            className="flex items-center gap-2 font-semibold text-[#c49a47] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={otpLoading || isResending}
          >
            {isResending && (
              <svg
                className="h-4 w-4 animate-spin"
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
          {showBackToLogin && (
            <Link
              href="/login"
              className="text-gray-600 hover:text-[#c49a47] dark:text-gray-400"
            >
              {t("auth.backToLogin") || "Back to login"}
            </Link>
          )}
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
  );
}
