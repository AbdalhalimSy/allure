import { MapPin, Building2, Globe } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobDetailSidebarProps {
  jobCountries?: string[];
}

export function JobDetailSidebar({ jobCountries }: JobDetailSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Job Locations Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white shadow-lg transition-all hover:shadow-2xl">
        <div className="h-1 bg-linear-to-r from-purple-500 via-violet-500 to-purple-500" />

        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-purple-400 to-violet-500 p-3 shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("jobs.jobDetail.jobLocations")}
            </h3>
          </div>

          <div className="space-y-2">
            {jobCountries?.map((country, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-xl bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 p-3 transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <div className="shrink-0 w-2 h-2 rounded-full bg-linear-to-r from-purple-500 to-violet-500" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {country}
                </span>
              </div>
            )) || (
              <div className="text-center py-8">
                <Globe className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {t("jobs.jobDetail.noLocations")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips Card */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-linear-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 p-2.5 shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Application Tips
            </h3>
          </div>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>Review all role requirements carefully</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>Update your portfolio before applying</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold mt-0.5">✓</span>
              <span>Respond promptly to any communications</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
