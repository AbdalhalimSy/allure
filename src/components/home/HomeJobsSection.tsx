"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HorizontalJobCard from "@/components/home/HorizontalJobCard";
import type { Job } from "@/types/job";

interface HomeJobsSectionProps {
  jobs: Job[];
  loading: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  viewAll: string;
  loadingText: string;
  emptyText: string;
}

export default function HomeJobsSection({
  jobs,
  loading,
  kicker,
  title,
  subtitle,
  viewAll,
  loadingText,
  emptyText,
}: HomeJobsSectionProps) {
  return (
    <section className="px-6 py-20 lg:px-12 bg-linear-to-b from-white via-white to-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="flex-1 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              {kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-lg">
              {subtitle}
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary "
          >
            {viewAll}
            <ArrowRight className="h-5 w-5 transition-transform rtl:scale-x-[-1]" />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="mt-8">
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 p-16 text-center">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin mb-4"></div>
              <p className="text-sm text-gray-600">{loadingText}</p>
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 p-16 text-center">
              <div className="mb-4 text-4xl text-gray-300">📭</div>
              <p className="text-sm text-gray-600 font-medium">{emptyText}</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 auto-rows-max">
              {jobs.map((job) => (
                <HorizontalJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
