"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { KeyRound } from "lucide-react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { useAuthRedirect } from "@/hooks/useAuthPatterns";

function ResetPasswordContent() {
  const { t } = useI18n();
  const router = useRouter();
  useAuthRedirect(); // Hook handles auth redirect internally
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error(t("auth.passwordsMismatch") || "Passwords do not match");
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
        toast.success(data?.message || t("auth.passwordResetSuccessful") || "Password reset successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data?.message || t("auth.failedToResetPassword") || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password failed", err);
      const message = getErrorMessage(err, t("auth.failedToResetPassword") || "Failed to reset password");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title={t("auth.resetPassword") || "Reset Password"}
      description={t("auth.resetCodeDescription") || "Enter the code sent to your email and your new password"}
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
            {t("auth.emailAddress")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('forms.youExampleCom') || "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="code" required>
            {t("auth.resetCodeLabel") || "Reset Code"}
          </Label>
          <Input
            id="code"
            type="text"
            placeholder={t('forms.enter6DigitCode') || "Enter 6-digit code"}
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
            placeholder={t('forms.password') || "••••••••"}
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
            placeholder={t('forms.password') || "••••••••"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t("auth.resetPassword") || "Reset Password"}
        </Button>

 <div className="text-center text-sm text-gray-600 ">
          {t("auth.didntReceiveCode") || "Didn't receive the code?"} {" "}
          <Link href="/forgot-password" className="font-semibold text-[#c49a47]">
            {t("auth.resendCode") || "Resend code"}
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
