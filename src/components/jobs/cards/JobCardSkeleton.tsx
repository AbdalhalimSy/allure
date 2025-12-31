"use client";

import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";

export default function JobCardSkeleton() {
  return (
 <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg ">
 <div className="h-2 w-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 " />
      <div className="p-6 space-y-4">
        <SkeletonLine width="w-3/4" className="h-5" />
        <div className="space-y-2">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-5/6" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <SkeletonLine width="w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <SkeletonLine width="w-44" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <SkeletonLine width="w-32" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
