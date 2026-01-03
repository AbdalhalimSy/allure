import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  Sparkles,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  Target,
  HelpCircle,
} from "lucide-react";
import { DetailedJob, DetailedRole, Profession, SubProfession } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface JobRoleCardProps {
  role: DetailedRole;
  job: DetailedJob;
  onApply: () => void;
  isAuthenticated: boolean;
  activeProfileId: number | null;
}

// Helper function to check if profession is an object
const isProfessionObject = (prof: any): prof is Profession => {
  return prof && typeof prof === "object" && "id" in prof;
};

// Helper function to get profession name
const getProfessionName = (prof: string | Profession): string => {
  return typeof prof === "string" ? prof : prof.name;
};

// Helper function to get profession description
const getProfessionDescription = (prof: string | Profession): string | null => {
  return typeof prof === "string" ? null : (prof.description || null);
};

// Helper function to check if sub-profession is an object
const isSubProfessionObject = (subProf: any): subProf is SubProfession => {
  return subProf && typeof subProf === "object" && "id" in subProf;
};

// Helper function to get sub-profession name
const getSubProfessionName = (subProf: string | SubProfession): string => {
  return typeof subProf === "string" ? subProf : subProf.name;
};

// Helper function to get sub-profession description
const getSubProfessionDescription = (subProf: string | SubProfession): string | null => {
  return typeof subProf === "string" ? null : (subProf.description || null);
};

export function JobRoleCard({
  role,
  job,
  onApply,
  isAuthenticated,
  activeProfileId,
}: JobRoleCardProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "details">("overview");
  const [expandedProfession, setExpandedProfession] = useState<number | null>(null);

  const alreadyApplied = role.has_applied || job.has_applied;
  const isDisabled =
    alreadyApplied ||
    role.can_apply === false ||
    !job.open_to_apply ||
    !isAuthenticated ||
    !activeProfileId;

  const tabs = [
    { id: "overview" as const, label: t("jobs.jobDetail.overview") || "Overview", icon: FileText },
    { id: "requirements" as const, label: t("jobs.jobDetail.requirements") || "Requirements", icon: Target },
    { id: "details" as const, label: t("jobs.jobDetail.details") || "Details", icon: Info },
  ];

  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/50 bg-white shadow-lg transition-all hover:shadow-2xl">
      {/* Gradient Top Border */}
      <div className="h-1 bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47]" />
      
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1">{role.name}</h3>
            {role.has_applied && (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-linear-to-r from-emerald-500 to-green-500 px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {t("jobs.jobDetail.alreadyApplied") || "Applied"}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-2 sm:mb-3">{role.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {role.call_time_enabled && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-indigo-700">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {t("jobs.appliedJobs.details.callTimeEnabled") || "Call time required"}
              </span>
            )}
            {role.budget && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-green-700">
                <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {role.budget_currency || "AED"} {role.budget.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#c49a47]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#c49a47] to-[#d4a855]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[150px] sm:min-h-[200px]">
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Eligibility Status */}
              {(() => {
                if (alreadyApplied) {
                  return (
                    <div className="flex items-start gap-3 rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 p-4">
                      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-emerald-700">
                          {t("jobs.jobDetail.alreadyApplied") || "You already applied for this role"}
                        </span>
                      </div>
                    </div>
                  );
                }

                if (role.can_apply) {
                  return (
                    <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 p-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {t("jobs.jobDetail.meetRequirements")}
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 rounded-2xl bg-linear-to-br from-red-50 to-orange-50 border border-red-200 p-4">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-red-700 mb-2">
                          {t("jobs.jobDetail.notMeetRequirements")}
                        </div>
                        {role.reasons && role.reasons.length > 0 && (
                          <ul className="space-y-1.5">
                            {role.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-red-600">
                                <span className="mt-1 text-red-400">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {(!role.reasons || role.reasons.length === 0) && (
                          <div className="text-sm text-red-600">
                            {t("jobs.jobDetail.eligibility")}: {role.eligibility_score || 0}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Basic Requirements Grid */}
              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 border border-gray-200">
                  <div className="rounded-lg bg-linear-to-br from-[#c49a47] to-[#d4a855] p-1.5 sm:p-2 shrink-0">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t("jobs.jobDetail.gender")}</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{t(`filters.${role.gender}`)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 border border-gray-200">
                  <div className="rounded-lg bg-linear-to-br from-[#c49a47] to-[#d4a855] p-1.5 sm:p-2 shrink-0">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t("jobs.jobDetail.ageRange")}</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {role.start_age} - {role.end_age} {t("jobs.jobDetail.years")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 border border-gray-200">
                  <div className="rounded-lg bg-linear-to-br from-[#c49a47] to-[#d4a855] p-1.5 sm:p-2 shrink-0">
                    <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t("jobs.jobDetail.ethnicity")}</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {Array.isArray(role.ethnicity) ? role.ethnicity.join(", ") : role.ethnicity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 border border-gray-200">
                  <div className="rounded-lg bg-linear-to-br from-[#c49a47] to-[#d4a855] p-1.5 sm:p-2 shrink-0">
                    <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t("jobs.jobDetail.paymentTerms")}</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{role.payment_terms_days} days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "requirements" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Role-Level Requirements */}
              {((role.professions?.length ?? 0) ||
                (role.sub_professions?.length ?? 0) ||
                (role.talent_based_countries?.length ?? 0)) > 0 && (
                <div className="space-y-4">
                  {role.professions && role.professions.length > 0 && (
                    <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 p-5">
                      <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                        <Briefcase className="h-5 w-5 text-[#c49a47]" />
                        {t("jobs.jobDetail.requiredProfessions")}
                      </h4>
                      <div className="space-y-2">
                        {role.professions.map((profession, idx) => {
                          const name = getProfessionName(profession);
                          const description = getProfessionDescription(profession);
                          const isObj = isProfessionObject(profession);
                          
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-xl bg-linear-to-br from-[#c49a47] to-[#d4a855] px-4 py-2 text-sm font-semibold text-white shadow-md">
                                  {name}
                                </span>
                                {isObj && description && (
                                  <button
                                    onClick={() =>
                                      setExpandedProfession(
                                        expandedProfession === idx ? null : idx
                                      )
                                    }
                                    className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors"
                                    title="Show more info"
                                  >
                                    <HelpCircle className="h-4 w-4 text-[#c49a47]" />
                                  </button>
                                )}
                              </div>
                              {isObj && description && expandedProfession === idx && (
                                <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-amber-100">
                                  <p className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Description
                                  </p>
                                  <p>{description}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {role.sub_professions && role.sub_professions.length > 0 && (
                    <div className="rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-5">
                      <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        {t("jobs.jobDetail.subProfessions")}
                      </h4>
                      <div className="space-y-2">
                        {role.sub_professions.map((subProf, idx) => {
                          const name = getSubProfessionName(subProf);
                          const description = getSubProfessionDescription(subProf);
                          const isObj = isSubProfessionObject(subProf);
                          const baseIdx = (role.professions?.length ?? 0) + idx;
                          
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-xl bg-white border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
                                  {name}
                                </span>
                                {isObj && description && (
                                  <button
                                    onClick={() =>
                                      setExpandedProfession(
                                        expandedProfession === baseIdx ? null : baseIdx
                                      )
                                    }
                                    className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors"
                                    title="Show more info"
                                  >
                                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                                  </button>
                                )}
                              </div>
                              {isObj && description && expandedProfession === baseIdx && (
                                <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-indigo-100">
                                  <p className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Description
                                  </p>
                                  <p>{description}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {role.talent_based_countries && role.talent_based_countries.length > 0 && (
                    <div className="rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 p-5">
                      <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        {t("jobs.jobDetail.talentLocation") || "Talent Must Be Based In"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.talent_based_countries.map((country, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl bg-white border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:shadow-md transition-shadow"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Conditions */}
              {role.conditions.length > 0 && (
                <div className="rounded-2xl bg-linear-to-br from-gray-50 to-slate-50 border border-gray-200 p-5">
                  <h4 className="mb-4 font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#c49a47]" />
                    {t("jobs.jobDetail.additionalRequirements")}
                  </h4>
                  <div className="space-y-2">
                    {role.conditions.map((condition) => (
                      <div key={condition.id} className="flex items-start gap-3 text-sm bg-white rounded-xl p-3 border border-gray-200">
                        {condition.is_required ? (
                          <CheckCircle className="h-5 w-5 shrink-0 text-[#c49a47] mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 mt-0.5" />
                        )}
                        <span className="text-gray-700 flex-1">
                          {condition.label}
                          {condition.is_required && <span className="ms-1 text-red-500 font-bold">*</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Physical Requirements */}
              {role.meta_conditions.length > 0 && (
                <div className="rounded-2xl bg-linear-to-br from-violet-50 to-purple-50 border border-violet-200 p-5">
                  <h4 className="mb-4 font-bold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-violet-600" />
                    {t("jobs.jobDetail.physicalRequirements")}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(role.meta_conditions[0]).map(([key, value]) => {
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
                      return (
                        value !== null &&
                        value !== undefined && (
                          <div key={key} className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-violet-200">
                            <span className="text-sm text-gray-600 font-medium">
                              {translationKey ? t(translationKey) : key.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm font-bold text-gray-900">{value}</span>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}

              {role.meta_conditions.length === 0 && (
                <div className="text-center py-12">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No additional physical requirements specified</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
          <button
            onClick={onApply}
            disabled={isDisabled}
            className={`group/btn relative w-full overflow-hidden rounded-xl sm:rounded-2xl px-6 py-3 sm:px-8 sm:py-4 font-bold text-base sm:text-lg shadow-xl transition-all ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {!isDisabled && (
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
            )}
            <span className="relative">
              {alreadyApplied
                ? t("jobs.jobDetail.alreadyApplied") || "Already applied"
                : !isAuthenticated || !activeProfileId
                ? t("jobs.jobDetail.loginToApply") || "Login to apply"
                : role.can_apply === false
                ? t("jobs.jobDetail.canNotApply") || "Cannot apply"
                : (t("jobs.jobDetail.applyFor") || "Apply for") + " " + role.name}
            </span>
          </button>
          {role.can_apply === false && !alreadyApplied && (
            <p className="text-xs text-center text-gray-500">
              {t("jobs.jobDetail.eligibilityScoreNote") ||
                "You don't fully meet the requirements"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
