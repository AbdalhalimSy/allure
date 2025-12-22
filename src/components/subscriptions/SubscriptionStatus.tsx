'use client';

import { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useI18n } from '@/contexts/I18nContext';

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  hasSubscription: boolean;
  lastSubscription?: {
    package_name: string;
    expired_at: string;
  };
}

export function SubscriptionStatus({
  subscription,
  hasSubscription,
  lastSubscription,
}: SubscriptionStatusProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!hasSubscription && !lastSubscription) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {t('account.billing.status.noActive')}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('account.billing.status.noActiveDesc')}
        </p>
      </div>
    );
  }

  if (!hasSubscription && lastSubscription) {
    return (
      <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-4">
          <XCircle className="h-8 w-8 text-orange-600" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-900">
              {t('account.billing.status.expired')}
            </h3>
            <p className="mt-1 text-sm text-orange-700">
              Your <span className="font-medium">{lastSubscription.package_name}</span>{' '}
              subscription expired on{' '}
              {format(new Date(lastSubscription.expired_at), 'MMM dd, yyyy')}
            </p>
            <p className="mt-2 text-sm text-orange-600">
              {t('account.billing.status.renewDesc')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (subscription) {
    const daysRemaining = subscription.days_remaining || 0;
    const isExpiringSoon = daysRemaining <= 7;
    const startDate = new Date(subscription.starts_at);
    const endDate = new Date(subscription.end_at);
    const totalDays = Math.max(
      1,
      Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const progress = Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100));

    return (
      <div className="overflow-hidden rounded-2xl border border-[#c49a47]/30 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-[#c49a47]/15 p-2 text-[#c49a47]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#c49a47]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8a6a1f]">
                  {t('account.billing.status.active')}
                </span>
                {isExpiringSoon && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {t('account.billing.status.expiringSoon')}
                  </span>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.package_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('account.billing.status.started')}: {format(startDate, 'MMM dd, yyyy')} • {t('account.billing.status.expires')}: {format(endDate, 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#c49a47]/10 px-4 py-3 text-sm font-semibold text-[#8a6a1f] shadow-inner">
            <Clock className="h-4 w-4" />
            <div className="text-right">
              <div>{daysRemaining} {t('account.billing.status.daysRemaining')}</div>
              {mounted && (
                <div className="text-xs font-normal text-[#8a6a1f]/80">
                  {formatDistanceToNow(endDate, { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#c49a47]/20 bg-gradient-to-r from-[#c49a47]/10 via-white to-[#c49a47]/10 px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-200">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 shadow-sm ring-1 ring-[#c49a47]/20">
                <Calendar className="h-4 w-4 text-[#c49a47]" />
                <span>{format(startDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 shadow-sm ring-1 ring-[#c49a47]/20">
                <Calendar className="h-4 w-4 text-[#c49a47]" />
                <span>{format(endDate, 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span>{t('account.billing.status.daysRemaining')}</span>
                <span>{Math.max(daysRemaining, 0)}d</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-white/10">
                <div
                  className={`h-2 rounded-full ${isExpiringSoon ? 'bg-orange-500' : 'bg-[#c49a47]'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
