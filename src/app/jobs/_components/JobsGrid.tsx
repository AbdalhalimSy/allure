import JobCard from "@/components/jobs/cards/JobCard";
import Loader from "@/components/ui/Loader";
import { useI18n } from "@/contexts/I18nContext";
import { Job } from "@/types/job";

interface JobsGridProps {
  jobs: Job[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  loadingMore: boolean;
  hasMore: boolean;
  observerTargetRef: React.RefObject<HTMLDivElement | null>;
}

export function JobsGrid({
  jobs,
  meta,
  loadingMore,
  hasMore,
  observerTargetRef,
}: JobsGridProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {meta.total}{" "}
            {meta.total === 1
              ? t("jobs.jobs.jobSingular")
              : t("jobs.jobs.jobPlural")}{" "}
            {t("jobs.jobs.found")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("jobs.jobs.showing")} {jobs.length} {t("jobs.jobs.of")}{" "}
            {meta.total}
          </p>
        </div>
        {loadingMore && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader className="h-4 w-4" />
            <span>{t("jobs.jobs.updating")}</span>
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
            <span className="text-gray-600">{t("jobs.jobs.loading")}</span>
          </div>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && jobs.length > 0 && (
        <div className="mt-12 py-8 text-center">
          <p className="text-gray-600">{t("jobs.jobs.noMoreJobs")}</p>
        </div>
      )}
    </>
  );
}
