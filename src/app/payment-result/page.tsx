'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { getPaymentStatus } from '@/lib/api/payments';
import Button from '@/components/ui/Button';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const checkPaymentStatus = async () => {
    try {
      // Get order ID from URL params or localStorage
      let orderId = searchParams.get('order_id');
      
      if (!orderId && typeof window !== 'undefined') {
        orderId = localStorage.getItem('pending_order_id');
      }

      if (!orderId) {
        setStatus('failed');
        setMessage('No order information found');
        return;
      }

      // Check payment status
      const response = await getPaymentStatus(orderId);

      if (response.status === 'success' && response.data) {
        const paymentStatus = response.data.status;

        if (paymentStatus === 'success') {
          setStatus('success');
          setMessage('Payment completed successfully! Your subscription is now active.');
          setOrderDetails(response.data);
          // Clear pending order
          if (typeof window !== 'undefined') {
            localStorage.removeItem('pending_order_id');
          }
        } else if (paymentStatus === 'pending') {
          setStatus('pending');
          setMessage('Payment is being processed. Please wait...');
          // Retry after 3 seconds
          setTimeout(checkPaymentStatus, 3000);
        } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
          setStatus('failed');
          setMessage(
            paymentStatus === 'cancelled'
              ? 'Payment was cancelled. You can try again anytime.'
              : 'Payment failed. Please try again or contact support if the issue persists.'
          );
          setOrderDetails(response.data);
        }
      } else {
        setStatus('failed');
        setMessage('Unable to verify payment status. Please contact support.');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage('An error occurred while verifying your payment. Please contact support.');
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
            {/* Status Icon */}
            <div className="mb-6 text-center">
              {status === 'checking' || status === 'pending' ? (
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              ) : status === 'success' ? (
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
              )}

              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {status === 'checking'
                  ? 'Verifying Payment'
                  : status === 'pending'
                  ? 'Processing Payment'
                  : status === 'success'
                  ? 'Payment Successful!'
                  : 'Payment Failed'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>

            {/* Order Details */}
            {orderDetails && (
              <div className="mb-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">
                    {orderDetails.order_id}
                  </span>
                </div>
                {orderDetails.tracking_id && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tracking ID</span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {orderDetails.tracking_id}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2 dark:border-white/10">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    AED {orderDetails.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'success' ? (
                <>
                  <Link href="/account/subscription">
                    <Button className="w-full bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white">
                      View My Subscription
                      <ArrowRight className="ms-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="secondary" className="w-full">
                      Go to Home
                    </Button>
                  </Link>
                </>
              ) : status === 'failed' ? (
                <>
                  <Link href="/packages">
                    <Button className="w-full bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white">
                      Try Again
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we verify your payment...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
