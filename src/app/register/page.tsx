"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import AuthShell from "@/components/layout/AuthShell";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/api/client";

export default function RegisterPage() {
  const { t } = useI18n();
  const { isAuthenticated, hydrated, setUser } = useAuth();
  const router = useRouter();

  type Step = 1 | 2;
  const [step, setStep] = useState<Step>(1);
  const [isTwins, setIsTwins] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // single case
    firstName: "",
    lastName: "",
    // twins case
    firstTwinName: "",
    secondTwinName: "",
    twinLastName: "",
    // common
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Redirect authenticated users away from register page
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">
        {t("auth.loading") || "Loading..."}
      </div>
    );
  }
  if (isAuthenticated) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.email) return setErrors({ email: "Required" });
    if (!formData.password) return setErrors({ password: "Required" });
    if (formData.password !== formData.confirmPassword) {
      return setErrors({ confirmPassword: t("auth.passwordsMismatch") || "Passwords do not match" });
    }
    if (!formData.acceptTerms) {
      return setErrors({ acceptTerms: t("auth.acceptTermsError") || "Please accept the terms" });
    }
    if (isTwins) {
      if (!formData.firstTwinName || !formData.secondTwinName || !formData.twinLastName) {
        return setErrors({ name: t("auth.missingNames") || "Please fill twin names and last name" });
      }
    } else {
      if (!formData.firstName) return setErrors({ firstName: "Required" });
      if (!formData.lastName) return setErrors({ lastName: "Required" });
    }

    try {
      setIsLoading(true);
      // Call internal API -> forwards to backend /auth/register
      let first_name = "";
      let last_name = "";
      
      if (isTwins) {
        // For twins: combine both twin names as first_name
        first_name = `${formData.firstTwinName} & ${formData.secondTwinName}`;
        last_name = formData.twinLastName;
      } else {
        // For single: use separate first and last name fields
        first_name = formData.firstName;
        last_name = formData.lastName;
      }

      const payload = {
        first_name,
        last_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      const res = await apiClient.post("/auth/register", payload);
      const msg = res?.data?.message || t("auth.verifyEmailSent") || "We sent a confirmation email.";
      toast.success(msg);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };



  const footer = (
    <>
      {t("auth.alreadyHaveAccount")}{" "}
      <Link href="/login" className="font-semibold text-[#c49a47]">
        {t("auth.signIn")}
      </Link>
    </>
  );

  // Simple non-emoji icons for AuthShell
  const RegisterIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path d="M16 11V7a4 4 0 1 0-8 0v4H6a2 2 0 0 0-2 2v7h16v-7a2 2 0 0 0-2-2h-2Zm-6 0V7a2 2 0 1 1 4 0v4H10Z"/>
    </svg>
  );
  const VerifyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path d="M20 8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9l5 4Zm-6.293 5.293L11 15l-1.707-1.707-1.414 1.414L11 17.828l4.121-4.121-1.414-1.414Z"/>
    </svg>
  );

  return (
    <AuthShell
      badge={t("auth.register")}
      title={step === 1 ? (t("auth.register") || "Create account") : (t("auth.verifyEmail") || "Verify your email")}
      description={
        step === 1
          ? (t("auth.registerDescription") || "Create your account to continue")
          : (t("auth.verifyEmailDescription") || "We sent a link and an OTP code to your email.")
      }
      icon={step === 1 ? RegisterIcon : VerifyIcon}
      footer={footer}
    >
      {step === 1 ? (
        <form onSubmit={submitStep1} className="space-y-6">
          {/* Twins toggle */}
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50/60 p-4 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">
            <label className="flex items-center gap-2">
              <input type="radio" name="twinsMode" checked={!isTwins} onChange={() => setIsTwins(false)} />
              <span>{t("auth.singleRegistration") || "Single registration"}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="twinsMode" checked={isTwins} onChange={() => setIsTwins(true)} />
              <span>{t("auth.twinsRegistration") || "Twins registration"}</span>
            </label>
          </div>

          {/* Names */}
          {!isTwins ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName" required>
                  {t("contact.firstName") || "First Name"}
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" required>
                  {t("contact.lastName") || "Last Name"}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstTwinName" required>
                  {t("auth.firstTwinName") || "First twin name"}
                </Label>
                <Input
                  id="firstTwinName"
                  name="firstTwinName"
                  type="text"
                  placeholder="First twin"
                  value={formData.firstTwinName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="secondTwinName" required>
                  {t("auth.secondTwinName") || "Second twin name"}
                </Label>
                <Input
                  id="secondTwinName"
                  name="secondTwinName"
                  type="text"
                  placeholder="Second twin"
                  value={formData.secondTwinName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="twinLastName" required>
                  {t("contact.lastName") || "Last name"}
                </Label>
                <Input
                  id="twinLastName"
                  name="twinLastName"
                  type="text"
                  placeholder="Family name"
                  value={formData.twinLastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <Label htmlFor="email" required>
              {t("contact.emailAddress")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />
          </div>

          {/* Passwords */}
          <div>
            <Label htmlFor="password" required>
              {t("auth.password")}
            </Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" required>
              {t("auth.confirmPassword")}
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={errors.confirmPassword}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 rounded-2xl bg-gray-50/60 p-4 text-sm text-gray-600 dark:bg_white/5 dark:text-gray-300">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms">
              {t("auth.agreePrefix") || "I agree to the"} {" "}
              <Link href="/terms" className="font-semibold text-[#c49a47]">
                {t("auth.terms") || "Terms & Conditions"}
              </Link>{" "}
              {t("auth.and") || "and"} {" "}
              <Link href="/privacy" className="font-semibold text-[#c49a47]">
                {t("auth.privacy") || "Privacy Policy"}
              </Link>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {t("auth.continue") || "Continue"}
          </Button>
        </form>
      ) : (
        <VerifyEmailForm
          email={formData.email}
          password={formData.password}
          onSuccess={() => router.push("/dashboard")}
        />
      )}
    </AuthShell>
  );
}
