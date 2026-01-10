import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCountryFilter } from "@/contexts/CountryFilterContext";
import apiClient from "@/lib/api/client";
import {
  Job,
  JobFilters,
  JobsResponse,
  EligibleRolesResponse,
} from "@/types/job";

export function useJobs(showEligibleOnly: boolean) {
  const { activeProfileId, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { getCountryId } = useCountryFilter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const perPageRef = useRef(12);

  const fetchJobs = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      const requestId = ++requestIdRef.current;
      const usePublic = !isAuthenticated || !activeProfileId;

      try {
        // Only abort previous requests, don't abort the current one yet
        const previousAbortController = abortRef.current;
        abortRef.current = new AbortController();
        
        // Abort the previous request
        if (previousAbortController) {
          previousAbortController.abort();
        }

        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        if (page === 1) setError(null);

        // If showEligibleOnly is true, fetch from eligible-roles endpoint
        if (showEligibleOnly) {
          if (usePublic) {
            setError(
              t("jobs.jobs.errors.authRequired") ||
                "Login to view eligible roles"
            );
            if (reset) {
              setLoading(false);
            }
            setLoadingMore(false);
            return;
          }

          const response = await apiClient.get(
            `/profile/${activeProfileId}/eligible-roles`,
            {
              signal: abortRef.current.signal,
            }
          );

          const result: EligibleRolesResponse = response.data;
          if (result.success) {
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
            setHasMore(false);
          } else {
            throw new Error(result.message || t("jobs.jobs.errors.loadFailed"));
          }
        } else {
          // Fetch regular jobs with pagination
          const params = new URLSearchParams();
          if (!usePublic && activeProfileId) {
            params.append("profile_id", String(activeProfileId));
          }

          const countryId = getCountryId();
          if (countryId !== null) {
            params.append("country_ids", String(countryId));
          }

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
          params.append("per_page", String(perPageRef.current));

          const response = await apiClient.get(
            usePublic ? "/public/jobs" : "/jobs",
            {
              signal: abortRef.current.signal,
              params,
            }
          );

          const result: JobsResponse = response.data;
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
            throw new Error(result.message || t("jobs.jobs.errors.loadFailed"));
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (reset) {
          setError(
            err instanceof Error ? err.message : t("jobs.jobs.errors.generic")
          );
        }
        console.error("Error fetching jobs:", err);
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [
      activeProfileId,
      filters,
      t,
      showEligibleOnly,
      isAuthenticated,
      getCountryId,
    ]
  );

  return {
    jobs,
    loading,
    loadingMore,
    error,
    filters,
    setFilters,
    meta,
    hasMore,
    fetchJobs,
    setJobs,
    setLoading,
    setHasMore,
    setMeta,
  };
}
