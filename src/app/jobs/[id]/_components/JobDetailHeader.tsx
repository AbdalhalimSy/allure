import OptimizedImage from "@/components/ui/OptimizedImage";
import { Clock, AlertCircle, Sparkles, Info } from "lucide-react";
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
    <div className="mb-6 sm:mb-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/50 bg-white shadow-xl transition-all">
      {/* Hero Image with Gradient Overlay */}
      {job.image && (
        <div className="relative h-60 sm:h-80 w-full overflow-hidden bg-linear-to-br from-gray-900 to-gray-800">
          <OptimizedImage
            src={job.image}
            alt={job.title}
            fill
            quality={85}
            className="object-cover opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Status Badge on Image */}
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex gap-2">
            {job.open_to_apply ? (
              <div className="backdrop-blur-md bg-emerald-500/90 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 shadow-xl">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white rounded-full animate-pulse"></div>
                  {t("jobs.jobDetail.openToApply")}
                </span>
              </div>
            ) : (
              <div className="backdrop-blur-md bg-gray-700/90 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 shadow-xl">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {t("jobs.jobDetail.closed")}
                </span>
              </div>
            )}
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-red-500/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("jobs.jobDetail.expiresIn")} {daysUntilExpiry}{" "}
                  {t("jobs.jobDetail.days")}
                </span>
              )}
              {daysUntilExpiry <= 0 && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-600/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("jobs.jobDetail.applicationClosed")}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl mb-2">
              {job.title}
            </h1>
          </div>
        </div>
      )}

      {/* No Image Fallback */}
      {!job.image && (
        <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-linear-to-br from-[#c49a47] via-[#d4a855] to-[#c49a47]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center px-4 sm:px-8">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-red-600 shadow-lg">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("jobs.jobDetail.expiresIn")} {daysUntilExpiry}{" "}
                  {t("jobs.jobDetail.days")}
                </span>
              )}
              {job.open_to_apply ? (
                <div className="backdrop-blur-md bg-white/90 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 shadow-xl">
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1.5 sm:gap-2">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-600 rounded-full animate-pulse"></div>
                    {t("jobs.jobDetail.openToApply")}
                  </span>
                </div>
              ) : (
                <div className="backdrop-blur-md bg-white/90 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 shadow-xl">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {t("jobs.jobDetail.closed")}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl">
              {job.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">{job.description}</p>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {job.highlights && (
            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 border border-blue-100 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <p className="text-xs sm:text-sm font-bold text-blue-900">
                    {t("jobs.jobDetail.highlights")}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">{job.highlights}</p>
              </div>
            </div>
          )}

          {job.usage_terms && (
            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 p-4 sm:p-5 border border-purple-100 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-purple-200/30 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <p className="text-xs sm:text-sm font-bold text-purple-900">
                    {t("jobs.jobDetail.usageTerms")}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">{job.usage_terms}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
