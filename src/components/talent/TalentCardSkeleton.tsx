"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function TalentCardSkeleton() {
  return (
 <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200/50 bg-white/90 shadow ">
      <div className="relative w-full overflow-hidden">
        <Skeleton className="aspect-3/4 w-full" />
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
