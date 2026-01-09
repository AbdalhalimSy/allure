"use client";
import Input from "@/components/ui/Input";
import SingleSelect from "@/components/ui/SingleSelect";
import Button from "@/components/ui/Button";
import MultiSelect from "@/components/ui/MultiSelect";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { TalentFilters } from "@/types/talent";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { fetchWithRetry, cachedGet } from "@/lib/utils/fetchWithRetry";
import { logger } from "@/lib/utils/logger";
import { useI18n } from "@/contexts/I18nContext";

// Re-export TalentFilters for convenience
export type { TalentFilters };

type Props = {
  value: TalentFilters;
  onChange: (next: TalentFilters) => void;
  onReset?: () => void;
  loadingResults?: boolean;
};

interface LookupOption {
  id: number;
  name: string;
  code?: string;
}

export default function TalentFilterBar({
  value,
  onChange,
  onReset,
  loadingResults = false,
}: Props) {
  const { locale, t } = useI18n();
  const [local, setLocal] = useState<TalentFilters>(value);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Debounced search text separate from filters to avoid refetch on every keystroke
  const [searchText, setSearchText] = useState<string>(value.search || "");

  // Lookup data
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [nationalities, setNationalities] = useState<LookupOption[]>([]);
  const [ethnicities, setEthnicities] = useState<LookupOption[]>([]);
  const [professions, setProfessions] = useState<LookupOption[]>([]);
  const [hairColors, setHairColors] = useState<LookupOption[]>([]);
  const [eyeColors, setEyeColors] = useState<LookupOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  // Fetch lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoadingLookups(true);
        // Avoid hammering the API; cache responses and retry on 429
        const countriesRes = await fetchWithRetry(() =>
          cachedGet(`countries:${locale}`, () =>
            apiClient.get(`/lookups/countries?lang=${locale}`)
          )
        );
        const nationalitiesRes = await fetchWithRetry(() =>
          cachedGet(`nationalities:${locale}`, () =>
            apiClient.get(`/lookups/nationalities?lang=${locale}`)
          )
        );
        const ethnicitiesRes = await fetchWithRetry(() =>
          cachedGet(`ethnicities:${locale}`, () =>
            apiClient.get(`/lookups/ethnicities?lang=${locale}`)
          )
        );
        const professionsRes = await fetchWithRetry(() =>
          cachedGet(`professions:${locale}`, () =>
            apiClient.get(`/lookups/professions?lang=${locale}`)
          )
        );
        const appearanceRes = await fetchWithRetry(() =>
          cachedGet(`appearance:${locale}`, () =>
            apiClient.get(`/lookups/appearance-options?lang=${locale}`)
          )
        );

        if (countriesRes.data.status === "success") {
          const countriesData = countriesRes.data.data;
          setCountries(countriesData);
        }
        if (nationalitiesRes.data.status === "success") {
          const nationalitiesData = nationalitiesRes.data.data;
          setNationalities(nationalitiesData);
        }
        if (ethnicitiesRes.data.status === "success") {
          const ethnicitiesData = ethnicitiesRes.data.data;
          setEthnicities(ethnicitiesData);
        }
        if (professionsRes.data.status === "success") {
          const professionsData = professionsRes.data.data;
          setProfessions(professionsData);
        }
        if (appearanceRes.data.status === "success") {
          const hairColorsData = appearanceRes.data.data.hair_colors || [];
          const eyeColorsData = appearanceRes.data.data.eye_colors || [];
          setHairColors(hairColorsData);
          setEyeColors(eyeColorsData);
        }
      } catch (error) {
        logger.error("Failed to fetch lookups", error);
      } finally {
        setLoadingLookups(false);
      }
    };

    fetchLookups();
  }, [locale]);

  // Keep local state in sync when parent resets/changes filters externally
  useEffect(() => {
    setLocal(value);
    // Sync search text with incoming filters (e.g., on reset)
    setSearchText(value.search || "");
  }, [value]);

  // Debounce search updates to avoid refetch on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      // Only push change if it differs to reduce unnecessary re-renders
      if ((local.search || "") !== (searchText || "")) {
        update({ search: searchText || undefined });
      }
    }, 500);
    return () => clearTimeout(handle);
    // We intentionally exclude `update` from deps to keep debounce stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const update = (patch: Partial<TalentFilters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  const handleReset = () => {
    const empty: TalentFilters = {};
    setLocal(empty);
    setSearchText("");
    onChange(empty);
    onReset?.();
  };

  // Count active filters
  const activeFiltersCount = Object.keys(local).filter((key) => {
    const value = local[key as keyof TalentFilters];
    return value !== undefined && value !== null && value !== "";
  }).length;

  return (
    <div className="relative space-y-4">
      {/* Main Filters - Single Row */}
      <div className="relative z-50 rounded-2xl border border-gray-200/80 bg-white/95 p-3 sm:p-4 lg:p-6 shadow-lg backdrop-blur-xl ">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:flex-nowrap">
          {/* Search Input - Full width on mobile */}
          <div className="relative w-full lg:flex-1 lg:min-w-0">
            <Search className="pointer-events-none absolute start-3 sm:start-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("filters.searchTalents") || "Search talents..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-9 sm:h-10 lg:h-12 ps-9 sm:ps-11 lg:ps-12 pe-9 sm:pe-11 lg:pe-12 text-xs sm:text-sm lg:text-base"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute end-8 sm:end-10 lg:end-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 "
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
            {(loadingResults || loadingLookups) && (
              <div className="pointer-events-none absolute end-2 sm:end-3 lg:end-4 top-1/2 -translate-y-1/2">
                <Loader size="sm" variant="spinner" color="primary" />
              </div>
            )}
          </div>

          {/* Gender Filter */}
          <SingleSelect
            searchable={false}
            options={[
              { value: "", label: t("filters.allGenders") },
              { value: "male", label: t("filters.male") },
              { value: "female", label: t("filters.female") },
              { value: "other", label: t("filters.other") },
            ]}
            value={local.gender ?? ""}
            onChange={(val) =>
              update({
                gender:
                  val && val !== ""
                    ? (val as "male" | "female" | "other")
                    : undefined,
              })
            }
            className="w-24 sm:w-28 lg:w-32 xl:w-36 shrink-0 text-sm"
          />

          {/* Twins Filter */}
          <Switch
            checked={local.is_twin ?? false}
            onChange={(checked) =>
              update({
                is_twin: checked ? true : undefined,
              })
            }
            label={t("filters.twinsOnly") || "Twins"}
            className="shrink-0"
          />

          {/* Divider */}
          <div className="hidden lg:block h-8 w-px bg-gray-200 shrink-0" />

          {/* Advanced Filters Toggle */}
          <Button
            type="button"
            variant={showAdvanced ? "primary" : "secondary"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 sm:gap-2 shrink-0 px-2 sm:px-3 lg:px-4 h-9 sm:h-10 lg:h-12 text-xs sm:text-sm"
          >
            <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {t("filters.filters") || "Filters"}
            </span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#c49a47] text-[10px] sm:text-xs font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
            {showAdvanced ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>

          {/* Reset Filters Button */}
          {activeFiltersCount > 0 && (
            <>
              <div className="hidden lg:block h-8 w-px bg-gray-200 shrink-0" />
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0 px-2 sm:px-3 lg:px-4 h-9 sm:h-10 lg:h-12 text-xs sm:text-sm"
                title="Reset All Filters"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">{t("filters.reset") || "Reset"}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div
        className={`relative ${
          showAdvanced
            ? "opacity-100 translate-y-0 max-h-[2000px] overflow-visible"
            : "opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none"
        } rounded-2xl border border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out `}
        aria-hidden={!showAdvanced}
      >
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
          {/* Demographics Section */}
          <div className="relative z-40 space-y-4">
            <div className="border-b border-gray-200/50 pb-2 ">
              <h3 className="font-semibold text-gray-900 ">
                {t("filters.demographics") || "Demographics"}
              </h3>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Age Range */}
              <div className="space-y-2">
                <Label>{t("filters.ageRange") || "Age Range"}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t("filters.min") || "Min"}
                    value={local.min_age || ""}
                    onChange={(e) =>
                      update({
                        min_age: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    min="0"
                    max="100"
                  />
                  <Input
                    type="number"
                    placeholder={t("filters.max") || "Max"}
                    value={local.max_age || ""}
                    onChange={(e) =>
                      update({
                        max_age: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Height Range */}
              <div className="space-y-2">
                <Label>{t("filters.heightCm") || "Height (cm)"}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t("filters.min") || "Min"}
                    value={local.min_height || ""}
                    onChange={(e) =>
                      update({
                        min_height: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    min="0"
                    max="250"
                  />
                  <Input
                    type="number"
                    placeholder={t("filters.max") || "Max"}
                    value={local.max_height || ""}
                    onChange={(e) =>
                      update({
                        max_height: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    min="0"
                    max="250"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label>{t("filters.sortBy") || "Sort By"}</Label>
                <div className="flex gap-2">
                  <SingleSelect
                    searchable={false}
                    options={[
                      {
                        value: "",
                        label: t("filters.sortDefault") || "Default",
                      },
                      { value: "age", label: t("filters.sortAge") || "Age" },
                      {
                        value: "height",
                        label: t("filters.sortHeight") || "Height",
                      },
                      {
                        value: "created_at",
                        label: t("filters.sortNewest") || "Newest",
                      },
                      {
                        value: "instagram_followers",
                        label: t("filters.sortFollowers") || "Followers",
                      },
                    ]}
                    value={local.sort_by || ""}
                    onChange={(val) =>
                      update({
                        sort_by:
                          val && val !== ""
                            ? (val as
                                | "age"
                                | "height"
                                | "created_at"
                                | "instagram_followers"
                                | "first_name")
                            : undefined,
                      })
                    }
                    className="flex-1"
                  />
                  <SingleSelect
                    searchable={false}
                    options={[
                      { value: "asc", label: t("filters.sortAsc") || "↑ Asc" },
                      {
                        value: "desc",
                        label: t("filters.sortDesc") || "↓ Desc",
                      },
                    ]}
                    value={local.sort_order || "asc"}
                    onChange={(val) =>
                      update({
                        sort_order: val ? (val as "asc" | "desc") : "asc",
                      })
                    }
                    disabled={!local.sort_by}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Section */}
          <div className="relative z-30 space-y-4">
            <div className="border-b border-gray-200/50 pb-2 ">
              <h3 className="font-semibold text-gray-900 ">
                {t("filters.professional") || "Professional"}
              </h3>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Professions */}
              <div className="space-y-2">
                <Label>{t("filters.professions") || "Professions"}</Label>
                <MultiSelect
                  options={professions}
                  value={
                    local.profession_ids
                      ? local.profession_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      profession_ids:
                        ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectProfessions") || "Select professions..."
                  }
                  loading={loadingLookups}
                />
              </div>

              {/* Ethnicities */}
              <div className="space-y-2">
                <Label>{t("filters.ethnicities") || "Ethnicities"}</Label>
                <MultiSelect
                  options={ethnicities}
                  value={
                    local.ethnicity_ids
                      ? local.ethnicity_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      ethnicity_ids: ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectEthnicities") || "Select ethnicities..."
                  }
                  loading={loadingLookups}
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="relative z-20 space-y-4">
            <div className="border-b border-gray-200/50 pb-2 ">
              <h3 className="font-semibold text-gray-900 ">
                {t("filters.locationOrigin") || "Location & Origin"}
              </h3>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Countries */}
              <div className="space-y-2">
                <Label>{t("filters.countries") || "Countries"}</Label>
                <MultiSelect
                  options={countries}
                  value={
                    local.country_ids
                      ? local.country_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      country_ids: ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectCountries") || "Select countries..."
                  }
                  loading={loadingLookups}
                />
              </div>

              {/* Nationalities */}
              <div className="space-y-2">
                <Label>{t("filters.nationalities") || "Nationalities"}</Label>
                <MultiSelect
                  options={nationalities}
                  value={
                    local.nationality_ids
                      ? local.nationality_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      nationality_ids:
                        ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectNationalities") ||
                    "Select nationalities..."
                  }
                  loading={loadingLookups}
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="relative z-10 space-y-4">
            <div className="border-b border-gray-200/50 pb-2 ">
              <h3 className="font-semibold text-gray-900 ">
                {t("filters.appearance") || "Appearance"}
              </h3>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Hair Colors */}
              <div className="space-y-2">
                <Label>{t("filters.hairColors") || "Hair Colors"}</Label>
                <MultiSelect
                  options={hairColors}
                  value={
                    local.hair_color_ids
                      ? local.hair_color_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      hair_color_ids:
                        ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectHairColors")
                  }
                  loading={loadingLookups}
                />
              </div>

              {/* Eye Colors */}
              <div className="space-y-2">
                <Label>{t("filters.eyeColors") || "Eye Colors"}</Label>
                <MultiSelect
                  options={eyeColors}
                  value={
                    local.eye_color_ids
                      ? local.eye_color_ids.split(",").map(Number)
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      eye_color_ids: ids.length > 0 ? ids.join(",") : undefined,
                    })
                  }
                  placeholder={
                    t("filters.selectEyeColors")
                  }
                  loading={loadingLookups}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
