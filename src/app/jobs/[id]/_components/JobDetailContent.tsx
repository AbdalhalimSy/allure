"use client";

import { DetailedJob, DetailedRole } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";
import { JobDetailBackButton } from "./JobDetailBackButton";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobDetailQuickInfo } from "./JobDetailQuickInfo";
import { JobDetailSidebar } from "./JobDetailSidebar";
import { JobRoleCard } from "./JobRoleCard";

type Variant = "page" | "modal";

interface JobDetailContentProps {
  job: DetailedJob;
  onBack: () => void;
  onApply: (role: DetailedRole) => void;
  isAuthenticated: boolean;
  activeProfileId: number | null;
  variant?: Variant;
}

export function JobDetailContent({
  job,
  onBack,
  onApply,
  isAuthenticated,
  activeProfileId,
  variant = "page",
}: JobDetailContentProps) {
  const { t } = useI18n();
  const roles = Array.isArray(job.roles) ? job.roles : [];
  const roleCount = roles.length;

  const outerClassName =
    variant === "modal"
      ? "bg-white"
      : "min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50";

  const innerClassName =
    variant === "modal"
      ? "px-4 py-4 sm:px-6 sm:py-6"
      : "mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8";

  const sidebarOffset = variant === "modal" ? "lg:top-4" : "lg:top-24";

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        <JobDetailBackButton onClick={onBack} />
        <JobDetailHeader job={job} />
        <JobDetailQuickInfo job={job} roleCount={roleCount} />

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t("jobs.jobDetail.availableRoles")} ({roleCount})
                </h2>
              </div>

              {roles.map((role) => (
                <JobRoleCard
                  key={role.id}
                  role={role}
                  job={job}
                  onApply={() => onApply(role)}
                  isAuthenticated={isAuthenticated}
                  activeProfileId={activeProfileId}
                />
              ))}
            </div>
          </div>

          <div className={`lg:sticky lg:self-start ${sidebarOffset}`}>
            <JobDetailSidebar jobCountries={job.job_countries} />
          </div>
        </div>
      </div>
    </div>
  );
}
