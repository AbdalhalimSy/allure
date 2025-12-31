import { MapPin } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobDetailSidebarProps {
  jobCountries?: string[];
}

export function JobDetailSidebar({ jobCountries }: JobDetailSidebarProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#c49a47]" />
          <h3 className="text-lg font-bold text-gray-900">
            {t("jobs.jobDetail.jobLocations")}
          </h3>
        </div>
        <ul className="space-y-2">
          {jobCountries?.map((country, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="h-1.5 w-1.5 rounded-full bg-[#c49a47]" />
              {country}
            </li>
          )) || (
            <li className="text-sm text-gray-500">
              {t("jobs.jobDetail.noLocations")}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
