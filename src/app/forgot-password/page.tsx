"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { useAuthRedirect } from "@/hooks/useAuthPatterns";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuthRedirect();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"form" | "success">("form");
  const isSuccess = mode === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      
      if (data?.status === "success") {
        toast.success(data?.message || t("auth.resetCodeSent") || "Reset code sent to your email!");
        setMode("success");
        // Redirect to reset password page with email
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        toast.error(data?.message || t("auth.failedToSendResetCode") || "Failed to send reset code");
      }
    } catch (err) {
      console.error("Forgot password failed", err);
      const message = getErrorMessage(err, t("auth.failedToSendResetCode") || "Failed to send reset code");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const description = isSuccess ? (
    <>
      {t("auth.resetLinkSentPrefix")} <strong>{email || t("auth.yourInbox")}</strong>. {t("auth.followInstructions")}
    </>
  ) : (
    t("auth.noWorries")
  );

  const footer = isSuccess ? (
    <>
      {t("auth.differentInboxQuestion")} {" "}
      <button type="button" className="font-semibold text-[#c49a47]" onClick={() => setMode("form")}>
        {t("auth.tryAnotherEmail")}
      </button>
    </>
  ) : (
    <>
      {t("auth.rememberedPasswordQuestion")} {" "}
      <Link href="/login" className="font-semibold text-[#c49a47]">
        {t("auth.backToLogin")}
      </Link>
    </>
  );

  if (!hydrated) {
    return <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">{t("auth.loading") || "Loading..."}</div>;
  }
  if (isAuthenticated) return null;

  return (
    <AuthShell
      title={isSuccess ? t("auth.checkYourInbox") : t("auth.forgotPassword")}
      description={description}
      icon={isSuccess ? "✓" : "?"}
      footer={footer}
      accent={isSuccess ? "emerald" : "rose"}
    >
      {!isSuccess ? (
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

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {t("auth.sendResetLink")}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-3xl text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            ✓
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {t("auth.didntReceiveEmail")} {t("or")} {" "}
            <button type="button" onClick={() => setMode("form")} className="font-semibold text-[#c49a47]">
              {t("auth.tryAnotherEmail")}.
            </button>
          </p>
          <Link href="/login" className="block">
            <Button variant="primary" className="w-full">
              {t("auth.backToLogin")}
            </Button>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
