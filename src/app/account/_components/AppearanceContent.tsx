"use client";

import { useEffect, useState, useMemo } from "react";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import AccountPageLoader from "@/components/account/AccountPageLoader";
import { Input, SingleSelect, Button, NumericWithUnit } from "@/components/ui";
import type { SingleSelectOption } from "@/components/ui/SingleSelect";
import {
  TbScissors,
  TbEye,
  TbRulerMeasure,
  TbShoe,
  TbShirt,
  TbHanger,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import { useLookupData } from "@/hooks/useLookupData";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import {
  convertToApiUnit,
  convertFromApiUnit,
  convertBetweenUnits,
} from "@/lib/utils/unitConversion";

interface AppearanceContentProps {
  onNext: () => void;
  onBack: () => void;
}

type MeasurementUnit = "cm" | "in" | "EU";

type AppearanceFormState = {
  profile_id: number;
  hair_color_id: number | null;
  hair_type_id: number | null;
  hair_length_id: number | null;
  eye_color_id: number | null;
  height_value: string;
  height_unit: MeasurementUnit;
  shoe_size_value: string;
  shoe_size_unit: MeasurementUnit;
  tshirt_size: string;
  pants_size: string;
  jacket_size: string;
  chest_value: string;
  chest_unit: MeasurementUnit;
  bust_value: string;
  bust_unit: MeasurementUnit;
  waist_value: string;
  waist_unit: MeasurementUnit;
};

export default function AppearanceContent({
  onNext,
  onBack,
}: AppearanceContentProps) {
  const { user, fetchProfile } = useAuth();
  const { t } = useI18n();

  // Memoize lookup options to prevent unnecessary re-fetches
  const lookupOptions = useMemo(
    () => ({
      fetchAppearanceOptions: true,
      showError: false,
    }),
    []
  );

  const { data: lookupData, loading: loadingLookups } =
    useLookupData(lookupOptions);
  const [loading, setLoading] = useState(false);

  // Extract appearance options from lookupData with fallbacks
  const appearanceOptions = {
    hair_colors: lookupData.hairColors || [],
    hair_types: lookupData.hairTypes || [],
    hair_lengths: lookupData.hairLengths || [],
    eye_colors: lookupData.eyeColors || [],
  };

  const [form, setForm] = useState<AppearanceFormState>({
    profile_id: 0,
    hair_color_id: null,
    hair_type_id: null,
    hair_length_id: null,
    eye_color_id: null,
    height_value: "",
    height_unit: "cm",
    shoe_size_value: "",
    shoe_size_unit: "EU",
    tshirt_size: "",
    pants_size: "",
    jacket_size: "",
    chest_value: "",
    chest_unit: "cm",
    bust_value: "",
    bust_unit: "cm",
    waist_value: "",
    waist_unit: "cm",
  });

  useEffect(() => {
    const profile = user?.profile;
    if (profile?.id) {
      const toId = (value: number | string | null | undefined) => {
        if (value === null || value === undefined) return null;
        const numeric = typeof value === "string" ? parseInt(value, 10) : value;
        return Number.isNaN(numeric as number) ? null : (numeric as number);
      };

      const toStr = (value: string | number | null | undefined) =>
        value === null || value === undefined ? "" : String(value);

      setForm((prev) => ({
        ...prev,
        profile_id: profile.id,
        hair_color_id: toId(profile.hair_color_id),
        hair_type_id: toId(profile.hair_type_id),
        hair_length_id: toId(profile.hair_length_id),
        eye_color_id: toId(profile.eye_color_id),
        // API stores in cm, convert to user's preferred unit
        height_value: convertFromApiUnit(
          profile.height,
          prev.height_unit || "cm",
          "length"
        ),
        height_unit: prev.height_unit || "cm",
        shoe_size_value: convertFromApiUnit(
          profile.shoe_size,
          prev.shoe_size_unit || "EU",
          "shoe_size"
        ),
        shoe_size_unit: prev.shoe_size_unit || "EU",
        tshirt_size: toStr(profile.tshirt_size || ""),
        pants_size: toStr(profile.pants_size || ""),
        jacket_size: toStr(profile.jacket_size || ""),
        chest_value: convertFromApiUnit(
          profile.chest,
          prev.chest_unit || "cm",
          "length"
        ),
        chest_unit: prev.chest_unit || "cm",
        bust_value: convertFromApiUnit(
          profile.bust,
          prev.bust_unit || "cm",
          "length"
        ),
        bust_unit: prev.bust_unit || "cm",
        waist_value: convertFromApiUnit(
          profile.waist,
          prev.waist_unit || "cm",
          "length"
        ),
        waist_unit: prev.waist_unit || "cm",
      }));
    }
  }, [user]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    const requiredIds: Array<keyof AppearanceFormState> = [
      "hair_color_id",
      "hair_type_id",
      "hair_length_id",
      "eye_color_id",
    ];
    for (const key of requiredIds) {
      const value = form[key];
      if (value === null || value === undefined) {
        return `Please select ${key.replace("_id", "").replaceAll("_", " ")}`;
      }
    }

    const requiredValues: Array<keyof AppearanceFormState> = [
      "height_value",
      "shoe_size_value",
      "tshirt_size",
      "pants_size",
      "jacket_size",
      "chest_value",
      "bust_value",
      "waist_value",
    ];

    for (const key of requiredValues) {
      const value = form[key] as string;
      if (typeof value !== "string" || !value.trim()) {
        return `Please fill ${key.replaceAll("_", " ")}`;
      }
    }

    if (!form.profile_id) return t("account.appearance.errors.profileMissing");
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        profile_id: form.profile_id,
        hair_color_id: form.hair_color_id,
        hair_type_id: form.hair_type_id,
        hair_length_id: form.hair_length_id,
        eye_color_id: form.eye_color_id,
        height: form.height_value
          ? convertToApiUnit(form.height_value, form.height_unit, "length")
          : null,
        shoe_size: form.shoe_size_value
          ? convertToApiUnit(
              form.shoe_size_value,
              form.shoe_size_unit,
              "shoe_size"
            )
          : null,
        tshirt_size: form.tshirt_size,
        pants_size: form.pants_size,
        jacket_size: form.jacket_size,
        chest: form.chest_value
          ? convertToApiUnit(form.chest_value, form.chest_unit, "length")
          : null,
        bust: form.bust_value
          ? convertToApiUnit(form.bust_value, form.bust_unit, "length")
          : null,
        waist: form.waist_value
          ? convertToApiUnit(form.waist_value, form.waist_unit, "length")
          : null,
      };
      const { data } = await apiClient.post("/profile/appearance", payload);
      if (data.status === "success") {
        toast.success(t("account.appearance.success"));
        await fetchProfile();
        onNext();
      } else {
        toast.error(t("account.appearance.errors.save"));
      }
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        t("account.appearance.errors.save")
      );
      toast.error(message || t("account.appearance.errors.save"));
    } finally {
      setLoading(false);
    }
  };

  if (loadingLookups) {
    return <AccountPageLoader message={t("account.appearance.loading")} />;
  }

  return (
    <form onSubmit={onSubmit}>
      <AccountSection
        title={t("account.appearance.title")}
        description={t("account.appearance.description")}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.hairColor")}
              </span>
            }
            required
          >
            <SingleSelect
              options={appearanceOptions.hair_colors.map(
                (option): SingleSelectOption => ({
                  value: option.id ?? option.slug ?? option.name,
                  label: option.name,
                })
              )}
              value={form.hair_color_id}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  hair_color_id: value ? Number(value) : null,
                }))
              }
              placeholder={t("forms.selectHairColor")}
              searchable={false}
            />
          </AccountField>
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.hairType")}
              </span>
            }
            required
          >
            <SingleSelect
              options={appearanceOptions.hair_types.map(
                (option): SingleSelectOption => ({
                  value: option.id ?? option.slug ?? option.name,
                  label: option.name,
                })
              )}
              value={form.hair_type_id}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  hair_type_id: value ? Number(value) : null,
                }))
              }
              placeholder={t("forms.selectHairType")}
              searchable={false}
            />
          </AccountField>
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.hairLength")}
              </span>
            }
            required
          >
            <SingleSelect
              options={appearanceOptions.hair_lengths.map(
                (option): SingleSelectOption => ({
                  value: option.id ?? option.slug ?? option.name,
                  label: option.name,
                })
              )}
              value={form.hair_length_id}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  hair_length_id: value ? Number(value) : null,
                }))
              }
              placeholder={t("forms.selectHairLength")}
              searchable={false}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbEye className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.eyeColor")}
              </span>
            }
            required
          >
            <SingleSelect
              options={appearanceOptions.eye_colors.map(
                (option): SingleSelectOption => ({
                  value: option.id ?? option.slug ?? option.name,
                  label: option.name,
                })
              )}
              value={form.eye_color_id}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  eye_color_id: value ? Number(value) : null,
                }))
              }
              placeholder={t("forms.selectEyeColor")}
              searchable={false}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.height")}
              </span>
            }
            required
          >
            <NumericWithUnit
              name="height_value"
              value={form.height_value}
              unit={form.height_unit}
              onChange={(v) => setForm((p) => ({ ...p, height_value: v }))}
              onUnitChange={(u) =>
                setForm((p) => ({
                  ...p,
                  height_value: convertBetweenUnits(
                    p.height_value,
                    p.height_unit as any,
                    u as any,
                    "length"
                  ),
                  height_unit: u as MeasurementUnit,
                }))
              }
              options={[
                { value: "cm", label: t("units.cm") },
                { value: "in", label: t("units.in") },
              ]}
              placeholder={t("account.appearance.placeholders.height")}
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbShoe className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.shoeSize")}
              </span>
            }
            required
          >
            <NumericWithUnit
              name="shoe_size_value"
              value={form.shoe_size_value}
              unit={form.shoe_size_unit}
              onChange={(v) => setForm((p) => ({ ...p, shoe_size_value: v }))}
              onUnitChange={(u) =>
                setForm((p) => ({ ...p, shoe_size_unit: u as MeasurementUnit }))
              }
              options={[{ value: "EU", label: t("units.eu") }]}
              placeholder={t("account.appearance.placeholders.shoe")}
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbShirt className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.tshirtSize")}
              </span>
            }
            required
          >
            <SingleSelect
              options={[
                { value: "XXS", label: t("sizes.xxs") },
                { value: "XS", label: t("sizes.xs") },
                { value: "S", label: t("sizes.s") },
                { value: "M", label: t("sizes.m") },
                { value: "L", label: t("sizes.l") },
                { value: "XL", label: t("sizes.xl") },
                { value: "XXL", label: t("sizes.xxl") },
                { value: "XXXL", label: t("sizes.xxxl") },
                { value: "4XL", label: t("sizes.4xl") },
                { value: "5XL", label: t("sizes.5xl") },
              ]}
              value={form.tshirt_size}
              onChange={(value) =>
                onChange({
                  target: { name: "tshirt_size", value: String(value) },
                } as any)
              }
              placeholder={t("forms.selectSize")}
              searchable={false}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbHanger className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.pantsSize")}
              </span>
            }
            required
          >
            <SingleSelect
              options={[
                { value: "XXS", label: t("sizes.xxs") },
                { value: "XS", label: t("sizes.xs") },
                { value: "S", label: t("sizes.s") },
                { value: "M", label: t("sizes.m") },
                { value: "L", label: t("sizes.l") },
                { value: "XL", label: t("sizes.xl") },
                { value: "XXL", label: t("sizes.xxl") },
                { value: "XXXL", label: t("sizes.xxxl") },
                { value: "4XL", label: t("sizes.4xl") },
                { value: "5XL", label: t("sizes.5xl") },
              ]}
              value={form.pants_size}
              onChange={(value) =>
                onChange({
                  target: { name: "pants_size", value: String(value) },
                } as any)
              }
              placeholder={t("forms.selectSize")}
              searchable={false}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbHanger className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.jacketSize")}
              </span>
            }
            required
          >
            <SingleSelect
              options={[
                { value: "XXS", label: t("sizes.xxs") },
                { value: "XS", label: t("sizes.xs") },
                { value: "S", label: t("sizes.s") },
                { value: "M", label: t("sizes.m") },
                { value: "L", label: t("sizes.l") },
                { value: "XL", label: t("sizes.xl") },
                { value: "XXL", label: t("sizes.xxl") },
                { value: "XXXL", label: t("sizes.xxxl") },
                { value: "4XL", label: t("sizes.4xl") },
                { value: "5XL", label: t("sizes.5xl") },
              ]}
              value={form.jacket_size}
              onChange={(value) =>
                onChange({
                  target: { name: "jacket_size", value: String(value) },
                } as any)
              }
              placeholder={t("forms.selectSize")}
              searchable={false}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.chest")}
              </span>
            }
            required
          >
            <NumericWithUnit
              name="chest_value"
              value={form.chest_value}
              unit={form.chest_unit}
              onChange={(v) => setForm((p) => ({ ...p, chest_value: v }))}
              onUnitChange={(u) =>
                setForm((p) => ({
                  ...p,
                  chest_value: convertBetweenUnits(
                    p.chest_value,
                    p.chest_unit as any,
                    u as any,
                    "length"
                  ),
                  chest_unit: u as MeasurementUnit,
                }))
              }
              options={[
                { value: "cm", label: t("units.cm") },
                { value: "in", label: t("units.in") },
              ]}
              placeholder={t("account.appearance.placeholders.chest")}
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.bust")}
              </span>
            }
            required
          >
            <NumericWithUnit
              name="bust_value"
              value={form.bust_value}
              unit={form.bust_unit}
              onChange={(v) => setForm((p) => ({ ...p, bust_value: v }))}
              onUnitChange={(u) =>
                setForm((p) => ({
                  ...p,
                  bust_value: convertBetweenUnits(
                    p.bust_value,
                    p.bust_unit as any,
                    u as any,
                    "length"
                  ),
                  bust_unit: u as MeasurementUnit,
                }))
              }
              options={[
                { value: "cm", label: t("units.cm") },
                { value: "in", label: t("units.in") },
              ]}
              placeholder={t("account.appearance.placeholders.bust")}
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="me-2 h-4 w-4" />{" "}
                {t("account.appearance.fields.waist")}
              </span>
            }
            required
          >
            <NumericWithUnit
              name="waist_value"
              value={form.waist_value}
              unit={form.waist_unit}
              onChange={(v) => setForm((p) => ({ ...p, waist_value: v }))}
              onUnitChange={(u) =>
                setForm((p) => ({
                  ...p,
                  waist_value: convertBetweenUnits(
                    p.waist_value,
                    p.waist_unit as any,
                    u as any,
                    "length"
                  ),
                  waist_unit: u as MeasurementUnit,
                }))
              }
              options={[
                { value: "cm", label: t("units.cm") },
                { value: "in", label: t("units.in") },
              ]}
              placeholder={t("account.appearance.placeholders.waist")}
              required
              min={0}
              step={0.1}
            />
          </AccountField>
        </div>

        <div className="flex justify-between gap-3 border-t border-gray-200 pt-6 ">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={loading}
          >
            {t("common.back")}
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading
              ? t("account.buttons.saving")
              : t("common.saveAndContinue")}
          </Button>
        </div>
      </AccountSection>
    </form>
  );
}
