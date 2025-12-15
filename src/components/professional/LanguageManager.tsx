"use client";

import { useState } from "react";
import { TbX, TbMicrophone } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";
import { ProfessionLanguage } from "@/types/profession";
import MediaUploader from "@/components/ui/MediaUploader";
import SingleSelect from "@/components/ui/SingleSelect";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "hi", label: "Hindi" },
];

interface LanguageManagerProps {
  languages: ProfessionLanguage[];
  onChange: (languages: ProfessionLanguage[]) => void;
  disabled?: boolean;
}

export default function LanguageManager({
  languages,
  onChange,
  disabled = false,
}: LanguageManagerProps) {
  const { t, locale } = useI18n();
  const [showVoiceUpload, setShowVoiceUpload] = useState<number | null>(null);

  const availableLanguages = LANGUAGE_OPTIONS.filter(
    (lang) => !languages.some((l) => l.code === lang.code)
  );

  const handleAddLanguage = (code: string) => {
    if (!languages.some((l) => l.code === code)) {
      onChange([...languages, { code }]);
    }
  };

  const handleRemoveLanguage = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
    if (showVoiceUpload === index) {
      setShowVoiceUpload(null);
    }
  };

  const handleVoiceChange = (index: number, file: File | null) => {
    const updated = [...languages];
    if (file) {
      updated[index] = { ...updated[index], voice: file };
    } else {
      const { voice, ...rest } = updated[index];
      if (voice !== undefined) {
        updated[index] = rest;
      }
    }
    onChange(updated);
  };

  const getLanguageLabel = (code: string) => {
    return LANGUAGE_OPTIONS.find((l) => l.code === code)?.label || code;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("account.profession.languages.label") || "Languages"}
      </label>

      {/* Language Pills */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="group relative inline-flex items-center gap-2 px-3 py-2 bg-[#c49a47] text-white rounded-lg text-sm font-medium"
            >
              <span>{getLanguageLabel(lang.code)}</span>

              {lang.voice && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              )}

              <button
                type="button"
                onClick={() =>
                  setShowVoiceUpload(showVoiceUpload === index ? null : index)
                }
                disabled={disabled}
                className="p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-50"
                title="Add voice sample"
              >
                <TbMicrophone className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                disabled={disabled}
                className="p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-50"
              >
                <TbX className="w-3.5 h-3.5" />
              </button>

              {showVoiceUpload === index && (
                <div className="absolute top-full start-0 mt-2 w-80 z-10 bg-white dark:bg-black rounded-lg shadow-xl border border-gray-200 dark:border-white/10 p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {t("account.profession.languageManager.voiceSample") ||
                      "Upload voice sample for"}{" "}
                    {getLanguageLabel(lang.code)}
                  </p>
                  <MediaUploader
                    type="audio"
                    value={lang.voice}
                    onChange={(file) => handleVoiceChange(index, file)}
                    disabled={disabled}
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Language Dropdown */}
      {availableLanguages.length > 0 && (
        <div className="relative">
          <SingleSelect
            options={availableLanguages.map((lang) => ({
              value: lang.code,
              label: lang.label,
            }))}
            value=""
            onChange={(value) => handleAddLanguage(String(value))}
            disabled={disabled}
            placeholder={
              t("account.profession.languageManager.add") || "+ Add Language"
            }
            searchable={true}
          />
        </div>
      )}

      {languages.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {t("account.profession.languageManager.empty") ||
            "No languages added yet"}
        </p>
      )}
    </div>
  );
}
