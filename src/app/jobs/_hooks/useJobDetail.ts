import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { DetailedJob, JobDetailResponse } from "@/types/job";

export function useJobDetail(jobId: string | string[]) {
  const { activeProfileId } = useAuth();
  const { t } = useI18n();
  const [job, setJob] = useState<DetailedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const hasProfile = Boolean(activeProfileId);
      const token = localStorage.getItem("auth_token") || "";
      const headers: Record<string, string> = {};

      if (hasProfile && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = hasProfile
        ? `/api/jobs/${jobId}?profile_id=${activeProfileId}`
        : `/api/public/jobs/${jobId}`;

      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || data.message || t("jobs.jobDetail.errors.fetchFailed")
        );
      }

      const result: JobDetailResponse = await response.json();

      if (result.status === "success" || result.status === true) {
        setJob(result.data);
      } else {
        throw new Error(
          result.message || t("jobs.jobDetail.errors.loadFailed")
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("jobs.jobDetail.errors.generic")
      );
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, jobId, t]);

  return {
    job,
    loading,
    error,
    fetchJob,
  };
}
