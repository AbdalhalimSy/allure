import SurfaceCard from "@/components/ui/SurfaceCard";
import { Briefcase } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobsEmptyStateProps {
  onReset: () => void;
}

export function JobsEmptyState({ onReset }: JobsEmptyStateProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <SurfaceCard className="max-w-md p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
            <Briefcase className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-gray-900">
          {t("jobs.jobs.noJobsFound")}
        </h3>
        <p className="mb-8 text-gray-600">{t("jobs.jobs.noJobsHint")}</p>
        <button
          onClick={onReset}
          className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          {t("jobs.jobs.clearFilters")}
        </button>
      </SurfaceCard>
    </div>
  );
}
