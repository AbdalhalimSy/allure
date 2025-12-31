import { Calendar, Clock, Users, MapPin, AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { DetailedJob } from "@/types/job";
import { formatDate } from "../../_utils/dateHelpers";

interface JobDetailQuickInfoProps {
  job: DetailedJob;
  roleCount: number;
}

export function JobDetailQuickInfo({ job, roleCount }: JobDetailQuickInfoProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
        <Calendar className="h-5 w-5 text-[#c49a47]" />
        <div>
          <p className="text-xs text-gray-600">
            {job.shooting_dates && job.shooting_dates.length > 1
              ? t("jobs.jobDetail.shootingDates")
              : t("jobs.jobDetail.shootingDate")}
          </p>
          <p className="font-semibold text-gray-900">
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

      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
        <Clock className="h-5 w-5 text-[#c49a47]" />
        <div>
          <p className="text-xs text-gray-600">
            {t("jobs.jobDetail.expiresOn")}
          </p>
          <p className="font-semibold text-gray-900">
            {formatDate(job.expiration_date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
        <Users className="h-5 w-5 text-[#c49a47]" />
        <div>
          <p className="text-xs text-gray-600">
            {t("jobs.jobDetail.openRoles")}
          </p>
          <p className="font-semibold text-gray-900">
            {roleCount} {t("jobs.jobDetail.available")}
          </p>
        </div>
      </div>

      <div
        className={`flex items-center gap-3 rounded-lg p-4 ${
          job.allow_multiple_role_applications
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <AlertCircle
          className={`h-5 w-5 ${
            job.allow_multiple_role_applications
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        />
        <div>
          <p
            className={`text-xs font-semibold ${
              job.allow_multiple_role_applications
                ? "text-green-700"
                : "text-yellow-700"
            }`}
          >
            {job.allow_multiple_role_applications
              ? t("jobs.jobDetail.multipleRolesAllowed") ||
                "✓ You can apply to multiple roles"
              : t("jobs.jobDetail.singleRoleOnly") ||
                "⚠️ You can only apply to ONE role in this job"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
        <MapPin className="h-5 w-5 text-[#c49a47]" />
        <div>
          <p className="text-xs text-gray-600">
            {t("jobs.jobDetail.locations")}
          </p>
          <p className="font-semibold text-gray-900">
            {job.job_countries?.length || 0} {t("jobs.jobDetail.countries")}
          </p>
        </div>
      </div>
    </div>
  );
}
