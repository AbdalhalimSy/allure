"use client";

import Loader from "@/components/ui/Loader";
import TalentCardSkeleton from "@/components/talent/TalentCardSkeleton";

export default function LoadingTalents() {
  return (
    <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Loader className="h-4 w-4" />
          <span>Loading talents...</span>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <TalentCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
