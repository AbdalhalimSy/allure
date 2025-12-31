"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Job } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface JobCardProps {
  job: Job;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function JobCard({ job }: JobCardProps) {
  const { t } = useI18n();
  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const alreadyApplied = Boolean(job.has_applied);

  // Format shooting dates - show first date or "TBD" if empty
  const shootingDatesDisplay = () => {
    if (!job.shooting_dates || job.shooting_dates.length === 0) {
      return t("jobs.jobCard.tbd") || "TBD";
    }
    const firstDate = formatDate(job.shooting_dates[0].date);
    if (job.shooting_dates.length > 1) {
      return `${firstDate} +${job.shooting_dates.length - 1} ${t("jobs.jobCard.more") || "more"}`;
    }
    return firstDate;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 ">
      {/* Job Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 ">
        <Image
          src={job.image || "/logo/logo-black.svg"}
          alt={job.title}
          fill
          className={`${job.image ? "object-cover" : "p-4 object-contain"}`}
          onError={(e) => {
            if (e.currentTarget.src !== "/logo/logo-black.svg") {
              e.currentTarget.src = "/logo/logo-black.svg";
              e.currentTarget.className = "p-4 object-contain";
            } else {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E';
            }
          }}
        />
      </div>

      {/* Status Badge */}
      {isExpiringSoon && (
        <div className="absolute end-4 top-6 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <Clock className="h-3 w-3" />
          {t("jobs.jobCard.expiringSoon")}
        </div>
      )}

      {alreadyApplied && (
        <div className="absolute start-4 top-6 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <CheckCircle className="h-3 w-3" />
          {t("jobs.jobCard.alreadyApplied") || "Already Applied"}
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-gray-900 ">{job.title}</h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 ">
          {job.description}
        </p>

        {/* Meta Info Grid */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700 ">
            <Calendar className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">{t("jobs.jobCard.shooting")}</span>
            <span>{shootingDatesDisplay()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 ">
            <Clock className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">{t("jobs.jobCard.expires")}</span>
            <span>{formatDate(job.expiration_date)}</span>
          </div>

          {job.countries && job.countries.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-700 ">
              <MapPin className="h-4 w-4 shrink-0 text-[#c49a47]" />
              <span className="line-clamp-1">
                {job.countries.slice(0, 2).join(", ")}
                {job.countries.length > 2 && ` +${job.countries.length - 2}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-700 ">
            <Users className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">
              {job.roles_count} {t("jobs.jobCard.rolesAvailable")}
            </span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#c49a47]" />
              <span className="text-xs font-semibold text-gray-700 ">
                {t("jobs.jobCard.requiredSkills")}
              </span>
            </div>
            <p className="line-clamp-2 text-xs text-gray-600 ">{job.skills}</p>
          </div>
        )}

        {/* Professions Tags - Aggregated from roles */}
        {(() => {
          const allProfessions = [...new Set(
            job.roles?.flatMap(role => role.professions || []) || []
          )];
          return allProfessions.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {allProfessions.slice(0, 3).map((profession) => (
                <span
                  key={profession}
                  className="rounded-lg bg-[#c49a47]/10 px-3 py-1 text-xs font-medium text-[#c49a47] "
                >
                  {profession}
                </span>
              ))}
              {allProfessions.length > 3 && (
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 ">
                  +{allProfessions.length - 3}
                </span>
              )}
            </div>
          );
        })()}

        {/* View Details Button */}
        <Link
          href={`/jobs/${job.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#c49a47] to-[#d4a855] px-6 py-3 font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all hover:shadow-xl hover:shadow-[#c49a47]/40 group-hover:gap-3"
        >
          {t("jobs.jobCard.viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:scale-x-[-1]" />
        </Link>
      </div>
    </div>
  );
}
