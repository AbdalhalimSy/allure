"use client";

import {
  TbX,
  TbCamera,
  TbVideo,
  TbMicrophone,
  TbLanguage,
  TbChevronDown,
} from "react-icons/tb";
import { Profession, ProfessionEntry } from "@/types/profession";
import { useI18n } from "@/contexts/I18nContext";
import MediaUploader from "@/components/ui/MediaUploader";
import LanguageManager from "./LanguageManager";
import SingleSelect from "@/components/ui/SingleSelect";

interface ProfessionEntryFormProps {
  index: number;
  professions: Profession[];
  entry: ProfessionEntry;
  onChange: (entry: ProfessionEntry) => void;
  onRemove: () => void;
  onToggle: () => void;
  isOpen: boolean;
  disabled?: boolean;
}

export default function ProfessionEntryForm({
  index,
  professions,
  entry,
  onChange,
  onRemove,
  onToggle,
  isOpen,
  disabled = false,
}: ProfessionEntryFormProps) {
  const { t } = useI18n();

  const translate = (
    key: string,
    fallback: string,
    options?: Record<string, string | number>
  ) => {
    let value = t(key);
    if (!value || value === key) value = fallback;
    
    // Interpolate variables like {{index}}, {{count}}, etc.
    if (options) {
      Object.keys(options).forEach((optionKey) => {
        const regex = new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g');
        value = value.replace(regex, String(options[optionKey]));
      });
    }
    
    return value;
  };

  const selectedProfession = professions.find(
    (p) => p.id === entry.professionId
  );
  const availableSubProfessions = selectedProfession?.sub_professions || [];
  const selectedSubProfession = entry.subProfessionId
    ? availableSubProfessions.find((sp) => sp.id === entry.subProfessionId)
    : null;

  // Determine requirements - combine parent (profession) and child (sub-profession)
  // If either requires a field, it is required (additive/union behavior)
  const professionRequirements = selectedProfession;
  const subProfessionRequirements = selectedSubProfession;

  const requiresPhoto = Boolean(
    professionRequirements?.requires_photo ||
      subProfessionRequirements?.requires_photo
  );
  const requiresVideo = Boolean(
    professionRequirements?.requires_video ||
      subProfessionRequirements?.requires_video
  );
  const requiresAudio = Boolean(
    professionRequirements?.requires_audio ||
      subProfessionRequirements?.requires_audio
  );
  const requiresLanguages = Boolean(
    professionRequirements?.requires_languages ||
      subProfessionRequirements?.requires_languages
  );
  // Social and size requirements are intentionally ignored per latest requirements

  const missingRequirements: string[] = [];

  if (!entry.professionId) {
    missingRequirements.push(
      translate("account.profession.selector.profession", "Profession")
    );
  }
  if (requiresPhoto && !entry.photo) {
    missingRequirements.push(
      translate("account.profession.uploads.photo", "Photo")
    );
  }
  if (requiresVideo && !entry.video) {
    missingRequirements.push(
      translate("account.profession.uploads.video", "Video")
    );
  }
  if (requiresAudio && !entry.audio) {
    missingRequirements.push(
      translate("account.profession.uploads.audio", "Audio")
    );
  }
  if (requiresLanguages && entry.languages.length === 0) {
    missingRequirements.push(
      translate("account.profession.languages.label", "Languages")
    );
  }
  // Socials and sizes are ignored

  const hasMissingRequiredFields = !isOpen && missingRequirements.length > 0;

  const handleProfessionChange = (professionId: number) => {
    onChange({
      ...entry,
      professionId,
      subProfessionId: null,
      photo: undefined,
      video: undefined,
      audio: undefined,
      languages: [],
      socials: entry.socials, // Preserve socials
    });
  };

  const handleSubProfessionChange = (subProfessionId: number | null) => {
    onChange({
      ...entry,
      subProfessionId,
      photo: undefined,
      video: undefined,
      audio: undefined,
      languages: [],
    });
  };

  const professionLabel = selectedSubProfession
    ? `${selectedProfession?.name} · ${selectedSubProfession.name}`
    : selectedProfession?.name ||
      translate("account.profession.selector.placeholder", "Select profession");

  const requirementPills = [
    requiresPhoto && {
      label: translate("account.profession.upload.photo", "Photo"),
      icon: TbCamera,
    },
    requiresVideo && {
      label: translate("account.profession.upload.video", "Video"),
      icon: TbVideo,
    },
    requiresAudio && {
      label: translate("account.profession.upload.audio", "Audio"),
      icon: TbMicrophone,
    },
    requiresLanguages && {
      label: translate("account.profession.languages.label", "Languages"),
      icon: TbLanguage,
    },
  ].filter(Boolean) as { label: string; icon: typeof TbCamera }[];

  return (
 <div className="rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 ">
      <div
        className={`flex items-start justify-between gap-3 px-5 py-4 ${
 isOpen ? "border-b border-gray-100 " : ""
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group flex flex-1 flex-col items-start gap-2 text-left focus:outline-none"
        >
 <div className="inline-flex items-center gap-2 rounded-full bg-[#c49a47]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#c49a47] ">
            <span>
              {translate(
                "account.profession.cardTitle",
                `Profession ${index}`,
                { index }
              )}
            </span>
            <TbChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
 <h4 className="text-lg font-semibold text-gray-900 ">
            {professionLabel}
          </h4>
          {requirementPills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {requirementPills.map(({ label, icon: Icon }) => (
                <span
                  key={label}
 className="inline-flex items-center gap-1.5 rounded-full bg-[#c49a47]/10 px-3 py-1 text-xs font-medium text-[#c49a47] "
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>
          )}
          {hasMissingRequiredFields && (
 <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ">
              <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
              {translate(
                "account.profession.validation.incomplete",
                "Complete required fields"
              )}
              <span className="text-[10px] font-bold opacity-80">
                · {missingRequirements.length}
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
 className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 "
        >
          <TbX className="h-4 w-4" />
          {translate("common.remove", "Remove")}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "overflow-visible" : "overflow-hidden"
        } transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: isOpen ? 3000 : 0 }}
      >
 <div className="grid gap-5 border-b border-gray-100 px-5 py-5 md:grid-cols-2">
          <div className="space-y-2">
 <label className="text-sm font-medium text-gray-800 ">
              {translate(
                "account.profession.selector.profession",
                "Profession"
              )}{" "}
              <span className="text-red-500">*</span>
            </label>
            <SingleSelect
              options={professions.map((profession) => ({
                value: profession.id,
                label: profession.name,
              }))}
              value={entry.professionId || null}
              onChange={(value) => handleProfessionChange(Number(value))}
              disabled={disabled}
              placeholder={translate(
                "forms.selectProfession",
                "Select profession..."
              )}
              searchable={true}
            />
          </div>

          <div className="space-y-2">
 <label className="text-sm font-medium text-gray-800 ">
              {translate(
                "account.profession.selector.subProfession",
                "Sub-Profession"
              )}
            </label>
            <SingleSelect
              options={[
                {
                  value: "",
                  label: translate(
                    "account.profession.selector.noneGeneral",
                    "None (General)"
                  ),
                },
                ...availableSubProfessions.map((subProfession) => ({
                  value: subProfession.id,
                  label: subProfession.name,
                })),
              ]}
              value={entry.subProfessionId || ""}
              onChange={(value) =>
                handleSubProfessionChange(value ? Number(value) : null)
              }
              disabled={disabled || availableSubProfessions.length === 0}
              placeholder={translate(
                "forms.selectSubProfession",
                "Select sub-profession..."
              )}
              searchable={true}
            />
            {availableSubProfessions.length === 0 && (
 <p className="text-xs text-gray-500 ">
                {translate(
                  "account.profession.selector.noSub",
                  "No sub-professions required for this role."
                )}
              </p>
            )}
          </div>
        </div>

        {(requiresPhoto || requiresVideo || requiresAudio) && (
          <div className="space-y-4 px-5 py-5">
            <div className="flex items-center justify-between">
 <h5 className="text-sm font-semibold text-gray-900 ">
                {translate("account.profession.media.title", "Media Uploads")}
              </h5>
 <p className="text-xs text-gray-500 ">
                {translate(
                  "account.profession.media.hint",
                  "Keep files under 50MB; use clear, recent media."
                )}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {requiresPhoto && (
 <div className="rounded-xl border border-gray-200 bg-white/70 p-4 ">
 <label className="mb-2 block text-sm font-medium text-gray-800 ">
                    {translate("account.profession.uploads.photo", "Photo")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <MediaUploader
                    type="photo"
                    value={entry.photo}
                    onChange={(file) =>
                      onChange({ ...entry, photo: file || undefined })
                    }
                    disabled={disabled}
                    required={requiresPhoto}
                    maxSize={5 * 1024 * 1024}
                  />
                </div>
              )}

              {requiresVideo && (
 <div className="rounded-xl border border-gray-200 bg-white/70 p-4 ">
 <label className="mb-2 block text-sm font-medium text-gray-800 ">
                    {translate("account.profession.uploads.video", "Video")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <MediaUploader
                    type="video"
                    value={entry.video}
                    onChange={(file) =>
                      onChange({ ...entry, video: file || undefined })
                    }
                    disabled={disabled}
                    required={requiresVideo}
                    maxSize={50 * 1024 * 1024}
                  />
                </div>
              )}

              {requiresAudio && (
 <div className="rounded-xl border border-gray-200 bg-white/70 p-4 ">
 <label className="mb-2 block text-sm font-medium text-gray-800 ">
                    {translate("account.profession.uploads.audio", "Audio")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <MediaUploader
                    type="audio"
                    value={entry.audio}
                    onChange={(file) =>
                      onChange({ ...entry, audio: file || undefined })
                    }
                    disabled={disabled}
                    required={requiresAudio}
                    maxSize={10 * 1024 * 1024}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {requiresLanguages && (
 <div className="border-t border-gray-100 px-5 py-5 ">
            <LanguageManager
              languages={entry.languages}
              onChange={(languages) => onChange({ ...entry, languages })}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
