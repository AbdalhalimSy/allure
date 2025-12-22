'use client';

import { Payment, Subscription } from '@/types/subscription';
import { Receipt, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/contexts/I18nContext';

interface PaymentHistoryTableProps {
  payments: Payment[];
  totalSpent?: number;
  subscriptions?: Subscription[];
}

export function PaymentHistoryTable({ payments, totalSpent: _totalSpent, subscriptions }: PaymentHistoryTableProps) {
  const { t } = useI18n();
  
  const getPaymentMethodIcon = () => {
    return <CreditCard className="h-4 w-4" />;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: t('account.billing.payments.creditCard'),
      debit_card: t('account.billing.payments.debitCard'),
      bank_transfer: t('account.billing.payments.bankTransfer'),
      cash: t('account.billing.payments.cash'),
      other: 'Other',
    };
    return labels[method] || method;
  };

  const formatDateParts = (dateString: string | null | undefined): { dateLabel: string; timeLabel: string } => {
    if (!dateString) return { dateLabel: '—', timeLabel: '' };
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      if (isNaN(date.getTime())) return { dateLabel: '—', timeLabel: '' };
      return {
        dateLabel: format(date, 'MMM dd, yyyy'),
        timeLabel: format(date, 'HH:mm'),
      };
    } catch {
      return { dateLabel: '—', timeLabel: '' };
    }
  };

  const resolvePackageName = (payment: Payment): string => {
    if (payment.package_name) return payment.package_name;
    if (payment.package?.title) return payment.package.title;
    if (payment.package?.name) return payment.package.name;

    const paymentMoment = payment.paid_at || payment.created_at;
    if (paymentMoment && subscriptions?.length) {
      const target = new Date(paymentMoment.replace(' ', 'T')).getTime();
      const matched = subscriptions.find((subscription) => {
        const start = new Date(subscription.starts_at.replace(' ', 'T')).getTime();
        const created = new Date(subscription.created_at.replace(' ', 'T')).getTime();
        const withinOneMinute = Math.abs(start - target) <= 60_000 || Math.abs(created - target) <= 60_000;
        return (
          (payment.subscription_id && subscription.id === payment.subscription_id) ||
          withinOneMinute
        );
      });

      if (matched) {
        return matched.package_name || matched.package?.title || matched.package?.name || 'Subscription payment';
      }
    }

    return 'Subscription payment';
  };

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{t('account.billing.payments.noPayments')}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('account.billing.payments.noPaymentsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t('account.billing.payments.date')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t('account.billing.payments.package')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t('account.billing.payments.method')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t('account.billing.payments.reference')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t('account.billing.payments.amount')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {payments.map((payment) => {
                const paymentDate = payment.paid_at || payment.created_at;
                const { dateLabel, timeLabel } = formatDateParts(paymentDate);

                return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {dateLabel}
                    {timeLabel && (
                      <div className="text-xs text-gray-500">
                        {timeLabel}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {resolvePackageName(payment)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon()}
                      {getPaymentMethodLabel(payment.payment_method)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    {payment.payment_reference}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-end text-sm font-semibold text-gray-900">
                    {payment.amount.toFixed(2)} AED
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {t('account.billing.payments.paid')}
                    </span>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
