'use client';

import { Subscription } from '@/types/subscription';
import { History, Calendar, Tag, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/contexts/I18nContext';

interface SubscriptionHistoryListProps {
  subscriptions: Subscription[];
}

export function SubscriptionHistoryList({ subscriptions }: SubscriptionHistoryListProps) {
  const { t } = useI18n();
  
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {t('account.billing.history.noHistory')}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('account.billing.history.noHistoryDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => {
        const active = subscription.is_active;
        const statusColor = active
          ? 'text-[#8a6a1f] bg-[#c49a47]/15 ring-[#c49a47]/30'
          : 'text-gray-700 bg-gray-100 ring-gray-200';
        const accent = active
          ? 'from-[#c49a47]/40 via-[#c49a47]/15 to-transparent'
          : 'from-gray-500/10 via-gray-500/5 to-transparent';
        const statusIcon = active ? (
          <CheckCircle2 className="h-4 w-4 text-[#c49a47]" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-500" />
        );

        return (
          <div
            key={subscription.id}
 className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md "
          >
            <div className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${accent}`} aria-hidden />
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-[#c49a47] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                    {subscription.package_name}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusColor}`}>
                    {statusIcon}
                    {active ? t('account.billing.history.active') : t('account.billing.history.expired')}
                  </span>
                  {subscription.package_price && (
 <span className="rounded-full bg-[#c49a47]/10 px-3 py-1 text-xs font-semibold text-[#8a6a1f] ">
                      {subscription.package_price.toFixed(2)} AED
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 ">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(new Date(subscription.starts_at), 'MMM dd, yyyy')} - {format(new Date(subscription.end_at), 'MMM dd, yyyy')}
                    </span>
                  </div>

 <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 ">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {t('account.billing.history.purchased')} {format(new Date(subscription.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>

                  {subscription.coupon_used && (
 <div className="flex items-center gap-2 rounded-xl border border-[#c49a47]/30 bg-[#c49a47]/10 px-3 py-2 text-sm text-[#8a6a1f] ">
                      <Tag className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-mono font-semibold">
                        {subscription.coupon_used.code}
                      </span>
                      <span className="text-sm text-[#8a6a1f]">
                        {subscription.coupon_used.type === '%'
                          ? `${subscription.coupon_used.discount}% ${t('account.billing.coupon.off')}`
                          : `${subscription.coupon_used.discount} AED ${t('account.billing.coupon.off')}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
 <div className="relative overflow-hidden rounded-xl border border-[#c49a47]/30 bg-[#c49a47]/5 px-4 py-3 text-center shadow-inner ">
 <div className="absolute inset-0 bg-linear-to-br from-white/60 to-white/0 " aria-hidden />
 <p className="text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    {active ? t('account.billing.status.daysRemaining') : t('account.billing.history.expired')}
                  </p>
 <p className="mt-1 text-3xl font-bold text-[#8a6a1f] ">
                    {active ? subscription.days_remaining ?? 0 : '—'}
                  </p>
                  {active && (
 <p className="text-xs font-medium text-[#8a6a1f] ">{t('account.billing.status.active')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
