"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import JobApplicationModal from "@/components/jobs/modals/JobApplicationModal";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useJobDetail } from "../_hooks/useJobDetail";
import { useJobApply } from "../_hooks/useJobApply";
import { JobDetailContent } from "./_components/JobDetailContent";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeProfileId, isAuthenticated } = useAuth();
  const { t } = useI18n();

  const { job, loading, error, fetchJob } = useJobDetail(params.id as string);
  const { selectedRole, isApplicationOpen, handleApply, closeApplicationModal } =
    useJobApply(job);

  useEffect(() => {
    fetchJob();
  }, [params.id, activeProfileId, fetchJob]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-6 sm:p-12 text-center">
          <AlertCircle className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
          <h3 className="mb-2 text-base sm:text-lg font-semibold text-red-900">
            {t("jobs.jobDetail.failedToLoad")}
          </h3>
          <p className="mb-4 text-sm text-red-700">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-lg bg-red-600 px-5 py-2 sm:px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("jobs.jobDetail.backToJobs")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <JobDetailContent
        job={job}
        onBack={() => router.push("/jobs")}
        onApply={handleApply}
        isAuthenticated={isAuthenticated}
        activeProfileId={activeProfileId}
        variant="page"
      />

      {selectedRole && (
        <JobApplicationModal
          isOpen={isApplicationOpen}
          onClose={closeApplicationModal}
          jobId={job.id}
          role={selectedRole}
          profileId={activeProfileId || undefined}
        />
      )}
    </>
  );
}
