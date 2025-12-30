"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, CheckCircle, ArrowRight, Users } from "lucide-react";
import { Job } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface HorizontalJobCardProps {
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

export default function HorizontalJobCard({ job }: HorizontalJobCardProps) {
  const { t } = useI18n();

  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const alreadyApplied = Boolean(job.has_applied);

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section - Left */}
          <div className="relative h-40 w-full sm:h-auto sm:w-56 shrink-0 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
            <Image
              src={job.image || "/logo/logo-black.svg"}
              alt={job.title}
              fill
              className={`${
                job.image ? "object-cover" : "p-6 object-contain"
              } transition-transform duration-300 group-hover:scale-110`}
              onError={(e) => {
                if (e.currentTarget.src !== "/logo/logo-black.svg") {
                  e.currentTarget.src = "/logo/logo-black.svg";
                  e.currentTarget.className = "p-6 object-contain";
                } else {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E";
                }
              }}
            />

            {/* Status Badges - Top Left/Right */}
            <div className="absolute top-3 start-3 flex flex-col gap-2">
              {isExpiringSoon && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t("jobs.jobCard.expiringSoon")}</span>
                </div>
              )}
              {alreadyApplied && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{t("jobs.jobCard.alreadyApplied")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section - Right */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            {/* Top Content */}
            <div className="flex-1">
              {/* Title with Brand Color Accent */}
              <div className="mb-1 flex items-start gap-2">
                <div className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {job.title}
                </h3>
              </div>

              {/* Description */}
              <p className="mb-3 line-clamp-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {job.description}
              </p>

              {/* Meta Info - Horizontal with Icons */}
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                {job.roles_count && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Users className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {job.roles_count} {t("jobs.jobCard.roles")}
                    </span>
                  </div>
                )}

                {job.expiration_date && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Calendar className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-gray-700">
                      {formatDate(job.expiration_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA - Always Visible on Hover */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {t("jobs.jobCard.viewDetails")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform ltr:group-hover:translate-x-1 rtl:scale-x-[-1] rtl:group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
