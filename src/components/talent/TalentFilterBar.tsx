"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SingleSelect from "@/components/ui/SingleSelect";
import Button from "@/components/ui/Button";
import MultiSelect from "@/components/ui/MultiSelect";
import { useState, useEffect } from "react";
import SurfaceCard from "@/components/ui/SurfaceCard";
import Loader from "@/components/ui/Loader";
import { TalentFilters } from "@/types/talent";
import { Search, SlidersHorizontal } from "lucide-react";
import apiClient from "@/lib/api/client";
import { useI18n } from "@/contexts/I18nContext";

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

export default function TalentFilterBar({ value, onChange, onReset, loadingResults = false }: Props) {
  const { locale } = useI18n();
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
        const [
          countriesRes,
          nationalitiesRes,
          ethnicitiesRes,
          professionsRes,
          appearanceRes,
        ] = await Promise.all([
          apiClient.get(`/lookups/countries?lang=${locale}`),
          apiClient.get(`/lookups/nationalities?lang=${locale}`),
          apiClient.get(`/lookups/ethnicities?lang=${locale}`),
          apiClient.get(`/lookups/professions?lang=${locale}`),
          apiClient.get(`/lookups/appearance-options?lang=${locale}`),
        ]);

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
        console.error("❌ Failed to fetch lookups:", error);
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
    onChange(empty);
    onReset?.();
  };

  return (
    <div className="space-y-4">
      {/* Main Filters */}
      <SurfaceCard accent="gold" padding="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-10"
            />
            {(loadingResults || loadingLookups) && (
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <Loader size="sm" variant="spinner" color="primary" />
              </div>
            )}
          </div>

          {/* Gender */}
          <SingleSelect
            searchable={false}
            options={[
              { value: "", label: "All Genders" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            value={local.gender ?? ""}
            onChange={(val) => update({ gender: val ? (val as any) : undefined })}
          />

          {/* Advanced Toggle */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvanced ? "Hide" : "Advanced"}
          </Button>
        </div>
      </SurfaceCard>

      {/* Advanced Filters */}
      {showAdvanced && (
        <SurfaceCard accent="none" padding="p-4">
          <div className="grid gap-4 md:grid-cols-3">
          {/* Age Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={local.min_age || ""}
                onChange={(e) => update({ min_age: e.target.value ? Number(e.target.value) : undefined })}
                min="0"
                max="100"
              />
              <Input
                type="number"
                placeholder="Max"
                value={local.max_age || ""}
                onChange={(e) => update({ max_age: e.target.value ? Number(e.target.value) : undefined })}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Height Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={local.min_height || ""}
                onChange={(e) => update({ min_height: e.target.value ? Number(e.target.value) : undefined })}
                min="0"
                max="250"
              />
              <Input
                type="number"
                placeholder="Max"
                value={local.max_height || ""}
                onChange={(e) => update({ max_height: e.target.value ? Number(e.target.value) : undefined })}
                min="0"
                max="250"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
            <div className="flex gap-2">
              <Select
                value={local.sort_by || ""}
                onChange={(e) => update({ sort_by: (e.target.value as any) || undefined })}
                className="flex-1"
              >
                <option value="">Default</option>
                <option value="age">Age</option>
                <option value="height">Height</option>
                <option value="created_at">Newest</option>
                <option value="instagram_followers">Followers</option>
              </Select>
              <Select
                value={local.sort_order || "asc"}
                onChange={(e) => update({ sort_order: (e.target.value as any) || "asc" })}
                disabled={!local.sort_by}
              >
                <option value="asc">↑ Asc</option>
                <option value="desc">↓ Desc</option>
              </Select>
            </div>
          </div>

          {/* Professions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Professions</label>
            <MultiSelect
              options={professions}
              value={
                local.profession_ids
                  ? local.profession_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ profession_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select professions..."
              loading={loadingLookups}
            />
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Countries</label>
            <MultiSelect
              options={countries}
              value={
                local.country_ids
                  ? local.country_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ country_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select countries..."
              loading={loadingLookups}
            />
          </div>

          {/* Nationalities */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nationalities</label>
            <MultiSelect
              options={nationalities}
              value={
                local.nationality_ids
                  ? local.nationality_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ nationality_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select nationalities..."
              loading={loadingLookups}
            />
          </div>

          {/* Ethnicities */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ethnicities</label>
            <MultiSelect
              options={ethnicities}
              value={
                local.ethnicity_ids
                  ? local.ethnicity_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ ethnicity_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select ethnicities..."
              loading={loadingLookups}
            />
          </div>

          {/* Hair Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hair Colors</label>
            <MultiSelect
              options={hairColors}
              value={
                local.hair_color_ids
                  ? local.hair_color_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ hair_color_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select hair colors..."
              loading={loadingLookups}
            />
          </div>

          {/* Eye Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Eye Colors</label>
            <MultiSelect
              options={eyeColors}
              value={
                local.eye_color_ids
                  ? local.eye_color_ids.split(',').map(Number)
                  : []
              }
              onChange={(ids) => update({ eye_color_ids: ids.length > 0 ? ids.join(',') : undefined })}
              placeholder="Select eye colors..."
              loading={loadingLookups}
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="w-full"
            >
              Reset All Filters
            </Button>
          </div>
          </div>
        </SurfaceCard>
      )}
    </div>
  );
}
