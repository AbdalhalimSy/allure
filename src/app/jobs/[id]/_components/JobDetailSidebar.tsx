import { MapPin, Building2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobDetailSidebarProps {
  jobCountries?: string[];
}

export function JobDetailSidebar({ jobCountries }: JobDetailSidebarProps) {
  const { t } = useI18n();

  const hasCountries = jobCountries && jobCountries.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Job Locations Card - Only show if countries exist */}
      {hasCountries && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/50 bg-white shadow-lg transition-all hover:shadow-2xl">
          <div className="h-1 bg-linear-to-r from-purple-500 via-violet-500 to-purple-500" />

          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-purple-400 to-violet-500 p-2 sm:p-3 shadow-lg">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("jobs.jobDetail.jobLocations")}
              </h3>
            </div>

            <div className="space-y-2">
              {jobCountries.map((country, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 p-2.5 sm:p-3 transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-linear-to-r from-purple-500 to-violet-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-200/50 bg-linear-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 shadow-lg">
        <div className="absolute top-0 end-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/30 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 p-2 sm:p-2.5 shadow-lg">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {t("jobs.jobDetail.applicationTips")}
            </h3>
          </div>

          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>{t("jobs.jobDetail.tipReviewRequirements")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>{t("jobs.jobDetail.tipUpdatePortfolio")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>{t("jobs.jobDetail.tipRespondPromptly")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
