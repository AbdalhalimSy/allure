'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { getPaymentStatus } from '@/lib/api/payments';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkFunctionRef = useRef<(() => Promise<void>) | null>(null);

  const performPaymentCheck = useCallback(async () => {
    try {
      let orderId = searchParams.get('order_id');

      if (!orderId && typeof window !== 'undefined') {
        orderId = localStorage.getItem('pending_order_id');
      }

      if (!orderId) {
        setStatus('failed');
        setMessage('No order information found');
        return;
      }

      const response = await getPaymentStatus(orderId);

      if (response.status === 'success' && response.data) {
        const paymentStatus = response.data.status;

        if (paymentStatus === 'success') {
          setStatus('success');
          setMessage('Payment completed successfully! Your subscription is now active.');
          setOrderDetails(response.data);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('pending_order_id');
          }
        } else if (paymentStatus === 'pending') {
          setStatus('pending');
          setMessage('Payment is being processed. Please wait...');
          if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
          if (checkFunctionRef.current) {
            checkTimeoutRef.current = setTimeout(checkFunctionRef.current, 3000);
          }
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
  }, [searchParams]);

  useEffect(() => {
    checkFunctionRef.current = performPaymentCheck;
  }, [performPaymentCheck]);

  useEffect(() => {
    performPaymentCheck();
    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [performPaymentCheck]);

  return (
 <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white ">
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
 <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg ">
            <div className="mb-6 text-center">
              {status === 'checking' || status === 'pending' ? (
 <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ">
 <Loader2 className="h-10 w-10 animate-spin text-blue-600 " />
                </div>
              ) : status === 'success' ? (
 <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ">
 <CheckCircle className="h-10 w-10 text-green-600 " />
                </div>
              ) : (
 <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 ">
 <XCircle className="h-10 w-10 text-red-600 " />
                </div>
              )}

 <h1 className="mb-2 text-2xl font-bold text-gray-900 ">
                {status === 'checking'
                  ? 'Verifying Payment'
                  : status === 'pending'
                  ? 'Processing Payment'
                  : status === 'success'
                  ? 'Payment Successful!'
                  : 'Payment Failed'}
              </h1>
 <p className="text-gray-600 ">{message}</p>
            </div>

            {orderDetails && (
 <div className="mb-6 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 ">
                <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600 ">Order ID</span>
 <span className="font-mono font-medium text-gray-900 ">
                    {orderDetails.order_id}
                  </span>
                </div>
                {orderDetails.tracking_id && (
                  <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600 ">Tracking ID</span>
 <span className="font-mono font-medium text-gray-900 ">
                      {orderDetails.tracking_id}
                    </span>
                  </div>
                )}
 <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2 ">
 <span className="text-gray-600 ">Amount</span>
 <span className="font-semibold text-gray-900 ">
                    AED {orderDetails.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

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
 <div className="text-center text-sm text-gray-600 ">
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

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
 <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-white via-gray-50 to-white ">
 <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm ">
            <Loader2 className="h-5 w-5 animate-spin text-[#c49a47]" />
 <span className="text-sm font-medium text-gray-700 ">
              Loading payment status...
            </span>
          </div>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
