'use client';

import { SubscriptionPackage } from '@/types/subscription';
import { Check } from 'lucide-react';

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
  const hasDiscount = discountedPrice !== undefined && discountedPrice < pkg.price;

  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-gray-200 hover:border-primary/50'
      }`}
    >
      {isSelected && (
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-5 w-5" />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
      </div>

      <div className="mb-4">
        {hasDiscount ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {discountedPrice?.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500">AED</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg text-gray-400 line-through">
                {pkg.price.toFixed(2)} AED
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                Save {((pkg.price - discountedPrice) / pkg.price * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {pkg.price.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500">AED</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center text-sm text-gray-600">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>{pkg.duration_in_days} days of access</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>Full platform features</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>Priority support</span>
        </div>
      </div>
    </div>
  );
}
