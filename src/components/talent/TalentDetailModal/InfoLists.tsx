import { Languages } from "lucide-react";
import { InfoListsProps } from "./types";

export function InfoLists({ profile, professions, languages, t }: InfoListsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {professions.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">{t("talents.professions")}</h3>
          <div className="flex flex-wrap gap-2">
            {professions.map((p) => (
              <span key={p.id} className="px-2.5 py-1 sm:px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.nationalities && profile.nationalities.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">{t("talents.nationalities")}</h3>
          <div className="flex flex-wrap gap-2">
            {profile.nationalities.map((nat, idx) => (
              <span key={idx} className="px-2.5 py-1 sm:px-3 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                {typeof nat === "object" ? (nat as any).name : nat}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.ethnicities && profile.ethnicities.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3">{t("talents.ethnicities")}</h3>
          <div className="flex flex-wrap gap-2">
            {profile.ethnicities.map((eth, idx) => (
              <span key={idx} className="px-2.5 py-1 sm:px-3 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                {typeof eth === "object" ? (eth as any).name : eth}
              </span>
            ))}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {t("talents.languages")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang, idx) => (
              <span
                key={`${lang}-${idx}`}
                className="px-2.5 py-1 sm:px-3 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
