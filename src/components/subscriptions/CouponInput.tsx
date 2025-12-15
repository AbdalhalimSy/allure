'use client';

import { useState } from 'react';
import { Tag, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import { validateCoupon } from '@/lib/api/subscriptions';
import type { PricingDetails, Coupon } from '@/types/subscription';
import { useI18n } from '@/contexts/I18nContext';

interface CouponInputProps {
  profileId: number;
  packageId: number;
  onCouponApplied: (pricing: PricingDetails, coupon: Coupon) => void;
  onCouponRemoved: () => void;
}

export function CouponInput({
  profileId,
  packageId,
  onCouponApplied,
  onCouponRemoved,
}: CouponInputProps) {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const handleValidate = async () => {
    if (!code.trim()) {
      setError(t('account.billing.coupon.errors.required'));
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await validateCoupon({
        profile_id: profileId,
        code: code.trim(),
        package_id: packageId,
      });

      setAppliedCoupon(response.data.coupon);
      onCouponApplied(response.data.pricing, response.data.coupon);
      setError('');
    } catch (err: any) {
      const message =
        err.response?.data?.message || t('account.billing.coupon.errors.invalid');
      setError(message);
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setAppliedCoupon(null);
    setError('');
    onCouponRemoved();
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">{t('account.billing.coupon.applied')}</p>
              <p className="mt-1 text-sm text-green-700">
                Code: <span className="font-mono font-bold">{appliedCoupon.code}</span>
              </p>
              <p className="mt-1 text-xs text-green-600">
                {appliedCoupon.type === '%'
                  ? `${appliedCoupon.discount}% ${t('account.billing.coupon.discount')}`
                  : `${appliedCoupon.discount} AED ${t('account.billing.coupon.discount')}`}
                {' • '}
                {appliedCoupon.is_public ? t('account.billing.coupon.publicCoupon') : t('account.billing.coupon.privateCoupon')}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            {t('account.billing.coupon.remove')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Tag className="h-4 w-4" />
        {t('account.billing.coupon.label')}
      </label>
      
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          placeholder={t('account.billing.coupon.placeholder')}
          disabled={isValidating}
          className="font-mono text-sm uppercase"
        />
        
        <button
          onClick={handleValidate}
          disabled={isValidating || !code.trim()}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('account.billing.coupon.apply')
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
