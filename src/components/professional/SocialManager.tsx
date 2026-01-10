"use client";

import {
  TbPlus,
  TbX,
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandTwitter,
  TbBrandYoutube,
  TbBrandLinkedin,
  TbBrandTiktok,
} from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";
import { ProfessionSocial } from "@/types/profession";
import Input from "@/components/ui/Input";
import SingleSelect from "@/components/ui/SingleSelect";

const PLATFORM_OPTIONS = [
  {
    value: "Instagram",
    labelKey: "account.profession.socials.platform.instagram",
    icon: TbBrandInstagram,
  },
  {
    value: "Facebook",
    labelKey: "account.profession.socials.platform.facebook",
    icon: TbBrandFacebook,
  },
  {
    value: "Twitter",
    labelKey: "account.profession.socials.platform.twitter",
    icon: TbBrandTwitter,
  },
  {
    value: "YouTube",
    labelKey: "account.profession.socials.platform.youtube",
    icon: TbBrandYoutube,
  },
  {
    value: "LinkedIn",
    labelKey: "account.profession.socials.platform.linkedin",
    icon: TbBrandLinkedin,
  },
  {
    value: "TikTok",
    labelKey: "account.profession.socials.platform.tiktok",
    icon: TbBrandTiktok,
  },
  {
    value: "Snapchat",
    labelKey: "account.profession.socials.platform.snapchat",
    icon: null,
  },
  {
    value: "Other",
    labelKey: "account.profession.socials.platform.other",
    icon: null,
  },
];

interface SocialManagerProps {
  socials: ProfessionSocial[];
  onChange: (socials: ProfessionSocial[]) => void;
  disabled?: boolean;
  required?: boolean;
  description?: string;
}

export default function SocialManager({
  socials,
  onChange,
  disabled = false,
  required = false,
  description,
}: SocialManagerProps) {
  const { t } = useI18n();

  const handleAdd = () => {
    onChange([
      ...socials,
      { platform: "Instagram", url: "", followers: undefined },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(socials.filter((_, i) => i !== index));
  };

  const handleUpdate = (
    index: number,
    field: keyof ProfessionSocial,
    value: string | number | undefined
  ) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const getPlatformLabel = (platform: string) => {
    const option = PLATFORM_OPTIONS.find((p) => p.value === platform);
    return option ? t(option.labelKey) : platform;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 ">
            {t("account.profession.socials.label") || "Social Media Links"}
            {required && <span className="text-red-500 ms-1">*</span>}
          </label>
          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#c49a47] hover:bg-[#c49a47]/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <TbPlus className="w-4 h-4" />
          {t("account.profession.socials.add") || "Add Link"}
        </button>
      </div>

      {socials.length > 0 ? (
        <div className="space-y-4">
          {socials.map((social, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white space-y-3"
            >
              {/* Mobile: Stacked Layout, Desktop: Horizontal */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Platform Selector */}
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 sm:hidden">
                    {t("account.profession.socials.platform.label") || "Platform"}
                    <span className="text-red-500 ms-1">*</span>
                  </label>
                  <SingleSelect
                    options={PLATFORM_OPTIONS.map((option) => ({
                      value: option.value,
                      label: getPlatformLabel(option.value),
                    }))}
                    value={social.platform}
                    onChange={(value) =>
                      handleUpdate(index, "platform", String(value))
                    }
                    disabled={disabled}
                    searchable={true}
                  />
                </div>

                {/* URL Input */}
                <div className="w-full sm:flex-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 sm:hidden">
                    {t("account.profession.socials.url.label") || "Profile URL"}
                  </label>
                  <Input
                    type="url"
                    placeholder={t("forms.https") || "https://..."}
                    value={social.url}
                    onChange={(e) => handleUpdate(index, "url", e.target.value)}
                    disabled={disabled}
                  />
                </div>

                {/* Followers Input (Optional) */}
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 sm:hidden">
                    {t("account.profession.socials.followers") || "Followers (optional)"}
                  </label>
                  <Input
                    type="number"
                    placeholder={
                      t("account.profession.socials.followers") ||
                      "Followers (optional)"
                    }
                    value={social.followers?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleUpdate(
                        index,
                        "followers",
                        value ? parseInt(value) : undefined
                      );
                    }}
                    disabled={disabled}
                    min={0}
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="shrink-0 self-end sm:self-start p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={t("common.remove") || "Remove"}
                >
                  <TbX className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-3">
            {t("account.profession.socials.empty") ||
              "No social media links added yet"}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c49a47] hover:bg-[#c49a47]/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <TbPlus className="w-4 h-4" />
            {t("account.profession.socials.addFirst") || "Add Your First Link"}
          </button>
        </div>
      )}
    </div>
  );
}
