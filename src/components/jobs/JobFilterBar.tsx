"use client";
import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MultiSelect from "@/components/ui/MultiSelect";
import SingleSelect from "@/components/ui/SingleSelect";
import Label from "@/components/ui/Label";
import DatePicker from "@/components/ui/DatePicker";
import Loader from "@/components/ui/Loader";
import { JobFilters } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { logger } from "@/lib/utils/logger";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

interface LookupOption {
  id: number;
  name: string;
  code?: string;
}

type Props = {
  value: JobFilters;
  onChange: (next: JobFilters) => void;
  onReset?: () => void;
  loadingResults?: boolean;
};

export default function JobFilterBar({
  value,
  onChange,
  onReset,
  loadingResults = false,
}: Props) {
  const { locale, t } = useI18n();
  const [local, setLocal] = useState<JobFilters>(value);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchText, setSearchText] = useState<string>(value.title || "");

  // Lookups
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [professions, setProfessions] = useState<LookupOption[]>([]);
  const [nationalities, setNationalities] = useState<LookupOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoadingLookups(true);
        const [countriesRes, professionsRes, nationalitiesRes] =
          await Promise.all([
            apiClient.get(`/lookups/countries?lang=${locale}`),
            apiClient.get(`/lookups/professions?lang=${locale}`),
            apiClient.get(`/lookups/nationalities?lang=${locale}`),
          ]);

        if (countriesRes.data.status === "success")
          setCountries(countriesRes.data.data);
        if (professionsRes.data.status === "success")
          setProfessions(professionsRes.data.data);
        if (nationalitiesRes.data.status === "success")
          setNationalities(nationalitiesRes.data.data);
      } catch (error) {
        logger.error("Failed to fetch job lookups", error);
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookups();
  }, [locale]);

  // Sync when parent changes (reset etc.)
  useEffect(() => {
    setLocal(value);
    setSearchText(value.title || "");
  }, [value]);

  // Debounce search
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((local.title || "") !== (searchText || "")) {
        update({ title: searchText || undefined, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const update = (patch: Partial<JobFilters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  const handleReset = () => {
    const empty: JobFilters = {};
    setLocal(empty);
    setSearchText("");
    onChange(empty);
    onReset?.();
  };

  const activeFiltersCount = Object.entries(local).filter(([k, v]) => {
    if (k === "page") return false; // ignore page
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== "";
  }).length;

  return (
    <div className="relative space-y-4">
 <div className="relative z-70 rounded-2xl border border-gray-200/80 bg-white/95 p-4 sm:p-6 shadow-lg backdrop-blur-xl ">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute start-3 sm:start-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("jobs.jobsFilter.searchPlaceholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-10 sm:h-12 ps-10 sm:ps-12 pe-10 sm:pe-12 text-sm sm:text-base"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
 className="absolute end-10 sm:end-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 "
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
            {(loadingResults || loadingLookups) && (
              <div className="pointer-events-none absolute end-3 sm:end-4 top-1/2 -translate-y-1/2">
                <Loader size="sm" variant="spinner" color="primary" />
              </div>
            )}
          </div>

          {/* Advanced Toggle */}
          <Button
            type="button"
            variant={showAdvanced ? "primary" : "secondary"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 sm:gap-2 shrink-0 px-3 sm:px-4"
          >
            <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t("jobs.jobsFilter.filters")}</span>
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

          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
 className="hidden md:flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t("jobs.jobsFilter.reset")}</span>
            </Button>
          )}
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
 className="md:hidden flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0 px-2 sm:px-3"
              title={t("jobs.jobsFilter.resetAllTitle")}
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      <div
        className={`relative ${
          showAdvanced
            ? "z-60 opacity-100 translate-y-0 max-h-[2000px] overflow-visible"
            : "z-0 opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none"
 } rounded-2xl border border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out `}
        aria-hidden={!showAdvanced}
      >
        <div className="space-y-6 p-4 sm:p-6">
          {/* Shooting Dates & Eligibility */}
          <div className="space-y-4">
 <div className="border-b border-gray-200/50 pb-2 ">
 <h3 className="text-sm sm:text-base font-semibold text-gray-900 ">
                {t("jobs.jobsFilter.section.dates")}
              </h3>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <DatePicker
                  label={t("jobs.jobsFilter.shootingFrom")}
                  value={local.shooting_date_from || ""}
                  onChange={(date) =>
                    update({
                      shooting_date_from: date || undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectStartDate")}
                  maxDate={local.shooting_date_to}
                />
              </div>
              <div className="space-y-2">
                <DatePicker
                  label={t("jobs.jobsFilter.shootingTo")}
                  value={local.shooting_date_to || ""}
                  onChange={(date) =>
                    update({
                      shooting_date_to: date || undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectEndDate")}
                  minDate={local.shooting_date_from}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("jobs.jobsFilter.eligible")}</Label>
                <SingleSelect
                  options={[
                    { value: "", label: t("jobs.jobsFilter.allJobs") },
                    { value: "true", label: t("jobs.jobsFilter.eligibleOnly") },
                    { value: "false", label: t("jobs.jobsFilter.notEligible") },
                  ]}
                  value={
                    local.eligible === undefined
                      ? ""
                      : local.eligible
                      ? "true"
                      : "false"
                  }
                  onChange={(val) =>
                    update({
                      eligible:
                        val === ""
                          ? undefined
                          : val === "true",
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.allJobs")}
                  searchable={false}
                />
              </div>
            </div>
          </div>

          {/* Professional & Location */}
          <div className="space-y-4">
 <div className="border-b border-gray-200/50 pb-2 ">
 <h3 className="text-sm sm:text-base font-semibold text-gray-900 ">
                {t("jobs.jobsFilter.section.professional")}
              </h3>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("jobs.jobsFilter.professions")}</Label>
                <MultiSelect
                  options={professions}
                  value={
                    Array.isArray(local.profession_ids)
                      ? local.profession_ids
                      : local.profession_ids
                      ? [local.profession_ids]
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      profession_ids: ids.length ? ids : undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectProfessions")}
                  loading={loadingLookups}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("jobs.jobsFilter.jobCountries")}</Label>
                <MultiSelect
                  options={countries}
                  value={
                    Array.isArray(local.country_ids)
                      ? local.country_ids
                      : local.country_ids
                      ? [local.country_ids]
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      country_ids: ids.length ? ids : undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectCountries")}
                  loading={loadingLookups}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("jobs.jobsFilter.talentResidenceCountries")}</Label>
                <MultiSelect
                  options={countries}
                  value={
                    Array.isArray(local.talent_country_ids)
                      ? local.talent_country_ids
                      : local.talent_country_ids
                      ? [local.talent_country_ids]
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      talent_country_ids: ids.length ? ids : undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectCountries")}
                  loading={loadingLookups}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("jobs.jobsFilter.nationalities")}</Label>
                <MultiSelect
                  options={nationalities}
                  value={
                    Array.isArray(local.nationality_ids)
                      ? local.nationality_ids
                      : local.nationality_ids
                      ? [local.nationality_ids]
                      : []
                  }
                  onChange={(ids) =>
                    update({
                      nationality_ids: ids.length ? ids : undefined,
                      page: 1,
                    })
                  }
                  placeholder={t("jobs.jobsFilter.selectNationalities")}
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
