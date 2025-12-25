"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import type { Job } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface JobsSectionProps {
  jobs: Job[];
  loading: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  viewAll: string;
  loadingText: string;
  emptyText: string;
}

export default function JobsSection({
  jobs,
  loading,
  kicker,
  title,
  subtitle,
  viewAll,
  loadingText,
  emptyText,
}: JobsSectionProps) {
  const { locale } = useI18n();
  const isRTL = locale === "ar";

  return (
    <section className="px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
 <p className="text-sm uppercase tracking-[0.3em] text-primary ">
              {kicker}
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {title}
            </h2>
 <p className="text-gray-700 ">{subtitle}</p>
          </div>
          <Link
            href="/jobs"
 className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary "
          >
            {viewAll}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "scale-x-[-1]" : ""}`} />
          </Link>
        </div>

        {/* Jobs grid */}
        <div className="mt-8">
          {loading && (
 <div className="flex items-center justify-center rounded-3xl border border-gray-200 p-8 text-sm text-gray-600 ">
              {loadingText}
            </div>
          )}

          {!loading && jobs.length === 0 && (
 <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600 ">
              {emptyText}
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
