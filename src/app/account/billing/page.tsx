'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, ShoppingCart, Tag } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import AccountSection from '@/components/account/AccountSection';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { getAccountNavItems } from '@/lib/utils/accountNavItems';
import { PackageCard } from '@/components/subscriptions/PackageCard';
import { CouponInput } from '@/components/subscriptions/CouponInput';
import { SubscriptionStatus } from '@/components/subscriptions/SubscriptionStatus';
import { SubscriptionHistoryList } from '@/components/subscriptions/SubscriptionHistoryList';
import { PaymentHistoryTable } from '@/components/subscriptions/PaymentHistoryTable';
import {
  getSubscriptionPackages,
  getSubscriptionStatus,
  getSubscriptionHistory,
  getPaymentHistory,
  createSubscription,
} from '@/lib/api/subscriptions';
import type {
  SubscriptionPackage,
  PricingDetails,
  Coupon,
  Subscription,
  Payment,
} from '@/types/subscription';
import { getActiveProfileId } from '@/lib/api/client';

export default function BillingPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);
  
  const [profileId, setProfileId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'subscribe' | 'history' | 'payments'>('subscribe');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Subscription data
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [pricing, setPricing] = useState<PricingDetails | null>(null);

  useEffect(() => {
    const activeProfileId = getActiveProfileId();
    if (activeProfileId) {
      setProfileId(Number(activeProfileId));
      loadData(Number(activeProfileId));
    } else {
      setError(t('account.billing.errors.selectProfile'));
      setLoading(false);
    }
  }, []);

  const loadData = async (profId: number) => {
    try {
      setLoading(true);
      const [packagesRes, statusRes, historyRes, paymentsRes] = await Promise.all([
        getSubscriptionPackages(),
        getSubscriptionStatus(profId),
        getSubscriptionHistory(profId),
        getPaymentHistory(profId),
      ]);

      setPackages(packagesRes.data.packages);
      setHasSubscription(statusRes.data.has_subscription);
      setCurrentSubscription(statusRes.data.subscription || null);
      setSubscriptions(historyRes.data.subscriptions);
      setPayments(paymentsRes.data.payments);
      setTotalSpent(paymentsRes.data.total_spent);
    } catch (err: any) {
      setError(err.response?.data?.message || t('account.billing.errors.load'));
    } finally {
      setLoading(false);
    }
  };

  const handleCouponApplied = (newPricing: PricingDetails, coupon: Coupon) => {
    setPricing(newPricing);
    setAppliedCoupon(coupon);
  };

  const handleCouponRemoved = () => {
    setPricing(null);
    setAppliedCoupon(null);
  };

  const handleSubscribe = async () => {
    if (!selectedPackageId || !profileId) return;

    setProcessing(true);
    setError('');

    try {
      const paymentRef = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const selectedPackage = packages.find((p) => p.id === selectedPackageId);
      if (!selectedPackage) throw new Error('Selected package not found');

      const finalPrice = pricing?.final_price || selectedPackage.price;

      await createSubscription({
        profile_id: profileId,
        package_id: selectedPackageId,
        coupon_code: appliedCoupon?.code,
        payment_reference: paymentRef,
        payment_method: 'credit_card',
        amount_paid: finalPrice,
      });

      // Reload data and switch to history tab
      await loadData(profileId);
      setSelectedPackageId(null);
      setAppliedCoupon(null);
      setPricing(null);
      setActiveTab('history');
    } catch (err: any) {
      setError(err.response?.data?.message || t('account.billing.errors.create'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <AccountLayout navItems={navItems}>
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#c49a47]" />
          </div>
        </AccountLayout>
      </ProtectedRoute>
    );
  }

  const selectedPackage = packages?.find((p) => p.id === selectedPackageId);
  const finalPrice = pricing?.final_price || selectedPackage?.price || 0;

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <div className="space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Current Subscription Status */}
          {profileId && (
            <AccountSection title={t('account.billing.status.title')} description={t('account.billing.status.description')}>
              <SubscriptionStatus
                subscription={currentSubscription}
                hasSubscription={hasSubscription}
              />
            </AccountSection>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-white/10">
            <nav className="-mb-px flex gap-8">
              <button
                onClick={() => setActiveTab('subscribe')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'subscribe'
                    ? 'border-[#c49a47] text-[#c49a47]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t('account.billing.tabs.plans')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'border-[#c49a47] text-[#c49a47]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t('account.billing.tabs.history')} ({subscriptions?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'payments'
                    ? 'border-[#c49a47] text-[#c49a47]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t('account.billing.tabs.payments')} ({payments?.length || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'subscribe' && (
            <>
              <AccountSection
                title={t('account.billing.packages.title')}
                description={t('account.billing.packages.description')}
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {packages?.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      isSelected={selectedPackageId === pkg.id}
                      onSelect={setSelectedPackageId}
                      discountedPrice={
                        selectedPackageId === pkg.id && pricing
                          ? pricing.final_price
                          : undefined
                      }
                    />
                  ))}
                </div>
                
                {(packages?.length ?? 0) === 0 && (
                  <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('account.billing.packages.noPackages')}
                    </p>
                  </div>
                )}
              </AccountSection>

              {selectedPackageId && profileId && (
                <AccountSection title={t('account.billing.order.title')}>
                  <div className="space-y-6">
                    <CouponInput
                      profileId={profileId}
                      packageId={selectedPackageId}
                      onCouponApplied={handleCouponApplied}
                      onCouponRemoved={handleCouponRemoved}
                    />

                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('account.billing.order.summary')}</h3>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{t('account.billing.order.package')}:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedPackage?.name}
                          </span>
                        </div>
                        {pricing && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{t('account.billing.order.originalPrice')}:</span>
                              <span className="text-gray-900 line-through dark:text-white">
                                {pricing.original_price.toFixed(2)} AED
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                              <span>{t('account.billing.order.discount')}:</span>
                              <span>-{pricing.discount_amount.toFixed(2)} AED</span>
                            </div>
                          </>
                        )}
                        <div className="border-t border-gray-200 pt-2 dark:border-white/10">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{t('account.billing.order.total')}:</span>
                            <span className="text-2xl font-bold text-[#c49a47]">
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
                          {t('account.billing.processing')}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="me-2 h-5 w-5" />
                          {t('account.billing.subscribe')}
                        </>
                      )}
                    </Button>
                  </div>
                </AccountSection>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <AccountSection
              title={t('account.billing.history.title')}
              description={t('account.billing.history.description')}
            >
              <SubscriptionHistoryList subscriptions={subscriptions || []} />
            </AccountSection>
          )}

          {activeTab === 'payments' && (
            <AccountSection
              title={t('account.billing.payments.title')}
              description={t('account.billing.payments.description')}
            >
              <PaymentHistoryTable payments={payments || []} totalSpent={totalSpent} />
            </AccountSection>
          )}
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}