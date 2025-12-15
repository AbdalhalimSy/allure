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

    return (
      <div
        className={`rounded-xl border-2 p-6 ${
          isExpiringSoon
            ? 'border-orange-200 bg-orange-50'
            : 'border-green-200 bg-green-50'
        }`}
      >
        <div className="flex items-start gap-4">
          <CheckCircle
            className={`h-8 w-8 ${
              isExpiringSoon ? 'text-orange-600' : 'text-green-600'
            }`}
          />
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                isExpiringSoon ? 'text-orange-900' : 'text-green-900'
              }`}
            >
              {t('account.billing.status.active')}
            </h3>
            <p
              className={`mt-1 text-sm font-medium ${
                isExpiringSoon ? 'text-orange-700' : 'text-green-700'
              }`}
            >
              {subscription.package_name}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('account.billing.status.started')}: {format(new Date(subscription.starts_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('account.billing.status.expires')}: {format(new Date(subscription.end_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4" />
                <span>
                  {daysRemaining} {t('account.billing.status.daysRemaining')}
                  {mounted && (
                    <> ({formatDistanceToNow(new Date(subscription.end_at), {
                      addSuffix: true,
                    })})</>
                  )}
                </span>
              </div>
            </div>

            {isExpiringSoon && (
              <div className="mt-4 rounded-lg bg-orange-100 px-3 py-2">
                <p className="text-xs font-medium text-orange-800">
                  {t('account.billing.status.expiringSoon')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
