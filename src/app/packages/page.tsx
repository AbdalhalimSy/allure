"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Crown,
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/contexts/I18nContext";
import { getSubscriptionPackages } from "@/lib/api/subscriptions";
import { initiatePayment, redirectToPaymentGateway } from "@/lib/api/payments";
import type { SubscriptionPackage } from "@/types/subscription";
import { PackageCard } from "@/components/subscriptions/PackageCard";
import { CouponInput } from "@/components/subscriptions/CouponInput";
import Button from "@/components/ui/Button";

export default function PackagesPage() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { t, locale } = useI18n();
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<number | null>(null);

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPackages(locale);
      if (response.status === "success" && Array.isArray(response.data)) {
        setPackages(response.data);
        // Auto-select the first package if available
        if (response.data.length > 0) {
          setSelectedPackageId(response.data[0].id);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadPackages();
    // Get active profile ID from localStorage
    if (typeof window !== "undefined") {
      const profileId = localStorage.getItem("active_profile_id");
      if (profileId) {
        setActiveProfileId(parseInt(profileId));
      }
    }
  }, [loadPackages]);

  const handleProceedToPayment = async () => {
    if (!user) {
      router.push("/login?redirect=/packages");
      return;
    }

    if (!activeProfileId) {
      setError("Please select a profile first");
      return;
    }

    if (!selectedPackageId) {
      setError("Please select a package");
      return;
    }

    try {
      setProcessingPayment(true);
      setError("");

      // Initiate payment
      const response = await initiatePayment({
        profile_id: activeProfileId,
        package_id: selectedPackageId,
        ...(couponCode && { coupon_code: couponCode }),
      });

      if (response.status === "success" && response.data) {
        // Store order ID for later verification
        if (typeof window !== "undefined") {
          localStorage.setItem("pending_order_id", response.data.order_id);
        }

        // Redirect to payment gateway
        redirectToPaymentGateway(
          response.data.gateway_url,
          response.data.encrypted_data,
          response.data.access_code
        );
      } else {
        setError(response.message || "Failed to initiate payment");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);
  const finalPrice = selectedPackage
    ? couponDiscount
      ? selectedPackage.price - couponDiscount
      : selectedPackage.price
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#c49a47]" />
            <p className="mt-4 text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-96 w-96 rounded-full bg-[rgba(196,154,71,0.15)] blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              <Crown className="h-4 w-4" />
              {t("packages.hero.badge")}
            </p>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t("packages.hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 sm:text-xl">
              {t("packages.hero.subtitle")}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <CheckCircle className="h-6 w-6" />,
                key: "payments",
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                key: "featured",
              },
              {
                icon: <Crown className="h-6 w-6" />,
                key: "content",
              },
              {
                icon: <Briefcase className="h-6 w-6" />,
                key: "support",
              },
            ].map((benefit) => (
              <div
                key={benefit.key}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#c49a47] hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#c49a47] to-[#d4a855] text-white shadow-lg shadow-[#c49a47]/20">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t(`packages.benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`packages.benefits.${benefit.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            {t("packages.plans.title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("packages.plans.subtitle")}
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">{t("packages.plans.empty")}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedPackageId === pkg.id}
                onSelect={setSelectedPackageId}
              />
            ))}
          </div>
        )}

        {/* Payment Section */}
        {packages.length > 0 && user && selectedPackage && (
          <div className="mt-12 mx-auto max-w-2xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                {t("packages.plans.title")}
              </h3>

              {/* Error Display */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Selected Package Info */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {t("packages.plans.selectedPackage")}
                  </span>
                  <button
                    onClick={() => setSelectedPackageId(null)}
                    className="text-sm text-[#c49a47] hover:underline"
                  >
                    {t("packages.plans.change")}
                  </button>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {selectedPackage.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPackage.duration_in_days} days
                </p>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                {activeProfileId !== null && selectedPackageId !== null && (
                  <CouponInput
                    profileId={activeProfileId}
                    packageId={selectedPackageId}
                    onCouponApplied={(discount) => setCouponDiscount(discount)}
                    onCouponCodeChange={setCouponCode}
                  />
                )}
              </div>

              {/* Price Summary */}
              <div className="mb-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {t("packages.plans.originalPrice")}
                  </span>
                  <span className="font-medium text-gray-900">
                    AED {selectedPackage.price.toFixed(2)}
                  </span>
                </div>
                {couponDiscount && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>{t("packages.plans.discount")}</span>
                    <span>-AED {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                  <span className="text-lg font-bold text-gray-900">
                    {t("packages.plans.total")}
                  </span>
                  <span className="text-2xl font-bold text-[#c49a47]">
                    AED {finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handleProceedToPayment}
                disabled={processingPayment || !activeProfileId}
                className="w-full bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white shadow-lg hover:shadow-xl"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("packages.plans.processing")}
                  </>
                ) : (
                  <>
                    {t("packages.plans.proceedToPayment")}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:scale-x-[-1]" />
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-500">
                {t("packages.plans.securePayment")}
              </p>
            </div>
          </div>
        )}

        {/* CTA Section for non-logged in users */}
        {packages.length > 0 && !user && (
          <div className="mt-16 rounded-2xl border border-[#c49a47]/30 bg-linear-to-br from-[#fff8ec] to-[#f7e6c2] p-8 text-center lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t("packages.cta.title")}
            </h3>
            <p className="mb-6 text-gray-700">{t("packages.cta.subtitle")}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button className="min-w-[180px] bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white shadow-lg shadow-[#c49a47]/30 transition-all hover:shadow-xl hover:shadow-[#c49a47]/40">
                  {t("packages.cta.createAccount")}
                  <ArrowRight className="ms-2 h-4 w-4 rtl:scale-x-[-1]" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="min-w-[180px]">
                  {t("packages.cta.signIn")}
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              {t("packages.cta.haveAccount")}{" "}
              <Link
                href="/login"
                className="font-semibold text-[#c49a47] hover:underline"
              >
                {t("packages.cta.logIn")}
              </Link>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
