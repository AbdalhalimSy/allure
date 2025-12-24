"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import JobApplicationModal from "@/components/jobs/JobApplicationModal";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Briefcase,
  Sparkles,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DetailedJob, DetailedRole, JobDetailResponse } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeProfileId } = useAuth();
  const { t, locale } = useI18n();
  const [job, setJob] = useState<DetailedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<DetailedRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isRTL = locale === "ar";

  const fetchJob = useCallback(async () => {
    if (!activeProfileId) {
      setError(t("jobs.jobDetail.errors.profileNotLoaded"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/jobs/${params.id}?profile_id=${activeProfileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
            "Accept-Language": locale,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || data.message || t("jobs.jobDetail.errors.fetchFailed")
        );
      }

      const result: JobDetailResponse = await response.json();

      if (result.status === "success" || result.status === true) {
        setJob(result.data);
      } else {
        throw new Error(result.message || t("jobs.jobDetail.errors.loadFailed"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("jobs.jobDetail.errors.generic")
      );
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, params.id, t, locale]);

  useEffect(() => {
    if (activeProfileId) {
      fetchJob();
    }
  }, [params.id, activeProfileId, fetchJob]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12 text-center dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
            {t("jobs.jobDetail.failedToLoad")}
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("jobs.jobDetail.backToJobs")}
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const roles = Array.isArray(job.roles) ? job.roles : [];
  const roleCount = roles.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/jobs")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#c49a47] dark:text-gray-400"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          {t("jobs.jobDetail.backToJobs")}
        </button>

        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="h-2 bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47]" />

          {/* Job Image */}
          {job.image && (
            <div className="relative h-64 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              {/* Optimized image with responsive sizes and compression */}
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
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
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
              {job.is_active && job.open_to_apply && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {t("jobs.jobDetail.openToApply")}
                </span>
              )}
              {!job.open_to_apply && (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {t("jobs.jobDetail.closed")}
                </span>
              )}
            </div>

            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {job.description}
            </p>

            {job.highlights && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  {t("jobs.jobDetail.highlights")}
                </p>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                  {job.highlights}
                </p>
              </div>
            )}

            {job.usage_terms && (
              <div className="mb-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                  {t("jobs.jobDetail.usageTerms")}
                </p>
                <p className="mt-1 text-sm text-purple-800 dark:text-purple-300">
                  {job.usage_terms}
                </p>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("jobs.jobDetail.shootingDate")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.shooting_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Clock className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("jobs.jobDetail.expiresOn")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.expiration_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Users className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("jobs.jobDetail.openRoles")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {roleCount} {t("jobs.jobDetail.available")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("jobs.jobDetail.locations")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {job.job_countries?.length || 0} {t("jobs.jobDetail.countries")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professions Section */}
            {job.professions && job.professions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#c49a47]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("jobs.jobDetail.requiredProfessions")}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.professions.map((profession, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-[#c49a47]/10 px-4 py-2 text-sm font-medium text-[#c49a47] dark:bg-[#c49a47]/20"
                    >
                      {profession}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Professions Section */}
            {job.sub_professions && job.sub_professions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#c49a47]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("jobs.jobDetail.subProfessions")}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.sub_professions.map((subProf, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {subProf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roles Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("jobs.jobDetail.availableRoles")} ({roleCount})
              </h2>

              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {role.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {role.description}
                    </p>
                  </div>

                  {/* Role Requirements */}
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobs.jobDetail.gender")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {t(`filters.${role.gender}`)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobs.jobDetail.ageRange")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.start_age} - {role.end_age} {t("jobs.jobDetail.years")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobs.jobDetail.ethnicity")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {Array.isArray(role.ethnicity)
                          ? role.ethnicity.join(", ")
                          : role.ethnicity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobs.jobDetail.paymentTerms")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.payment_terms_days} days
                      </span>
                    </div>

                    {role.budget && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-[#c49a47]" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {t("jobs.jobDetail.budget")}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          AED {role.budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Applicability */}
                  {role.can_apply ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#00ff00]/10 p-3 dark:bg-[#00ff00]/20">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {t("jobs.jobDetail.meetRequirements")}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#ff0000]/10 p-3 dark:bg-[#ff0000]/20">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        {t("jobs.jobDetail.notMeetRequirements")} (
                        {t("jobs.jobDetail.eligibility")}:{" "}
                        {role.eligibility_score || 0}%)
                      </span>
                    </div>
                  )}

                  {/* Meta Conditions */}
                  {role.meta_conditions.length > 0 && (
                    <div className="mb-4 rounded-lg border border-gray-200 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        {t("jobs.jobDetail.physicalRequirements")}
                      </h4>
                      <div className="grid gap-x-10 gap-y-2 sm:grid-cols-2 text-sm">
                        {Object.entries(role.meta_conditions[0]).map(
                          ([key, value]) => {
                            // Map attribute keys to translation keys
                            const attrKeyMap: Record<string, string> = {
                              hair_color: "content.hairColor",
                              hair_length: "content.hairLength",
                              hair_type: "content.hairType",
                              eye_color: "content.eyeColor",
                              height: "content.height",
                              weight: "content.weight",
                              shoe_size: "content.shoeSize",
                              pants_size: "content.pantsSize",
                              tshirt_size: "content.tshirtSize",
                              tattoos: "content.tattoos",
                              piercings: "content.piercings",
                            };
                            const translationKey =
                              attrKeyMap[key as keyof typeof attrKeyMap];
                            return (
                              value !== null &&
                              value !== undefined && (
                                <div
                                  key={key}
                                  className="flex justify-between px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-800"
                                >
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {translationKey
                                      ? t(translationKey)
                                      : key.replace(/_/g, " ")}
                                    :
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {value}
                                  </span>
                                </div>
                              )
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Conditions */}
                  {role.conditions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        {t("jobs.jobDetail.additionalRequirements")}
                      </h4>
                      <div className="space-y-2">
                        {role.conditions.map((condition) => (
                          <div
                            key={condition.id}
                            className="flex items-start gap-2 text-sm"
                          >
                            {condition.is_required ? (
                              <CheckCircle className="h-4 w-4 shrink-0 text-[#c49a47]" />
                            ) : (
                              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300">
                              {condition.label}
                              {condition.is_required && (
                                <span className="ms-1 text-red-500">*</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => {
                        if (role.can_apply) {
                          setSelectedRole(role);
                          setIsModalOpen(true);
                        } else {
                          toast.error(
                            t("jobs.jobDetail.notEligibleToApply") ||
                              "You don't meet the requirements for this role"
                          );
                        }
                      }}
                      disabled={!role.can_apply}
                      className={`w-full rounded-lg px-6 py-3 font-semibold shadow-lg transition hover:shadow-xl ${
                        role.can_apply
                          ? "bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white hover:from-[#b8963f] hover:to-[#c89a4a]"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {role.can_apply
                        ? (t("jobs.jobDetail.applyFor") || "Apply for") +
                          " " +
                          role.name
                        : t("jobs.jobDetail.canNotApply") || "Can not apply"}
                    </button>
                    {!role.can_apply && (
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {t("jobs.jobDetail.eligibilityScoreNote") ||
                          "You don't fully meet the requirements but can still apply"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Locations */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("jobs.jobDetail.jobLocations")}
                </h3>
              </div>
              <ul className="space-y-2">
                {job.job_countries?.map((country, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
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

            {/* Residence Countries */}
            {job.residence_countries && job.residence_countries.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#c49a47]" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("jobs.jobDetail.residenceCountries")}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {job.residence_countries.map((country, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#c49a47]" />
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRole(null);
          }}
          jobId={job.id}
          role={selectedRole}
          profileId={activeProfileId || undefined}
        />
      )}
    </div>
  );
}
