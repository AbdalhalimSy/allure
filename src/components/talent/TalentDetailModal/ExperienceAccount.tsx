import { Calendar } from "lucide-react";
import { ExperienceAccountProps } from "./types";

export function ExperienceAccount({ profile, t }: ExperienceAccountProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {profile.experiences && profile.experiences.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">{t("talents.experience")}</h3>
          <div className="space-y-2 sm:space-y-3">
            {profile.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{exp.title}</p>
                    {exp.description && <p className="text-xs sm:text-sm text-gray-600 mt-1">{exp.description}</p>}
                  </div>
                  {exp.is_current && (
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {t("talents.current")}
                    </span>
                  )}
                </div>
                {(exp.start_date || exp.end_date) && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {exp.start_date && new Date(exp.start_date).toLocaleDateString()}
                      {exp.end_date && !exp.is_current && (
                        <>
                          {" - "}
                          {new Date(exp.end_date).toLocaleDateString()}
                        </>
                      )}
                      {exp.is_current && ` - ${t("talents.present")}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">{t("talents.accountInfo")}</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide">{t("talents.status")}</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 mt-1 sm:mt-2 capitalize">{profile.approval_status}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide">{t("talents.memberSince")}</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 mt-1 sm:mt-2">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
