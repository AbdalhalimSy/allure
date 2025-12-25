"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useEligibleRoles } from "@/hooks/useEligibleRoles";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function EligibleRolesPage() {
  const { t } = useI18n();
  const { isAuthenticated, activeProfileId } = useAuth();
  const { data: eligibleJobs, isLoading, error, refetch } = useEligibleRoles();
  const [sortBy, setSortBy] = useState<
    "best-match" | "shooting-date" | "expiration"
  >("best-match");

  // Sort jobs based on selected criteria and add roles_count
  const sortedJobs = eligibleJobs
    ? [...eligibleJobs]
        .map((job) => ({ ...job, roles_count: job.roles.length }))
        .sort((a, b) => {
          if (sortBy === "best-match") {
            // Sort by highest eligibility score in roles
            const aMaxScore = Math.max(
              ...a.roles.map((r) => r.eligibility_score),
              0
            );
            const bMaxScore = Math.max(
              ...b.roles.map((r) => r.eligibility_score),
              0
            );
            return bMaxScore - aMaxScore;
          } else if (sortBy === "shooting-date") {
            return (
              new Date(a.shooting_date).getTime() -
              new Date(b.shooting_date).getTime()
            );
          } else {
            // expiration
            return (
              new Date(a.expiration_date).getTime() -
              new Date(b.expiration_date).getTime()
            );
          }
        })
    : [];

  if (!isAuthenticated || !activeProfileId) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SurfaceCard className="p-12 text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-16 w-16 text-yellow-500" />
          </div>
 <h2 className="mb-4 text-2xl font-bold text-gray-900 ">
            {t("auth.loginRequired") || "Login Required"}
          </h2>
 <p className="mb-6 text-gray-600 ">
            {t("jobs.eligibleRoles.loginMessage") ||
              "Please login to see roles you're eligible for."}
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
          >
            {t("auth.login") || "Login"}
          </Link>
        </SurfaceCard>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-linear-to-b from-gray-50 to-white ">
      {/* Hero Section */}
 <div className="relative overflow-hidden bg-linear-to-br from-[#c49a47]/10 via-white to-[#d4af69]/10 ">
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#c49a47] to-[#d4af69] shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
 <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Your <span className="text-[#c49a47]">Perfect Matches</span>
          </h1>
 <p className="mx-auto max-w-2xl text-lg text-gray-600 ">
            Roles specially curated based on your profile. These opportunities
            match your age, gender, ethnicity, and other criteria.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Sort & Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#c49a47]" />
 <h2 className="text-xl font-semibold text-gray-900 ">
              {isLoading
                ? t("jobs.eligibleRoles.loading") || "Loading..."
                : `${sortedJobs.length} ${
                    t("jobs.eligibleRoles.matchesFound") || "Eligible Opportunities"
                  }`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
 <label className="text-sm font-medium text-gray-700 ">
              {t("jobs.eligibleRoles.sortBy") || "Sort by"}:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
 className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-[#c49a47] focus:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 "
            >
              <option value="best-match">
                {t("jobs.eligibleRoles.bestMatch") || "Best Match"}
              </option>
              <option value="shooting-date">
                {t("jobs.eligibleRoles.shootingDate") || "Shooting Date"}
              </option>
              <option value="expiration">
                {t("jobs.eligibleRoles.expiringSoon") || "Expiring Soon"}
              </option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <SurfaceCard className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
 <h3 className="mb-2 text-xl font-bold text-gray-900 ">
              {t("jobs.eligibleRoles.errors.loadFailed") || "Failed to Load"}
            </h3>
 <p className="mb-6 text-gray-600 ">
              {error instanceof Error
                ? error.message
                : t("jobs.eligibleRoles.errors.generic") || "Something went wrong"}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
            >
              {t("jobs.eligibleRoles.tryAgain") || "Try Again"}
            </button>
          </SurfaceCard>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedJobs.length === 0 && (
          <SurfaceCard className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Sparkles className="h-16 w-16 text-gray-400" />
            </div>
 <h3 className="mb-2 text-xl font-bold text-gray-900 ">
              {t("jobs.eligibleRoles.noMatches") || "No Eligible Roles Yet"}
            </h3>
 <p className="mb-6 text-gray-600 ">
              {t("jobs.eligibleRoles.noMatchesMessage") ||
                "We couldn't find any roles matching your profile at the moment. Check back soon or explore all available jobs."}
            </p>
            <Link
              href="/jobs"
              className="inline-block rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
            >
              {t("jobs.eligibleRoles.browseAllJobs") || "Browse All Jobs"}
            </Link>
          </SurfaceCard>
        )}

        {/* Job Cards Grid */}
        {!isLoading && !error && sortedJobs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
