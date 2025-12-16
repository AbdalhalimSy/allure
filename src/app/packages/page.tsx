"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Crown,
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionPackages } from "@/lib/api/subscriptions";
import { initiatePayment, redirectToPaymentGateway } from "@/lib/api/payments";
import type { SubscriptionPackage } from "@/types/subscription";
import { PackageCard } from "@/components/subscriptions/PackageCard";
import { CouponInput } from "@/components/subscriptions/CouponInput";
import Button from "@/components/ui/Button";

export default function PackagesPage() {
  const router = useRouter();
  const { data: user } = useAuth();
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

  useEffect(() => {
    loadPackages();
    // Get active profile ID from localStorage
    if (typeof window !== "undefined") {
      const profileId = localStorage.getItem("active_profile_id");
      if (profileId) {
        setActiveProfileId(parseInt(profileId));
      }
    }
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPackages();
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
  };

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
      <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#c49a47]" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading packages...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-linear-to-br from-white via-[#fff8ec] to-white dark:border-white/10 dark:from-black dark:via-[#1a1510] dark:to-black">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />
        <div className="container relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c49a47]/30 bg-[#c49a47]/10 px-4 py-2 text-sm font-semibold text-[#c49a47]">
              <Crown className="h-4 w-4" />
              Premium Membership
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
              Unlock Your{" "}
              <span className="bg-linear-to-r from-[#c49a47] to-[#d4a855] bg-clip-text text-transparent">
                Full Potential
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
              Join thousands of professionals who have elevated their careers
              with our premium membership. Get exclusive access to premium
              features, priority support, and unlimited opportunities.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "Immediate Payments",
                description: "Get paid instantly for your work",
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "Featured Profile",
                description: "Stand out with highlighted visibility",
              },
              {
                icon: <Crown className="h-6 w-6" />,
                title: "Premium Content",
                description: "Upload more photos, videos & audio",
              },
              {
                icon: <ArrowRight className="h-6 w-6" />,
                title: "Priority Support",
                description: "24/7 dedicated customer service",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#c49a47] hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#c49a47] to-[#d4a855] text-white shadow-lg shadow-[#c49a47]/20">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select the perfect package for your needs. All plans include full
            access to platform features.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <p className="text-gray-600 dark:text-gray-400">
              No packages available at this time. Please check back later.
            </p>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Complete Your Purchase
              </h3>

              {/* Error Display */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              {/* Selected Package Info */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Selected Package
                  </span>
                  <button
                    onClick={() => setSelectedPackageId(null)}
                    className="text-sm text-[#c49a47] hover:underline"
                  >
                    Change
                  </button>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPackage.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              <div className="mb-6 space-y-2 border-t border-gray-200 pt-4 dark:border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Original Price
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    AED {selectedPackage.price.toFixed(2)}
                  </span>
                </div>
                {couponDiscount && (
                  <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>-AED {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-white/10">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
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
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                Secure payment powered by CCAvenue
              </p>
            </div>
          </div>
        )}

        {/* CTA Section for non-logged in users */}
        {packages.length > 0 && !user && (
          <div className="mt-16 rounded-2xl border border-[#c49a47]/30 bg-linear-to-br from-[#fff8ec] to-[#f7e6c2] p-8 text-center dark:border-[#c49a47]/40 dark:from-[#2d2210] dark:to-[#3a2c13] lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Ready to Get Started?
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Sign up now to choose your package and unlock all premium
              features.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button className="min-w-[180px] bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white shadow-lg shadow-[#c49a47]/30 transition-all hover:shadow-xl hover:shadow-[#c49a47]/40">
                  Create Account
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="min-w-[180px]">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#c49a47] hover:underline"
              >
                Log in
              </Link>{" "}
              to subscribe
            </p>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="border-t border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
        <div className="container mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How does the subscription work?",
                a: "Choose a package that fits your needs, create an account or log in, complete the payment, and instantly unlock all premium features for the duration of your subscription.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, you can manage your subscription from your account settings at any time. Your access will continue until the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and bank transfers for your convenience.",
              },
              {
                q: "Do you offer refunds?",
                a: "Please contact our support team within 7 days of purchase to discuss refund eligibility based on our refund policy.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-black"
              >
                <summary className="cursor-pointer text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
