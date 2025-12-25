"use client";

import Loader from "@/components/ui/Loader";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";

export default function LoadingJobs() {
  return (
    <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
 <div className="h-6 w-40 animate-pulse rounded bg-gray-200 " />
 <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200 " />
        </div>
 <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <Loader className="h-4 w-4" />
          <span>Loading jobs...</span>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
