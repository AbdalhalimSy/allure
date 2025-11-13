"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"form" | "success">("form");
  const isSuccess = mode === "success";

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
    setIsLoading(true);
    // Add your forgot password logic here
    setTimeout(() => {
      setIsLoading(false);
      setMode("success");
    }, 2000);
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

  return (
    <AuthShell
      badge={t("auth.accountRecovery")}
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
