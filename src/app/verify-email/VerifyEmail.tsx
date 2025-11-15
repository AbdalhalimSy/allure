"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/layout/AuthShell";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { useI18n } from "@/contexts/I18nContext";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");
    if (emailParam) setEmail(emailParam);
    if (passwordParam) setPassword(passwordParam);
  }, [searchParams]);

  const VerifyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="currentColor"
    >
      <path d="M20 8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9l5 4Zm-6.293 5.293L11 15l-1.707-1.707-1.414 1.414L11 17.828l4.121-4.121-1.414-1.414Z" />
    </svg>
  );

  return (
    <AuthShell
      badge={t("auth.accountVerification") || "Account Verification"}
      title={t("auth.verifyEmail") || "Verify your email"}
      description={
        t("auth.verifyEmailDescription") ||
        "We sent a link and an OTP code to your email."
      }
      icon={VerifyIcon}
      footer={
        <>
          {t("auth.rememberedPasswordQuestion")} {" "}
          <Link href="/login" className="font-semibold text-[#c49a47]">
            {t("auth.backToLogin")}
          </Link>
        </>
      }
    >
      <VerifyEmailForm email={email} password={password} />
    </AuthShell>
  );
}
