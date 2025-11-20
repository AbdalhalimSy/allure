'use client';

import { Payment } from '@/types/subscription';
import { Receipt, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentHistoryTableProps {
  payments: Payment[];
  totalSpent: number;
}

export function PaymentHistoryTable({ payments, totalSpent }: PaymentHistoryTableProps) {
  const getPaymentMethodIcon = (method: string) => {
    return <CreditCard className="h-4 w-4" />;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      other: 'Other',
    };
    return labels[method] || method;
  };

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No Payment History</h3>
        <p className="mt-2 text-sm text-gray-600">
          Your payment history will appear here once you make a purchase
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
        <p className="text-sm font-medium opacity-90">Total Spent</p>
        <p className="mt-2 text-3xl font-bold">{totalSpent.toFixed(2)} AED</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Reference
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                    <div className="text-xs text-gray-500">
                      {format(new Date(payment.payment_date), 'HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.package_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payment.payment_method)}
                      {getPaymentMethodLabel(payment.payment_method)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    {payment.payment_reference}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {payment.amount.toFixed(2)} AED
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
