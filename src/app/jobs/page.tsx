"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import JobCard from "@/components/jobs/JobCard";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import Loader from "@/components/ui/Loader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import Switch from "@/components/ui/Switch";
import {
  Job,
  JobFilters,
  JobsResponse,
  EligibleRolesResponse,
} from "@/types/job";
import { Briefcase, AlertCircle, Sparkles } from "lucide-react";

export default function JobsPage() {
  const pathname = usePathname();
  const { activeProfileId, isAuthenticated } = useAuth();
  const { locale, t } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [switching, setSwitching] = useState(false); // New state for toggle switch
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const requestIdRef = useRef(0); // Track latest request to avoid stale loading toggles
  const abortRef = useRef<AbortController | null>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const fetchJobs = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      const requestId = ++requestIdRef.current;
      if (!activeProfileId) {
        setError(t("jobs.errors.profileNotLoaded"));
        if (reset) setLoading(false);
        return;
      }

      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        if (page === 1) setError(null);

        const token = localStorage.getItem("auth_token") || "";

        // If showEligibleOnly is true, fetch from eligible-roles endpoint
        if (showEligibleOnly) {
          const response = await fetch(
            `/api/profile/${activeProfileId}/eligible-roles`,
            {
              signal: abortRef.current.signal,
              headers: {
                Authorization: `Bearer ${token}`,
                "Accept-Language": locale,
              },
            }
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || t("jobs.errors.fetchFailed"));
          }

          const result: EligibleRolesResponse = await response.json();
          if (result.success) {
            // Eligible roles endpoint returns all data at once (no pagination)
            // Convert EligibleJob to Job format by adding required fields
            const jobsData = result.data.map((job) => ({
              ...job,
              roles_count: job.roles.length,
              open_to_apply: true,
            })) as Job[];

            setJobs(jobsData);
            setMeta({
              current_page: 1,
              per_page: jobsData.length,
              total: jobsData.length,
              last_page: 1,
            });
            setHasMore(false); // No pagination for eligible roles
          } else {
            throw new Error(result.message || t("jobs.errors.loadFailed"));
          }
        } else {
          // Fetch regular jobs with pagination
          const params = new URLSearchParams();
          params.append("profile_id", String(activeProfileId));

          // Add filter parameters
          Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            if (Array.isArray(value)) {
              if (value.length) params.append(key, value.join(","));
            } else if (key === "eligible" && typeof value === "boolean") {
              params.append(key, value ? "1" : "0");
            } else {
              params.append(key, String(value));
            }
          });

          params.append("page", String(page));
          params.append("per_page", String(meta.per_page));

          const response = await fetch(`/api/jobs?${params.toString()}`, {
            signal: abortRef.current.signal,
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": locale,
            },
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(
              data.error || data.message || t("jobs.errors.fetchFailed")
            );
          }

          const result: JobsResponse = await response.json();
          if (result.status === "success" || result.status === true) {
            if (reset) {
              setJobs(result.data);
              setMeta(
                result.meta || {
                  current_page: 1,
                  per_page: 12,
                  total: 0,
                  last_page: 1,
                }
              );
              setHasMore(
                (result.meta?.current_page || 1) < (result.meta?.last_page || 1)
              );
            } else {
              setJobs((prev) => [...prev, ...result.data]);
              setMeta(
                result.meta || {
                  current_page: page,
                  per_page: 12,
                  total: 0,
                  last_page: 1,
                }
              );
              setHasMore(
                (result.meta?.current_page || page) <
                  (result.meta?.last_page || 1)
              );
            }
          } else {
            throw new Error(result.message || t("jobs.errors.loadFailed"));
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (reset) {
          setError(
            err instanceof Error ? err.message : t("jobs.errors.generic")
          );
        }
        console.error("Error fetching jobs:", err);
      } finally {
        // Only clear loading states for the latest request so aborted/stale calls don't hide the skeleton
        if (requestIdRef.current === requestId) {
          setLoading(false);
          setLoadingMore(false);
          setSwitching(false);
        }
      }
    },
    [activeProfileId, filters, locale, meta.per_page, t, showEligibleOnly]
  );

  // Reset jobs and show loading when pathname changes (navigation)
  useEffect(() => {
    setJobs([]);
    setLoading(true);
    setHasMore(true);
    setMeta({ current_page: 1, per_page: 12, total: 0, last_page: 1 });
  }, [pathname]);

  // Fetch jobs when filters, profile, or eligible toggle changes (first page)
  useEffect(() => {
    if (activeProfileId) {
      // Show switching animation when toggle changes
      setSwitching(true);
      fetchJobs(1, true);
    }
  }, [filters, activeProfileId, locale, showEligibleOnly, fetchJobs]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingMore &&
          !loading &&
          jobs.length > 0
        ) {
          fetchJobs(meta.current_page + 1, false);
        }
      },
      { rootMargin: "200px" }
    );

    const currentRef = observerTargetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    hasMore,
    loadingMore,
    loading,
    fetchJobs,
    meta.current_page,
    jobs.length,
  ]);

  const handleFilterChange = (next: JobFilters) => {
    setFilters(next);
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#c49a47] to-[#d4af69] shadow-xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Explore <span className="text-[#c49a47]">Casting Calls</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Discover active opportunities and roles. Filter by profession,
            location, dates and appearance to pinpoint the perfect casting.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Toggle Switch for Eligible Roles - Only show when authenticated */}
        {isAuthenticated && activeProfileId && (
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("jobs.allJobs") || "All Jobs"}
                </span>
              </div>
              <Switch
                checked={showEligibleOnly}
                onChange={setShowEligibleOnly}
                disabled={loading || switching}
              />
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#c49a47]" />
                <span className="text-sm font-medium text-[#c49a47]">
                  {t("jobs.eligibleOnly") || "Eligible for Me"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 mb-12">
          <JobFilterBar
            value={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            loadingResults={loading || switching}
          />
        </div>

        {/* Loading State - Show when switching or initial load */}
        {switching || (loading && jobs.length === 0) ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader className="h-4 w-4" />
                <span>{t("jobs.loading")}</span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t("jobs.failedToLoad")}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => fetchJobs(1, true)}
                className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {t("jobs.tryAgain")}
              </button>
            </SurfaceCard>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <Briefcase className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                {t("jobs.noJobsFound")}
              </h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {t("jobs.noJobsHint")}
              </p>
              <button
                onClick={handleReset}
                className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {t("jobs.clearFilters")}
              </button>
            </SurfaceCard>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {meta.total}{" "}
                  {meta.total === 1
                    ? t("jobs.jobSingular")
                    : t("jobs.jobPlural")}{" "}
                  {t("jobs.found")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("jobs.showing")} {jobs.length} {t("jobs.of")} {meta.total}
                </p>
              </div>
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader className="h-4 w-4" />
                  <span>{t("jobs.updating")}</span>
                </div>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Infinite scroll trigger point */}
            {hasMore && (
              <div
                ref={observerTargetRef}
                className="mt-12 flex justify-center py-8"
              >
                <div className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin text-[#c49a47]" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("jobs.loading")}
                  </span>
                </div>
              </div>
            )}

            {/* End of results message */}
            {!hasMore && jobs.length > 0 && (
              <div className="mt-12 py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t("jobs.noMoreJobs")}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
