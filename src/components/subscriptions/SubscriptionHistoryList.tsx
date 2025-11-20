'use client';

import { Subscription } from '@/types/subscription';
import { History, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionHistoryListProps {
  subscriptions: Subscription[];
}

export function SubscriptionHistoryList({ subscriptions }: SubscriptionHistoryListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No Subscription History
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your subscription history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className={`rounded-xl border-2 p-6 transition-all ${
            subscription.is_active
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscription.package_name}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    subscription.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {subscription.is_active ? 'Active' : 'Expired'}
                </span>
              </div>

              {subscription.package_price && (
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {subscription.package_price.toFixed(2)} AED
                </p>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(subscription.starts_at), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(subscription.end_at), 'MMM dd, yyyy')}
                  </span>
                </div>

                {subscription.coupon_used && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="font-mono font-semibold text-green-700">
                      {subscription.coupon_used.code}
                    </span>
                    <span className="text-gray-500">
                      ({subscription.coupon_used.type === '%'
                        ? `${subscription.coupon_used.discount}% off`
                        : `${subscription.coupon_used.discount} AED off`}
                      )
                    </span>
                  </div>
                )}

                {subscription.created_at && (
                  <div className="text-xs text-gray-500">
                    Purchased on {format(new Date(subscription.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                )}
              </div>
            </div>

            {subscription.is_active && subscription.days_remaining !== undefined && (
              <div className="text-right">
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <p className="text-2xl font-bold text-primary">
                    {subscription.days_remaining}
                  </p>
                  <p className="text-xs text-gray-600">days left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
