"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { KeyRound } from "lucide-react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api/client";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">{t("auth.loading") || "Loading..."}</div>;
  }
  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/auth/reset-password", {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (data?.status === "success") {
        toast.success(data?.message || "Password reset successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password failed", err);
      const errData = isAxiosError(err) ? err.response?.data : null;
      const message =
        (errData as { message?: string; error?: string } | null)?.message ||
        (errData as { message?: string; error?: string } | null)?.error ||
        "Failed to reset password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      badge={t("auth.accountRecovery")}
      title={t("auth.resetPassword") || "Reset Password"}
      description="Enter the code sent to your email and your new password"
      icon={<KeyRound className="h-8 w-8" />}
      footer={
        <>
          {t("auth.rememberedPasswordQuestion")} {" "}
          <Link href="/login" className="font-semibold text-[#c49a47]">
            {t("auth.backToLogin")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" required>
            {t("contact.emailAddress")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="code" required>
            Reset Code
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" required>
            {t("auth.newPassword") || "New Password"}
          </Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password_confirmation" required>
            {t("auth.confirmPassword") || "Confirm Password"}
          </Label>
          <PasswordInput
            id="password_confirmation"
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t("auth.resetPassword") || "Reset Password"}
        </Button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Didn&apos;t receive the code? {" "}
          <Link href="/forgot-password" className="font-semibold text-[#c49a47]">
            Resend code
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
