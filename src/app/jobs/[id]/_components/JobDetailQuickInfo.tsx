import {
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { DetailedJob } from "@/types/job";
import { formatDate } from "../../_utils/dateHelpers";

interface JobDetailQuickInfoProps {
  job: DetailedJob;
  roleCount: number;
}

export function JobDetailQuickInfo({
  job,
  roleCount,
}: JobDetailQuickInfoProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6 sm:mb-8">
      {/* Shooting Dates Card */}
      <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 p-4 sm:p-5 border border-amber-100/50 transition-all hover:shadow-xl hover:scale-105">
        <div className="absolute top-0 end-0 w-16 h-16 sm:w-20 sm:h-20 bg-amber-200/20 rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-2 sm:gap-3">
          <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-amber-400 to-orange-500 p-2 sm:p-2.5 shadow-lg group-hover:scale-110 transition-transform shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-700 mb-1">
              {job.shooting_dates && job.shooting_dates.length > 1
                ? t("jobs.jobDetail.shootingDates")
                : t("jobs.jobDetail.shootingDate")}
            </p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
              {job.shooting_dates && job.shooting_dates.length > 0
                ? job.shooting_dates.length === 1
                  ? formatDate(job.shooting_dates[0].date)
                  : `${formatDate(job.shooting_dates[0].date)} +${
                      job.shooting_dates.length - 1
                    }`
                : t("jobs.jobDetail.tbd") || "TBD"}
            </p>
          </div>
        </div>
      </div>

      {/* Expiration Date Card */}
      <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-red-50 to-pink-50 p-4 sm:p-5 border border-red-100/50 transition-all hover:shadow-xl hover:scale-105">
        <div className="absolute top-0 end-0 w-16 h-16 sm:w-20 sm:h-20 bg-red-200/20 rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-2 sm:gap-3">
          <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-red-400 to-pink-500 p-2 sm:p-2.5 shadow-lg group-hover:scale-110 transition-transform shrink-0">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-red-700 mb-1">
              {t("jobs.jobDetail.expiresOn")}
            </p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
              {formatDate(job.expiration_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Open Roles Card */}
      <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 p-4 sm:p-5 border border-blue-100/50 transition-all hover:shadow-xl hover:scale-105">
        <div className="absolute top-0 end-0 w-16 h-16 sm:w-20 sm:h-20 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-2 sm:gap-3">
          <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-blue-400 to-cyan-500 p-2 sm:p-2.5 shadow-lg group-hover:scale-110 transition-transform shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-700 mb-1">
              {t("jobs.jobDetail.openRoles")}
            </p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
              {roleCount} {t("jobs.jobDetail.available")}
            </p>
          </div>
        </div>
      </div>

      {/* Multiple Applications Card */}
      <div
        className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-xl hover:scale-105 ${
          job.allow_multiple_role_applications
            ? "bg-linear-to-br from-emerald-50 to-green-50 border-emerald-100/50"
            : "bg-linear-to-br from-yellow-50 to-amber-50 border-yellow-100/50"
        }`}
      >
        <div
          className={`absolute top-0 end-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-2xl ${
            job.allow_multiple_role_applications
              ? "bg-emerald-200/20"
              : "bg-yellow-200/20"
          }`}
        ></div>
        <div className="relative flex items-start gap-2 sm:gap-3">
          <div
            className={`rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg group-hover:scale-110 transition-transform shrink-0 ${
              job.allow_multiple_role_applications
                ? "bg-linear-to-br from-emerald-400 to-green-500"
                : "bg-linear-to-br from-yellow-400 to-amber-500"
            }`}
          >
            {job.allow_multiple_role_applications ? (
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            ) : (
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-bold leading-relaxed ${
                job.allow_multiple_role_applications
                  ? "text-emerald-700"
                  : "text-yellow-700"
              }`}
            >
              {job.allow_multiple_role_applications
                ? t("jobs.jobDetail.multipleRolesAllowed") ||
                  "Multiple roles allowed"
                : t("jobs.jobDetail.singleRoleOnly") || "Single role only"}
            </p>
          </div>
        </div>
      </div>

      {/* Locations Card */}
      <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-purple-50 to-violet-50 p-4 sm:p-5 border border-purple-100/50 transition-all hover:shadow-xl hover:scale-105">
        <div className="absolute top-0 end-0 w-16 h-16 sm:w-20 sm:h-20 bg-purple-200/20 rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-2 sm:gap-3">
          <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-purple-400 to-violet-500 p-2 sm:p-2.5 shadow-lg group-hover:scale-110 transition-transform shrink-0">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-purple-700 mb-1">
              {t("jobs.jobDetail.locations")}
            </p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
              {job.job_countries?.length || 0} {t("jobs.jobDetail.countries")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
