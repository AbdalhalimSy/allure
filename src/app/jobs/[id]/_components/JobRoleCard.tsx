
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
} from "lucide-react";
import { DetailedJob, DetailedRole } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface JobRoleCardProps {
  role: DetailedRole;
  job: DetailedJob;
  onApply: () => void;
  isAuthenticated: boolean;
  activeProfileId: number | null;
}

export function JobRoleCard({
  role,
  job,
  onApply,
  isAuthenticated,
  activeProfileId,
}: JobRoleCardProps) {
  const { t } = useI18n();

  const alreadyApplied = role.has_applied || job.has_applied;
  const isDisabled =
    alreadyApplied ||
    role.can_apply === false ||
    !job.open_to_apply ||
    !isAuthenticated ||
    !activeProfileId;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {role.has_applied && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          {t("jobs.jobDetail.alreadyApplied") || "Already Applied"}
        </div>
      )}
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{role.name}</h3>
        <p className="text-gray-600">{role.description}</p>
        {role.call_time_enabled && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Clock className="h-3 w-3" />
            {t("jobs.appliedJobs.details.callTimeEnabled") || "Call time required"}
          </div>
        )}
      </div>

      {/* Role-Level Requirements */}
      {((role.professions?.length ?? 0) ||
        (role.sub_professions?.length ?? 0) ||
        (role.talent_based_countries?.length ?? 0)) > 0 && (
        <div className="mb-4 space-y-3">
          {role.professions && role.professions.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                <Briefcase className="h-4 w-4 text-[#c49a47]" />
                {t("jobs.jobDetail.requiredProfessions")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.professions.map((profession, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-[#c49a47]/10 px-3 py-1 text-sm font-medium text-[#c49a47]"
                  >
                    {profession}
                  </span>
                ))}
              </div>
            </div>
          )}

          {role.sub_professions && role.sub_professions.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                <Sparkles className="h-4 w-4 text-[#c49a47]" />
                {t("jobs.jobDetail.subProfessions")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.sub_professions.map((subProf, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    {subProf}
                  </span>
                ))}
              </div>
            </div>
          )}

          {role.talent_based_countries && role.talent_based_countries.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                <MapPin className="h-4 w-4 text-[#c49a47]" />
                {t("jobs.jobDetail.talentLocation") || "Talent Must Be Based In"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.talent_based_countries.map((country, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Requirements */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-[#c49a47]" />
          <span className="font-medium text-gray-700">{t("jobs.jobDetail.gender")}</span>
          <span className="text-gray-900">{t(`filters.${role.gender}`)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-[#c49a47]" />
          <span className="font-medium text-gray-700">{t("jobs.jobDetail.ageRange")}</span>
          <span className="text-gray-900">
            {role.start_age} - {role.end_age} {t("jobs.jobDetail.years")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-[#c49a47]" />
          <span className="font-medium text-gray-700">{t("jobs.jobDetail.ethnicity")}</span>
          <span className="text-gray-900">
            {Array.isArray(role.ethnicity) ? role.ethnicity.join(", ") : role.ethnicity}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-[#c49a47]" />
          <span className="font-medium text-gray-700">{t("jobs.jobDetail.paymentTerms")}</span>
          <span className="text-gray-900">{role.payment_terms_days} days</span>
        </div>

        {role.budget && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium text-gray-700">{t("jobs.jobDetail.budget")}</span>
            <span className="text-gray-900">
              {role.budget_currency || "AED"} {role.budget.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Eligibility Status */}
      {(() => {
        if (alreadyApplied) {
          return (
            <div className="mb-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-emerald-700">
                  {t("jobs.jobDetail.alreadyApplied") || "You already applied for this role"}
                </span>
              </div>
            </div>
          );
        }

        if (role.can_apply) {
          return (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 p-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {t("jobs.jobDetail.meetRequirements")}
              </span>
            </div>
          );
        }

        return (
          <div className="mb-4 space-y-2">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-700">
                  {t("jobs.jobDetail.notMeetRequirements")}
                </div>
                {role.reasons && role.reasons.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-red-600">
                    {role.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {(!role.reasons || role.reasons.length === 0) && (
                  <div className="mt-2 text-sm text-red-600">
                    {t("jobs.jobDetail.eligibility")}: {role.eligibility_score || 0}%
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Meta Conditions */}
      {role.meta_conditions.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 p-4">
          <h4 className="mb-3 font-semibold text-gray-900">
            {t("jobs.jobDetail.physicalRequirements")}
          </h4>
          <div className="grid gap-x-10 gap-y-2 sm:grid-cols-2 text-sm">
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
                  <div key={key} className="flex justify-between px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="text-gray-600">
                      {translationKey ? t(translationKey) : key.replace(/_/g, " ")}:
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}

      {/* Conditions */}
      {role.conditions.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-3 font-semibold text-gray-900">
            {t("jobs.jobDetail.additionalRequirements")}
          </h4>
          <div className="space-y-2">
            {role.conditions.map((condition) => (
              <div key={condition.id} className="flex items-start gap-2 text-sm">
                {condition.is_required ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-[#c49a47]" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-gray-700">
                  {condition.label}
                  {condition.is_required && <span className="ms-1 text-red-500">*</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="mt-6 space-y-2">
        <button
          onClick={onApply}
          disabled={isDisabled}
          className={`w-full rounded-lg px-6 py-3 font-semibold shadow-lg transition hover:shadow-xl ${
            isDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white hover:from-[#b8963f] hover:to-[#c89a4a]"
          }`}
        >
          {alreadyApplied
            ? t("jobs.jobDetail.alreadyApplied") || "Already applied"
            : !isAuthenticated || !activeProfileId
            ? t("jobs.jobDetail.loginToApply") || "Login to apply"
            : role.can_apply === false
            ? t("jobs.jobDetail.canNotApply") || "Can not apply"
            : (t("jobs.jobDetail.applyFor") || "Apply for") + " " + role.name}
        </button>
        {role.can_apply === false && (
          <p className="text-xs text-center text-gray-500">
            {t("jobs.jobDetail.eligibilityScoreNote") ||
              "You don't fully meet the requirements but can still apply"}
          </p>
        )}
      </div>
    </div>
  );
}
