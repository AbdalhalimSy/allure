import { MapPin, Ruler } from "lucide-react";
import { HeaderStatsProps } from "./types";

export function HeaderStats({
  profile,
  professions,
  t,
}: HeaderStatsProps) {
  return (
    <div className="flex-1 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 text-start">
          {profile.first_name}
        </h1>
        <p className="text-lg sm:text-xl font-light text-gray-600 mt-1 text-start">
          {profile.last_name}
        </p>
        {professions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
            {professions.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-primary/10 text-primary"
              >
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-blue-50 to-blue-100 p-3 sm:p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {t("filters.gender")}
          </p>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold text-gray-900 capitalize">
            {t(`filters.${profile.gender}`)}
          </p>
        </div>
        <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-purple-50 to-purple-100 p-3 sm:p-4">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {t("talents.age")}
          </p>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold text-gray-900">
            {profile.age} years
          </p>
        </div>
        <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-orange-50 to-orange-100 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Ruler className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {t("talents.height")}
            </p>
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {profile.height} cm
          </p>
        </div>
        <div className="rounded-lg sm:rounded-xl bg-linear-to-br from-green-50 to-green-100 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {t("talents.country")}
            </p>
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {profile.country.name}
          </p>
        </div>
      </div>
    </div>
  );
}
