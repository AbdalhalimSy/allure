"use client";

import { useEffect, useState } from "react";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import { Input, Select, Button, NumericWithUnit } from "@/components/ui";
import {
  TbScissors,
  TbEye,
  TbRulerMeasure,
  TbShoe,
  TbShirt,
  TbHanger,
} from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";

type AppearanceOption = {
  id: number;
  slug: string;
  name: string;
};

type AppearanceOptions = {
  hair_colors: AppearanceOption[];
  hair_types: AppearanceOption[];
  hair_lengths: AppearanceOption[];
  eye_colors: AppearanceOption[];
};

interface AppearanceContentProps {
  onNext: () => void;
  onBack: () => void;
}

type MeasurementUnit = "cm" | "in" | "EU";

type AppearanceFormState = {
  profile_id: number;
  hair_color: string;
  hair_type: string;
  hair_length: string;
  eye_color: string;
  height_value: string;
  height_unit: MeasurementUnit | "";
  shoe_size_value: string;
  shoe_size_unit: MeasurementUnit | "";
  tshirt_size: string;
  pants_size: string;
  jacket_size: string;
  chest_value: string;
  chest_unit: MeasurementUnit | "";
  bust_value: string;
  bust_unit: MeasurementUnit | "";
  waist_value: string;
  waist_unit: MeasurementUnit | "";
};

export default function AppearanceContent({
  onNext,
  onBack,
}: AppearanceContentProps) {
  const { user, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appearanceOptions, setAppearanceOptions] = useState<AppearanceOptions>({
    hair_colors: [],
    hair_types: [],
    hair_lengths: [],
    eye_colors: [],
  });
  const [form, setForm] = useState<AppearanceFormState>({
    profile_id: 0,
    hair_color: "",
    hair_type: "",
    hair_length: "",
    eye_color: "",
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
    const fetchAppearanceOptions = async () => {
      try {
        const locale = localStorage.getItem("locale") || "en";
        const { data } = await apiClient.get(`/lookups/appearance-options?lang=${locale}`);
        if (data.status === "success" && data.data) {
          setAppearanceOptions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch appearance options:", error);
      }
    };
    fetchAppearanceOptions();
  }, []);

  useEffect(() => {
    const profile = user?.profile;
    if (profile?.id) {
      const toStr = (value: string | number | null | undefined) =>
        value === null || value === undefined ? "" : String(value);
      const numStr = (value: string | number | null | undefined) => {
        if (value === null || value === undefined) return "";
        const numericValue = typeof value === "number" ? value : parseFloat(String(value));
        if (Number.isNaN(numericValue)) return "";
        return (Math.round(numericValue * 100) / 100).toString();
      };

      setForm((prev) => ({
        ...prev,
        profile_id: profile.id,
        hair_color: toStr(profile.hair_color || ""),
        hair_type: toStr(profile.hair_type || ""),
        hair_length: toStr(profile.hair_length || ""),
        eye_color: toStr(profile.eye_color || ""),
        height_value: numStr(profile.height),
        height_unit: prev.height_unit || "cm",
        shoe_size_value: numStr(profile.shoe_size),
        shoe_size_unit: prev.shoe_size_unit || "EU",
        tshirt_size: toStr(profile.tshirt_size || ""),
        pants_size: toStr(profile.pants_size || ""),
        jacket_size: toStr(profile.jacket_size || ""),
        chest_value: numStr(profile.chest),
        chest_unit: prev.chest_unit || "cm",
        bust_value: numStr(profile.bust),
        bust_unit: prev.bust_unit || "cm",
        waist_value: numStr(profile.waist),
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
    const requiredFields: Array<
      keyof Omit<
        AppearanceFormState,
        | "profile_id"
        | "height_unit"
        | "shoe_size_unit"
        | "chest_unit"
        | "bust_unit"
        | "waist_unit"
      >
    > = [
      "hair_color",
      "hair_type",
      "hair_length",
      "eye_color",
      "height_value",
      "shoe_size_value",
      "tshirt_size",
      "pants_size",
      "jacket_size",
      "chest_value",
      "bust_value",
      "waist_value",
    ];
    for (const key of requiredFields) {
      const value = form[key];
      if (typeof value !== "string" || !value.trim()) {
        return `Please fill ${key.replaceAll("_", " ")}`;
      }
    }
    if (!form.profile_id) return "Profile ID missing";
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
        hair_color: form.hair_color,
        hair_type: form.hair_type,
        hair_length: form.hair_length,
        eye_color: form.eye_color,
        height: form.height_value ? parseFloat(form.height_value.trim()) : null,
        shoe_size: form.shoe_size_value ? parseFloat(form.shoe_size_value.trim()) : null,
        tshirt_size: form.tshirt_size,
        pants_size: form.pants_size,
        jacket_size: form.jacket_size,
        chest: form.chest_value ? parseFloat(form.chest_value.trim()) : null,
        bust: form.bust_value ? parseFloat(form.bust_value.trim()) : null,
        waist: form.waist_value ? parseFloat(form.waist_value.trim()) : null,
      };
      const { data } = await apiClient.post("/profile/appearance", payload);
      if (data.status === "success") {
        toast.success(data.message || "Appearance updated");
        await fetchProfile();
        onNext();
      } else {
        toast.error(data.message || "Failed to update appearance");
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? ((error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ??
            (error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error)
          : null;
      toast.error(message || "Failed to update appearance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <AccountSection
        title="Appearance"
        description="Provide your physical appearance and measurements"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="mr-2 h-4 w-4" /> Hair Color
              </span>
            }
            required
          >
            <Select
              name="hair_color"
              value={form.hair_color}
              onChange={onChange}
              required
            >
              <option value="">Select hair color</option>
              {appearanceOptions.hair_colors.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </AccountField>
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="mr-2 h-4 w-4" /> Hair Type
              </span>
            }
            required
          >
            <Select
              name="hair_type"
              value={form.hair_type}
              onChange={onChange}
              required
            >
              <option value="">Select hair type</option>
              {appearanceOptions.hair_types.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </AccountField>
          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbScissors className="mr-2 h-4 w-4" /> Hair Length
              </span>
            }
            required
          >
            <Select
              name="hair_length"
              value={form.hair_length}
              onChange={onChange}
              required
            >
              <option value="">Select hair length</option>
              {appearanceOptions.hair_lengths.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbEye className="mr-2 h-4 w-4" /> Eye Color
              </span>
            }
            required
          >
            <Select
              name="eye_color"
              value={form.eye_color}
              onChange={onChange}
              required
            >
              <option value="">Select eye color</option>
              {appearanceOptions.eye_colors.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="mr-2 h-4 w-4" /> Height
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
                setForm((p) => ({ ...p, height_unit: u as MeasurementUnit }))
              }
              options={[
                { value: "cm", label: "cm" },
                { value: "in", label: "in" },
              ]}
              placeholder="e.g., 175.5"
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbShoe className="mr-2 h-4 w-4" /> Shoe Size
              </span>
            }
            required
          >
            <NumericWithUnit
              name="shoe_size_value"
              value={form.shoe_size_value}
              unit={form.shoe_size_unit}
              onChange={(v) =>
                setForm((p) => ({ ...p, shoe_size_value: v }))
              }
              onUnitChange={(u) =>
                setForm((p) => ({ ...p, shoe_size_unit: u as MeasurementUnit }))
              }
              options={[
                { value: "EU", label: "EU" },
                { value: "US", label: "US" },
                { value: "UK", label: "UK" },
              ]}
              placeholder="e.g., 43.5"
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbShirt className="mr-2 h-4 w-4" /> T‑Shirt Size
              </span>
            }
            required
          >
            <Select
              name="tshirt_size"
              value={form.tshirt_size}
              onChange={onChange}
              required
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </Select>
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbHanger className="mr-2 h-4 w-4" /> Pants Size
              </span>
            }
            required
          >
            <Input
              name="pants_size"
              type="text"
              placeholder="e.g., 32/32 or M"
              value={form.pants_size}
              onChange={onChange}
              required
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbHanger className="mr-2 h-4 w-4" /> Jacket Size
              </span>
            }
            required
          >
            <Input
              name="jacket_size"
              type="text"
              placeholder="e.g., 50 EU or L"
              value={form.jacket_size}
              onChange={onChange}
              required
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="mr-2 h-4 w-4" /> Chest
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
                setForm((p) => ({ ...p, chest_unit: u as MeasurementUnit }))
              }
              options={[
                { value: "cm", label: "cm" },
                { value: "in", label: "in" },
              ]}
              placeholder="e.g., 95.5"
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="mr-2 h-4 w-4" /> Bust
              </span>
            }
            required
          >
            <NumericWithUnit
              name="bust_value"
              value={form.bust_value}
              unit={form.bust_unit}
              onChange={(v) => setForm((p) => ({ ...p, bust_value: v }))}
              onUnitChange={(u) => setForm((p) => ({ ...p, bust_unit: u as MeasurementUnit }))}
              options={[
                { value: "cm", label: "cm" },
                { value: "in", label: "in" },
              ]}
              placeholder="e.g., 88.5"
              required
              min={0}
              step={0.1}
            />
          </AccountField>

          <AccountField
            label={
              <span className="inline-flex items-center">
                <TbRulerMeasure className="mr-2 h-4 w-4" /> Waist
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
                setForm((p) => ({ ...p, waist_unit: u as MeasurementUnit }))
              }
              options={[
                { value: "cm", label: "cm" },
                { value: "in", label: "in" },
              ]}
              placeholder="e.g., 72.5"
              required
              min={0}
              step={0.1}
            />
          </AccountField>
        </div>

        <div className="flex justify-between gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </AccountSection>
    </form>
  );
}
