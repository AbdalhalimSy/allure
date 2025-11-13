"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import apiClient, { setAuthToken } from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { setUser, isAuthenticated, hydrated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      
      // Check if email verification is required
      if (data?.status === "error" && data?.message?.toLowerCase().includes("verify your email")) {
        toast.error(data.message || "Please verify your email before logging in.");
        // Redirect to verify-email page with email and password
        router.push(`/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        return;
      }
      
      // API returns { status, message, data: { token, token_type } }
      const token = data?.data?.token;
      if (token) {
        setAuthToken(token);
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_email", email);
        }
        // Set user and profile will be fetched automatically by AuthContext
        setUser({ name: "Allure User", email });
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed: No token returned");
      }
    } catch (err) {
      console.error("Login failed", err);
      const errData = (err as any)?.response?.data;
      const message = errData?.message || errData?.error || "Unauthorized";
      
      // Check if the error is about email verification
      if (message?.toLowerCase().includes("verify your email")) {
        toast.error(message);
        router.push(`/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated (and hydration complete), redirect away
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">{t("auth.loading") || "Loading..."}</div>;
  }

  if (isAuthenticated) {
    // Optional: render nothing while redirecting
    return null;
  }

  return (
    <AuthShell
      badge={t("auth.login")}
      title={t("auth.login")}
      description={t("hero.subtitle")}
      icon="↻"
      footer={<span>{t("auth.dontHaveAccount")} <Link href="/register" className="font-semibold text-[#c49a47]">{t("auth.register")}</Link></span>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* All error notifications now use react-hot-toast */}
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
          <Label htmlFor="password" required>
            {t("auth.password")}
          </Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
            />
            {t("auth.rememberMe")}
          </label>
          <Link href="/forgot-password" className="font-semibold text-[#c49a47]">
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t("auth.signIn")}
        </Button>
      </form>
    </AuthShell>
  );
}
