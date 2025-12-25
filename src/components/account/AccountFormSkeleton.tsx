"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section Title and Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      {/* Grid of Fields (2 columns) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Field 1 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Field 2 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Field 3 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Field 4 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Field 5 - Checkbox */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>

        {/* Field 6 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="space-y-6">
        {/* Multi-select Field 1 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-80 rounded mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Multi-select Field 2 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-80 rounded mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Submit Button */}
 <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 ">
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
