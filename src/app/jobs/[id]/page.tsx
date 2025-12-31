"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import JobApplicationModal from "@/components/jobs/modals/JobApplicationModal";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { DetailedRole } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";
import { useJobDetail } from "../_hooks/useJobDetail";
import { JobDetailBackButton } from "./_components/JobDetailBackButton";
import { JobDetailHeader } from "./_components/JobDetailHeader";
import { JobDetailQuickInfo } from "./_components/JobDetailQuickInfo";
import { JobDetailSidebar } from "./_components/JobDetailSidebar";
import { JobRoleCard } from "./_components/JobRoleCard";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeProfileId, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [selectedRole, setSelectedRole] = useState<DetailedRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { job, loading, error, fetchJob } = useJobDetail(params.id as string);

  useEffect(() => {
    fetchJob();
  }, [params.id, activeProfileId, fetchJob]);

  const handleApply = (role: DetailedRole) => {
    const alreadyApplied = role.has_applied || job?.has_applied;

    if (alreadyApplied) {
      toast.error(
        t("jobs.jobDetail.alreadyApplied") || "You already applied for this role"
      );
      return;
    }

    if (!isAuthenticated || !activeProfileId) {
      toast.error(t("jobs.jobDetail.loginToApply") || "Please log in to apply");
      router.push("/login");
      return;
    }

    if (role.can_apply !== false) {
      setSelectedRole(role);
      setIsModalOpen(true);
    } else {
      toast.error(
        t("jobs.jobDetail.notEligibleToApply") ||
          "You don't meet the requirements for this role"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-900">
            {t("jobs.jobDetail.failedToLoad")}
          </h3>
          <p className="mb-4 text-sm text-red-700">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("jobs.jobDetail.backToJobs")}
          </button>
        </div>
      </div>
    );
  }

  const roles = Array.isArray(job.roles) ? job.roles : [];
  const roleCount = roles.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <JobDetailBackButton onClick={() => router.push("/jobs")} />
        <JobDetailHeader job={job} />
        <JobDetailQuickInfo job={job} roleCount={roleCount} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t("jobs.jobDetail.availableRoles")} ({roleCount})
                </h2>
              </div>

              {roles.map((role) => (
                <JobRoleCard
                  key={role.id}
                  role={role}
                  job={job}
                  onApply={() => handleApply(role)}
                  isAuthenticated={isAuthenticated}
                  activeProfileId={activeProfileId}
                />
              ))}
            </div>
          </div>

          <div className="sticky top-24 self-start">
            <JobDetailSidebar jobCountries={job.job_countries} />
          </div>
        </div>
      </div>

      {selectedRole && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRole(null);
          }}
          jobId={job.id}
          role={selectedRole}
          profileId={activeProfileId || undefined}
        />
      )}
    </div>
  );
}
