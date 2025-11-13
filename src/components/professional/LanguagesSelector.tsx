"use client";

import { X } from "lucide-react";

const AVAILABLE_LANGUAGES = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
];

interface LanguagesSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguagesSelector({
  selectedLanguages,
  onChange,
}: LanguagesSelectorProps) {
  const handleSelect = (language: string) => {
    // Only single language selection
    onChange([language]);
  };

  const handleRemove = () => {
    onChange([]);
  };

  const selectedLanguage = selectedLanguages[0];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Language <span className="text-red-500">*</span>
      </label>

      {/* Selected Language */}
      {selectedLanguage && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full border border-[#c49a47]/20"
          >
            <span className="text-sm">{selectedLanguage}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="hover:bg-[#c49a47]/20 dark:hover:bg-[#c49a47]/30 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Language Dropdown */}
      <select
        value={selectedLanguage || ""}
        onChange={(e) => {
          if (e.target.value) handleSelect(e.target.value);
        }}
        className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 focus:border-[#c49a47]"
      >
        <option value="">Select a language...</option>
        {AVAILABLE_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
}
