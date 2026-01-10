"use client";

import { useEffect, useMemo } from "react";
import { AlertCircle, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";
import Loader from "@/components/ui/Loader";
import JobApplicationModal from "./JobApplicationModal";
import { useJobDetail } from "@/app/jobs/_hooks/useJobDetail";
import { useJobApply } from "@/app/jobs/_hooks/useJobApply";
import { JobDetailContent } from "@/app/jobs/[id]/_components/JobDetailContent";

interface JobDetailModalProps {
  jobId: number | string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ jobId, isOpen, onClose }: JobDetailModalProps) {
  const { t } = useI18n();
  const { activeProfileId, isAuthenticated } = useAuth();
  const normalizedJobId = useMemo(() => (jobId !== null ? String(jobId) : null), [jobId]);
  const { job, loading, error, fetchJob } = useJobDetail(normalizedJobId || "");
  const { selectedRole, isApplicationOpen, handleApply, closeApplicationModal } =
    useJobApply(job);

  // Refetch when language changes
  useLanguageSwitch(() => {
    if (isOpen && normalizedJobId) {
      fetchJob();
    }
  });

  useEffect(() => {
    if (isOpen && normalizedJobId) {
      fetchJob();
    }
  }, [isOpen, normalizedJobId, fetchJob]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      closeApplicationModal();
    }
  }, [isOpen, closeApplicationModal]);

  if (!isOpen || !normalizedJobId) return null;

  const handleClose = () => {
    closeApplicationModal();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 end-0 z-20 p-2 sm:p-4">
          <button
            onClick={handleClose}
            className="rounded-full bg-white/90 p-2 sm:p-3 backdrop-blur-sm transition-all hover:bg-white shadow-lg hover:shadow-xl"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
          </button>
        </div>

        <div className="max-h-[95vh] overflow-y-auto pb-4">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : error || !job ? (
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-6 sm:p-12 text-center">
                <AlertCircle className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-red-900">
                  {t("jobs.jobDetail.failedToLoad")}
                </h3>
                <p className="mb-4 text-sm text-red-700">{error}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={fetchJob}
                    className="rounded-lg bg-red-600 px-5 py-2 sm:px-6 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    {t("jobs.jobDetail.tryAgain") || "Try again"}
                  </button>
                  <button
                    onClick={handleClose}
                    className="rounded-lg border border-gray-300 px-5 py-2 sm:px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    {t("jobs.jobDetail.backToJobs")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <JobDetailContent
                job={job}
                onBack={handleClose}
                onApply={handleApply}
                isAuthenticated={isAuthenticated}
                activeProfileId={activeProfileId}
                variant="modal"
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
          )}
        </div>
      </div>
    </div>
  );
}
