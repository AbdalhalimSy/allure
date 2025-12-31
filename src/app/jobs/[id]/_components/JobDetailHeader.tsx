import OptimizedImage from "@/components/ui/OptimizedImage";
import { Clock, AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { DetailedJob } from "@/types/job";
import { calculateDaysUntilExpiry } from "../../_utils/dateHelpers";

interface JobDetailHeaderProps {
  job: DetailedJob;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const { t } = useI18n();
  const daysUntilExpiry = calculateDaysUntilExpiry(job.expiration_date);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="h-2 bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47]" />

      {job.image && (
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          <OptimizedImage
            src={job.image}
            alt={job.title}
            fill
            quality={70}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      )}

      <div className="p-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {job.title}
            </h1>
            {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                <Clock className="h-3 w-3" />
                {t("jobs.jobDetail.expiresIn")} {daysUntilExpiry}{" "}
                {t("jobs.jobDetail.days")}
              </span>
            )}
            {daysUntilExpiry <= 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-400 px-3 py-1 text-xs font-semibold text-white">
                <AlertCircle className="h-3 w-3" />
                {t("jobs.jobDetail.applicationClosed")}
              </span>
            )}
          </div>
          {job.open_to_apply ? (
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {t("jobs.jobDetail.openToApply")}
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
              {t("jobs.jobDetail.closed")}
            </span>
          )}
        </div>

        <p className="mb-6 text-lg text-gray-700">{job.description}</p>

        {job.highlights && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              {t("jobs.jobDetail.highlights")}
            </p>
            <p className="mt-1 text-sm text-blue-800">{job.highlights}</p>
          </div>
        )}

        {job.usage_terms && (
          <div className="mb-6 rounded-lg bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-900">
              {t("jobs.jobDetail.usageTerms")}
            </p>
            <p className="mt-1 text-sm text-purple-800">{job.usage_terms}</p>
          </div>
        )}
      </div>
    </div>
  );
}
