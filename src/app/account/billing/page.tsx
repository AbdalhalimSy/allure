"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import AccountPageWrapper from "../_lib/AccountPageWrapper";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";
import { PackageCard } from "@/components/subscriptions/PackageCard";
import { CouponInput } from "@/components/subscriptions/CouponInput";
import { SubscriptionStatus } from "@/components/subscriptions/SubscriptionStatus";
import { SubscriptionHistoryList } from "@/components/subscriptions/SubscriptionHistoryList";
import { PaymentHistoryTable } from "@/components/subscriptions/PaymentHistoryTable";
import {
  getSubscriptionPackages,
  getSubscriptionStatus,
  getSubscriptionHistory,
  getPaymentHistory,
} from "@/lib/api/subscriptions";
import { initiatePayment, redirectToPaymentGateway } from "@/lib/api/payments";
import type {
  SubscriptionPackage,
  Subscription,
  Payment,
} from "@/types/subscription";
import { getActiveProfileId } from "@/lib/api/client";

export default function BillingPage() {
  const { t, locale } = useI18n();

  const [profileId, setProfileId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "subscribe" | "history" | "payments"
  >("subscribe");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Subscription data
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const loadData = useCallback(
    async (profId: number) => {
      try {
        setLoading(true);
        const [packagesRes, statusRes, historyRes, paymentsRes] =
          await Promise.all([
            getSubscriptionPackages(locale),
            getSubscriptionStatus(profId),
            getSubscriptionHistory(profId),
            getPaymentHistory(profId),
          ]);

        // Handle packages response
        const pkgs = Array.isArray(packagesRes.data)
          ? packagesRes.data
          : (packagesRes.data as any).packages || [];
        setPackages(pkgs);

        setHasSubscription(statusRes.data.has_subscription);
        setCurrentSubscription(statusRes.data.subscription || null);

        // Handle history response
        const subs = Array.isArray(historyRes.data)
          ? historyRes.data
          : (historyRes.data as any).subscriptions || [];
        setSubscriptions(subs);

        setPayments(paymentsRes.data.payments);
        setTotalSpent(paymentsRes.data.total_spent);
      } catch (err: any) {
        setError(
          err.response?.data?.message || t("account.billing.errors.load")
        );
      } finally {
        setLoading(false);
      }
    },
    [t, locale]
  );

  useEffect(() => {
    const activeProfileId = getActiveProfileId();
    if (activeProfileId) {
      setProfileId(Number(activeProfileId));
      loadData(Number(activeProfileId));
    } else {
      setError(t("account.billing.errors.selectProfile"));
      setLoading(false);
    }
  }, [t, locale, loadData]);

  useEffect(() => {
    if (hasSubscription) {
      setActiveTab((prev) => (prev === "subscribe" ? "history" : prev));
      setSelectedPackageId(null);
    }
  }, [hasSubscription]);

  const handleSubscribe = async () => {
    if (!selectedPackageId || !profileId) return;

    setProcessing(true);
    setError("");

    try {
      // Initiate payment with backend
      const response = await initiatePayment({
        profile_id: profileId,
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
        setError(response.message || t("account.billing.errors.create"));
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || t("account.billing.errors.create")
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AccountPageWrapper requireCompleteProfile={false}>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#c49a47]" />
        </div>
      </AccountPageWrapper>
    );
  }

  const selectedPackage = packages?.find((p) => p.id === selectedPackageId);
  const finalPrice = selectedPackage
    ? selectedPackage.price - couponDiscount
    : 0;

  return (
    <AccountPageWrapper requireCompleteProfile={false}>
      <div className="space-y-6 sm:space-y-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </div>
        )}

          {/* Current Subscription Status */}
          {profileId && (
            <AccountSection
              title={t("account.billing.status.title")}
              description={t("account.billing.status.description")}
            >
              <SubscriptionStatus
                subscription={currentSubscription}
                hasSubscription={hasSubscription}
              />
            </AccountSection>
          )}

          {/* Tab Navigation */}
 <div className="border-b border-gray-200 ">
            <nav className="-mb-px flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
              {!hasSubscription && (
                <button
                  onClick={() => setActiveTab("subscribe")}
                  className={`whitespace-nowrap border-b-2 px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "subscribe"
                      ? "border-[#c49a47] text-[#c49a47]"
 : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 "
                  }`}
                >
                  {t("account.billing.tabs.plans")}
                </button>
              )}
              <button
                onClick={() => setActiveTab("history")}
                className={`whitespace-nowrap border-b-2 px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "border-[#c49a47] text-[#c49a47]"
 : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 "
                }`}
              >
                {t("account.billing.tabs.history")} (
                {subscriptions?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`whitespace-nowrap border-b-2 px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "payments"
                    ? "border-[#c49a47] text-[#c49a47]"
 : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 "
                }`}
              >
                {t("account.billing.tabs.payments")} ({payments?.length || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "subscribe" && !hasSubscription && (
            <>
              <AccountSection
                title={t("account.billing.packages.title")}
                description={t("account.billing.packages.description")}
              >
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {packages?.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      isSelected={selectedPackageId === pkg.id}
                      onSelect={setSelectedPackageId}
                      discountedPrice={
                        selectedPackageId === pkg.id && couponDiscount > 0
                          ? pkg.price - couponDiscount
                          : undefined
                      }
                    />
                  ))}
                </div>

                {(packages?.length ?? 0) === 0 && (
                  <div className="rounded-lg sm:rounded-xl border-2 border-gray-200 bg-gray-50 p-4 sm:p-8 text-center ">
                    <p className="text-xs sm:text-sm text-gray-600 ">
                      {t("account.billing.packages.noPackages")}
                    </p>
                  </div>
                )}
              </AccountSection>

              {selectedPackageId && profileId && (
                <AccountSection title={t("account.billing.order.title")}>
                  <div className="space-y-4 sm:space-y-6">
                    <CouponInput
                      profileId={profileId}
                      packageId={selectedPackageId}
                      onCouponApplied={setCouponDiscount}
                      onCouponCodeChange={setCouponCode}
                    />

                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 ">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 ">
                        {t("account.billing.order.summary")}
                      </h3>
                      <div className="mt-3 sm:mt-4 space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 ">
                            {t("account.billing.order.package")}:
                          </span>
                          <span className="font-medium text-gray-900 ">
                            {selectedPackage?.title || selectedPackage?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 ">
                            {t("account.billing.order.originalPrice")}:
                          </span>
                          <span
                            className={
                              couponDiscount > 0
                                ? "text-gray-900 line-through "
                                : "text-gray-900 "
                            }
                          >
                            {selectedPackage?.price.toFixed(2)} AED
                          </span>
                        </div>
                        {couponDiscount > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-green-600">
                            <span>{t("account.billing.order.discount")}:</span>
                            <span>-{couponDiscount.toFixed(2)} AED</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 ">
                          <div className="flex justify-between">
                            <span className="text-base sm:text-lg font-bold text-gray-900 ">
                              {t("account.billing.order.total")}:
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-[#c49a47]">
                              {finalPrice.toFixed(2)} AED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscribe Button */}
                    <Button
                      onClick={handleSubscribe}
                      disabled={processing}
                      className="w-full"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="me-2 h-5 w-5 animate-spin" />
                          {t("account.billing.processing")}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="me-2 h-5 w-5" />
                          {t("account.billing.subscribe")}
                        </>
                      )}
                    </Button>
                  </div>
                </AccountSection>
              )}
            </>
          )}

          {activeTab === "history" && (
            <AccountSection
              title={t("account.billing.history.title")}
              description={t("account.billing.history.description")}
            >
              <SubscriptionHistoryList subscriptions={subscriptions || []} />
            </AccountSection>
          )}

          {activeTab === "payments" && (
            <AccountSection
              title={t("account.billing.payments.title")}
              description={t("account.billing.payments.description")}
            >
              <PaymentHistoryTable
                payments={payments || []}
                totalSpent={totalSpent}
                subscriptions={subscriptions}
              />
            </AccountSection>
          )}
        </div>
      </AccountPageWrapper>
    );
  }
