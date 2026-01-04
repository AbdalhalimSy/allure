"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import { useI18n } from "@/contexts/I18nContext";
import apiClient, { setAuthToken, setActiveProfileId } from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage, isEmailVerificationError } from "@/lib/utils/errorHandling";
import { useAuthRedirect } from "@/hooks/useAuthPatterns";
import { useClientFcmToken } from "@/hooks/useClientFcmToken";

const getDeviceName = () => {
  if (typeof navigator === "undefined") return "web";
  return navigator.userAgent?.slice(0, 255) || "web";
};

const getPlatform = () => "web";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { setUser, fetchProfile } = useAuth();
  const { hydrated, isAuthenticated } = useAuthRedirect();
  const getClientFcmToken = useClientFcmToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Try to get FCM token, but make it optional
      const tokenForRequest = await getClientFcmToken();
      console.log("FCM Token for login:", tokenForRequest);

      const { data } = await apiClient.post("/auth/login", {
        email,
        password,
        device_name: getDeviceName(),
        platform: getPlatform(),
        ...(tokenForRequest && { fcm_token: tokenForRequest }),
      });
      
      // Check if email verification is required
      if (data?.status === "error" && isEmailVerificationError(data?.message)) {
        toast.error(data.message || t("auth.verifyEmailBeforeLogin") || "Please verify your email before logging in.");
        // Redirect to verify-email page with email and password
        router.push(`/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        return;
      }
      
      // API returns { status, message, data: { token, token_type, user, talent } }
      const token = data?.data?.token;
      const userData = data?.data?.user;
      const talentData = data?.data?.talent;
      
      if (token) {
        // Step 1: Set auth token
        setAuthToken(token);
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_email", email);
        }
        
        // Step 2: Set active profile ID FIRST before any API calls
        if (talentData?.primary_profile_id) {
          setActiveProfileId(talentData.primary_profile_id);
        }
        
        // Step 3: Set user with initial data including talent
        setUser({ 
          id: userData?.id,
          name: userData?.name || "Allure User", 
          email: userData?.email || email,
          talent: talentData,
        });
        
        // Step 4: Fetch full profile data (now profile_id is set in localStorage)
        await fetchProfile();
        
        toast.success(data?.message || t("auth.loginSuccessful") || "Login successful!");
        router.push("/");
      } else {
        toast.error(t("auth.loginFailedNoToken") || "Login failed: No token returned");
      }
    } catch (err) {
      console.error("Login failed", err);
      const message = getErrorMessage(err, t("auth.unauthorized") || "Unauthorized");
      
      // Check if the error is about email verification
      if (isEmailVerificationError(err)) {
        toast.error(message);
        router.push(`/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">{t("auth.loading") || "Loading..."}</div>;
  }

  if (isAuthenticated) {
    // Optional: render nothing while redirecting
    return null;
  }

  return (
    <AuthShell
      title={t("auth.login")}
      description={t("auth.loginHeroSubtitle")}
      icon="↻"
      footer={<span>{t("auth.dontHaveAccount")} <Link href="/register" className="font-semibold text-[#c49a47]">{t("auth.register")}</Link></span>}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* All error notifications now use react-hot-toast */}
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
          <Label htmlFor="password" required>
            {t("auth.password")}
          </Label>
          <PasswordInput
            id="password"
            placeholder={t('forms.password') || "••••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
 <label className="flex items-center gap-2 text-gray-600 ">
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
