"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  CheckCircle
} from "lucide-react";
import { DetailedJob, DetailedRole, JobDetailResponse } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
};

const formatTime = (timeString: string) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
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

  useEffect(() => {
    if (activeProfileId) {
      fetchJob();
    }
  }, [params.id, activeProfileId]);

  const fetchJob = async () => {
    if (!activeProfileId) {
      setError(t("jobDetail.errors.profileNotLoaded"));
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
            "Authorization": `Bearer ${localStorage.getItem("auth_token") || ""}`,
            "Accept-Language": locale,
          }
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || t("jobDetail.errors.fetchFailed"));
      }
      
      const result: JobDetailResponse = await response.json();
      
      if (result.status === "success" || result.status === true) {
        setJob(result.data);
      } else {
        throw new Error(result.message || t("jobDetail.errors.loadFailed"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("jobDetail.errors.generic"));
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

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
            {t("jobDetail.failedToLoad")}
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("jobDetail.backToJobs")}
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
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
          <ArrowLeft className="h-4 w-4" />
          {t("jobDetail.backToJobs")}
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
                    {t("jobDetail.expiresIn")} {daysUntilExpiry} {t("jobDetail.days")}
                  </span>
                )}
                {daysUntilExpiry <= 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-400 px-3 py-1 text-xs font-semibold text-white">
                    <AlertCircle className="h-3 w-3" />
                    {t("jobDetail.applicationClosed")}
                  </span>
                )}
              </div>
              {job.is_active && job.open_to_apply && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {t("jobDetail.openToApply")}
                </span>
              )}
              {!job.open_to_apply && (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {t("jobDetail.closed")}
                </span>
              )}
            </div>

            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {job.description}
            </p>

            {job.highlights && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">{t("jobDetail.highlights")}</p>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">{job.highlights}</p>
              </div>
            )}

            {job.usage_terms && (
              <div className="mb-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">{t("jobDetail.usageTerms")}</p>
                <p className="mt-1 text-sm text-purple-800 dark:text-purple-300">{job.usage_terms}</p>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("jobDetail.shootingDate")}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.shooting_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Clock className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("jobDetail.expiresOn")}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.expiration_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Users className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("jobDetail.openRoles")}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {roleCount} {t("jobDetail.available")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("jobDetail.locations")}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {job.job_countries?.length || 0} {t("jobDetail.countries")}
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
                    {t("jobDetail.requiredProfessions")}
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
                    {t("jobDetail.subProfessions")}
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
                {t("jobDetail.availableRoles")} ({roleCount})
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
                        {t("jobDetail.gender")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {t(`filters.${role.gender}`)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobDetail.ageRange")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.start_age} - {role.end_age} {t("jobDetail.years")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobDetail.ethnicity")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {Array.isArray(role.ethnicity) ? role.ethnicity.join(", ") : role.ethnicity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {t("jobDetail.paymentTerms")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.payment_terms_days} days
                      </span>
                    </div>

                    {role.budget && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-[#c49a47]" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {t("jobDetail.budget")}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          AED {role.budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Applicability */}
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#c49a47]/10 p-3 dark:bg-[#c49a47]/20">
                    {role.can_apply ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          {t("jobDetail.meetRequirements")}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          {t("jobDetail.notMeetRequirements")} ({t("jobDetail.eligibility")}: {role.eligibility_score || 0}%)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Meta Conditions */}
                  {role.meta_conditions.length > 0 && (
                    <div className="mb-4 rounded-lg border border-gray-200 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        {t("jobDetail.physicalRequirements")}
                      </h4>
                      <div className="grid gap-x-10 gap-y-2 sm:grid-cols-2 text-sm">
                        {Object.entries(role.meta_conditions[0]).map(([key, value]) => {
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
                          const translationKey = attrKeyMap[key as keyof typeof attrKeyMap];
                          return value !== null && value !== undefined && (
                            <div key={key} className="flex justify-between px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                              <span className="text-gray-600 dark:text-gray-400">
                                {translationKey ? t(translationKey) : key.replace(/_/g, " ")}:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Call Time Information */}
                  {role.call_time_enabled && role.call_time_slots && role.call_time_slots.length > 0 && (
                    <div className="mb-4 rounded-lg bg-[#c49a47]/10 p-4 dark:bg-[#c49a47]/20">
                      <h4 className="mb-3 font-semibold text-[#c49a47] dark:text-[#c49a47]">
                        {t("jobDetail.availableCallTimes")}
                      </h4>
                      <div className="space-y-3">
                        {role.call_time_slots.map((slotGroup, idx) => (
                          <div key={idx} className="rounded bg-white p-3 shadow-sm dark:bg-gray-900">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {formatDate(slotGroup.date)}
                            </p>
                            {slotGroup.slots.map((timeSlot) => {
                              const availableCount = timeSlot.available_times?.filter((t) => !t.is_fully_booked).length || 0;
                              const totalCount = timeSlot.available_times?.length || 0;

                              return (
                                <div key={timeSlot.id} className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                                  <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
                                      <span className="ms-2 text-gray-500">
                                        ({t("jobDetail.every")} {timeSlot.interval_minutes} {t("jobDetail.min")}, {timeSlot.max_talents} {t("jobDetail.spot")}{timeSlot.max_talents > 1 ? 's' : ''} {t("jobDetail.perTime") || ''})
                                      </span>
                                    </p>
                                    <p className="text-gray-500">
                                      {t("jobDetail.availableLabel")}: {availableCount}/{totalCount} {t("jobDetail.slots")}
                                    </p>
                                  </div>

                                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    {timeSlot.available_times?.map((availableTime) => {
                                      const isBooked = availableTime.is_fully_booked;
                                      const availabilityText = isBooked
                                        ? t("jobDetail.fullyBooked")
                                        : `${availableTime.available_spots} ${availableTime.available_spots === 1 ? t("jobDetail.spotLeft") : t("jobDetail.spotsLeft")}`;

                                      return (
                                        <div
                                          key={availableTime.time}
                                          className={`rounded-lg border px-3 py-2 text-sm ${
                                            isBooked
                                              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-200"
                                              : "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold">{formatTime(availableTime.time)}</span>
                                            <span className={`text-xs font-medium ${
                                              isBooked ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
                                            }`}>
                                              {availabilityText}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions */}
                  {role.conditions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        {t("jobDetail.additionalRequirements")}
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

                  {job.open_to_apply && (
                    <button 
                      onClick={() => {
                        setSelectedRole(role);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 w-full rounded-lg bg-linear-to-r from-[#c49a47] to-[#d4a855] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                      disabled={!role.can_apply}
                    >
                      {t("jobDetail.applyFor")} {role.name}
                    </button>
                  )}
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
                  {t("jobDetail.jobLocations")}
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
                )) || <li className="text-sm text-gray-500">{t("jobDetail.noLocations")}</li>}
              </ul>
            </div>

            {/* Residence Countries */}
            {job.residence_countries && job.residence_countries.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#c49a47]" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("jobDetail.residenceCountries")}
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
