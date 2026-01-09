'use client';

import { SubscriptionPackage } from '@/types/subscription';
import { Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface PackageCardProps {
  package: SubscriptionPackage;
  isSelected?: boolean;
  onSelect: (packageId: number) => void;
  discountedPrice?: number;
}

export function PackageCard({
  package: pkg,
  isSelected,
  onSelect,
  discountedPrice,
}: PackageCardProps) {
  const { t } = useI18n();
  const hasDiscount = discountedPrice !== undefined && discountedPrice < pkg.price;

  const featureLines = pkg.description
    .split(/\n+/)
    .map(f => f.trim())
    .filter(Boolean);

  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`group relative cursor-pointer rounded-2xl p-0.5 transition-all duration-300 ${
        isSelected
          ? 'bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#e6c678] shadow-xl'
          : 'bg-linear-to-r from-gray-200 via-gray-100 to-gray-50 hover:from-[#c49a47]/40 hover:via-[#d4a855]/40 hover:to-[#e6c678]/40'
      }`}
    >
      <div
        className={`rounded-2xl h-full w-full p-6 transition-colors duration-300 ${
          isSelected
 ? 'bg-white '
 : 'bg-white '
        }`}
      >
        {isSelected && (
          <div className="absolute -end-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#c49a47] text-white shadow-lg shadow-[#c49a47]/40">
            <Check className="h-5 w-5" />
          </div>
        )}

        <div className="mb-5">
 <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 ">
            {pkg.title || pkg.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-[#c49a47]/30 bg-[#c49a47]/10 px-3 py-1 text-xs font-semibold text-[#c49a47]">
              {pkg.duration_in_days} Days
            </span>
          </div>
        </div>

        <div className="mb-6">
          {hasDiscount ? (
            <div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[#c49a47]">
                  {discountedPrice?.toFixed(2)}
                </span>
                <span className="mb-1 text-sm font-medium text-gray-500">{t('units.aed')}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">
                  {pkg.price.toFixed(2)} {t('units.aed')}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                  Save {(((pkg.price - (discountedPrice ?? 0)) / pkg.price) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2">
 <span className="text-4xl font-bold text-gray-900 ">
                {pkg.price.toFixed(2)}
              </span>
              <span className="mb-1 text-sm font-medium text-gray-500">{t('units.aed')}</span>
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {featureLines.map((feat, idx) => (
 <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 ">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c49a47]" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
