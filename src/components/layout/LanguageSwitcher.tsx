"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
  ];

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#c49a47]/40 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:border-[#c49a47]/80 hover:shadow-md hover:scale-105 active:scale-100 whitespace-nowrap"
      >
        <span className="text-base sm:text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        suppressHydrationWarning
        className={`fixed inset-x-4 bottom-24 sm:bottom-auto sm:inset-auto sm:absolute rtl:sm:start-0 ltr:sm:end-0 z-50 sm:mt-2 w-auto sm:w-48 max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-hidden rounded-2xl border border-[#c49a47]/40 bg-white shadow-2xl transition-all duration-200 ease-in-out sm:ltr:origin-top-right sm:rtl:origin-top-left ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => {
              setLocale(language.code);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-start transition-all duration-200 ease-in-out ${
              locale === language.code
                ? "bg-[#c49a47]/10 text-[#c49a47]"
                : "hover:bg-gray-100 "
            }`}
          >
            <span className="text-xl">{language.flag}</span>
            <span className="text-sm font-medium text-gray-900 ">
              {language.label}
            </span>
            {locale === language.code && (
              <svg
                className="w-5 h-5 ms-auto text-[#c49a47]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
