"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import { Input, Select, Button, NumericWithUnit } from "@/components/ui";
import {
  TbUser,
  TbSparkles,
  TbBriefcase,
  TbStar,
  TbPhoto,
  TbShieldCheck,
  TbBell,
  TbCreditCard,
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
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

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

type AppearanceForm = {
  profile_id: number;
  hair_color: string;
  hair_type: string;
  hair_length: string;
  eye_color: string;
  height_value: string;
  height_unit: string;
  shoe_size_value: string;
  shoe_size_unit: string;
  tshirt_size: string;
  pants_size: string;
  jacket_size: string;
  chest_value: string;
  chest_unit: string;
  bust_value: string;
  bust_unit: string;
  waist_value: string;
  waist_unit: string;
};

// Icons via react-icons (Tabler set)

export default function AppearancePage() {
  const { user, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appearanceOptions, setAppearanceOptions] = useState<AppearanceOptions>({
    hair_colors: [],
    hair_types: [],
    hair_lengths: [],
    eye_colors: [],
  });
  const [form, setForm] = useState<AppearanceForm>({
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

  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  // Fetch appearance options
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
    if (user?.profile?.id) {
      const p: any = user.profile as any;
      const toStr = (v: any) =>
        v === null || v === undefined ? "" : String(v);
      const numStr = (v: any) => {
        if (v === null || v === undefined) return "";
        const n = parseFloat(String(v));
        if (Number.isNaN(n)) return "";
        // remove trailing .0
        return (Math.round(n * 100) / 100).toString();
      };

      setForm((prev) => ({
        ...prev,
        profile_id: p.id,
        hair_color: toStr(p.hair_color || ""),
        hair_type: toStr(p.hair_type || ""),
        hair_length: toStr(p.hair_length || ""),
        eye_color: toStr(p.eye_color || ""),
        height_value: numStr(p.height),
        height_unit: prev.height_unit || "cm",
        shoe_size_value: numStr(p.shoe_size),
        shoe_size_unit: prev.shoe_size_unit || "EU",
        tshirt_size: toStr(p.tshirt_size || ""),
        pants_size: toStr(p.pants_size || ""),
        jacket_size: toStr(p.jacket_size || ""),
        chest_value: numStr(p.chest),
        chest_unit: prev.chest_unit || "cm",
        bust_value: numStr(p.bust),
        bust_unit: prev.bust_unit || "cm",
        waist_value: numStr(p.waist),
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
    const required: (keyof AppearanceForm)[] = [
      "hair_color",
      "hair_type",
      "hair_length",
      "eye_color",
      "height_value",
      "height_unit",
      "shoe_size_value",
      "shoe_size_unit",
      "tshirt_size",
      "pants_size",
      "jacket_size",
      "chest_value",
      "chest_unit",
      "bust_value",
      "bust_unit",
      "waist_value",
      "waist_unit",
    ];
    for (const key of required) {
      if (!String(form[key] ?? "").trim()) {
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
      // Send numeric-only values (remove units) per backend temporary requirement
      const payload = {
        profile_id: form.profile_id,
        hair_color: form.hair_color,
        hair_type: form.hair_type,
        hair_length: form.hair_length,
        eye_color: form.eye_color,
        height: form.height_value ? parseInt(form.height_value.trim(), 10) : null,
        shoe_size: form.shoe_size_value ? parseFloat(form.shoe_size_value.trim()) : null,
        tshirt_size: form.tshirt_size,
        pants_size: form.pants_size,
        jacket_size: form.jacket_size,
        chest: form.chest_value ? parseInt(form.chest_value.trim(), 10) : null,
        bust: form.bust_value ? parseInt(form.bust_value.trim(), 10) : null,
        waist: form.waist_value ? parseInt(form.waist_value.trim(), 10) : null,
      };
      const { data } = await apiClient.post("/profile/appearance", payload);
      if (data.status === "success") {
        toast.success(data.message || "Appearance updated");
        await fetchProfile();
      } else {
        toast.error(data.message || "Failed to update appearance");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update appearance"
      );
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setForm((prev) => ({
      ...prev,
      hair_color: "",
      hair_type: "",
      hair_length: "",
      eye_color: "",
      height: "",
      shoe_size: "",
      tshirt_size: "",
      pants_size: "",
      jacket_size: "",
      chest: "",
      bust: "",
      waist: "",
    }));
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <form onSubmit={onSubmit}>
          <AccountSection
            title="Appearance"
            description="Provide your physical appearance and measurements"
          >
            {/* Profile picture retained */}
            <AccountField
              label={
                <span className="inline-flex items-center">
                  <TbUser className="mr-2 h-4 w-4" /> Profile Picture
                </span>
              }
              description="Upload a professional photo"
            >
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 dark:border-white/10">
                  <div className="flex h-full w-full items-center justify-center bg-[#c49a47] text-3xl font-bold text-white">
                    JD
                  </div>
                </div>
                <div className="space-y-2">
                  <Button type="button" variant="secondary" className="text-sm">
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </AccountField>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Hair */}
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

              {/* Eyes and Height */}
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
                    setForm((p) => ({ ...p, height_unit: u }))
                  }
                  options={[
                    { value: "cm", label: "cm" },
                    { value: "in", label: "in" },
                  ]}
                  placeholder="e.g., 175"
                  required
                  min={0}
                  step={1}
                />
              </AccountField>

              {/* Sizes */}
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
                    setForm((p) => ({ ...p, shoe_size_unit: u }))
                  }
                  options={[
                    { value: "EU", label: "EU" },
                    { value: "US", label: "US" },
                    { value: "UK", label: "UK" },
                  ]}
                  placeholder="e.g., 43"
                  required
                  min={0}
                  step={0.5}
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

              {/* Measurements */}
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
                    setForm((p) => ({ ...p, chest_unit: u }))
                  }
                  options={[
                    { value: "cm", label: "cm" },
                    { value: "in", label: "in" },
                  ]}
                  placeholder="e.g., 95"
                  required
                  min={0}
                  step={1}
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
                  onUnitChange={(u) => setForm((p) => ({ ...p, bust_unit: u }))}
                  options={[
                    { value: "cm", label: "cm" },
                    { value: "in", label: "in" },
                  ]}
                  placeholder="e.g., 88"
                  required
                  min={0}
                  step={1}
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
                    setForm((p) => ({ ...p, waist_unit: u }))
                  }
                  options={[
                    { value: "cm", label: "cm" },
                    { value: "in", label: "in" },
                  ]}
                  placeholder="e.g., 72"
                  required
                  min={0}
                  step={1}
                />
              </AccountField>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </AccountSection>
        </form>
      </AccountLayout>
    </ProtectedRoute>
  );
}
