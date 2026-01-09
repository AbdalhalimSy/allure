"use client";

import { useState, useRef, useEffect } from "react";
import { useCountryFilter, CountryCode } from "@/contexts/CountryFilterContext";
import { useI18n } from "@/contexts/I18nContext";
import { detectCountryCode } from "@/lib/utils/geo";
import CountryDetectModal from "./CountryDetectModal";

export default function CountryFilter() {
  const { selectedCountry, setSelectedCountry } = useCountryFilter();
  const { locale, setLocale } = useI18n();
  const isRTL = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDetectModal, setShowDetectModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<CountryCode>(null);

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

  const countries = [
    { code: null as CountryCode, label: isRTL ? "الكل" : "All", flag: "🌍" },
    { code: "AE" as CountryCode, label: "UAE", flag: "🇦🇪" },
    { code: "SA" as CountryCode, label: "KSA", flag: "🇸🇦" },
    { code: "LB" as CountryCode, label: "LBN", flag: "🇱🇧" },
  ];

  const currentCountry = countries.find((c) => c.code === selectedCountry);

  // 1) Detect on mount only; cache dedupes concurrent calls
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const detected = await detectCountryCode();
      if (cancelled) return;
      setDetectedCountry(detected);
    })();
    return () => { cancelled = true; };
  }, []);

  // 2) React to selectedCountry and detectedCountry changes without re-fetching
  useEffect(() => {
    if (!detectedCountry) return;

    // If user never picked a country, default to detected
    if (selectedCountry === null) {
      setSelectedCountry(detectedCountry);
      if (detectedCountry === "SA" && locale !== "ar") setLocale("ar");
      return;
    }

    // If user has a preference and it differs from detected, prompt on next visit
    try {
      const lastPromptAt = Number(localStorage.getItem("countryDetectPromptAt") || 0);
      const lastPromptFor = localStorage.getItem("countryDetectPromptFor");
      const DAY = 24 * 60 * 60 * 1000;
      const shouldPrompt = detectedCountry && selectedCountry && detectedCountry !== selectedCountry && (
        Date.now() - lastPromptAt > DAY || lastPromptFor !== detectedCountry
      );
      if (shouldPrompt) {
        setShowDetectModal(true);
      }
    } catch {}
  }, [selectedCountry, detectedCountry]);

  const handleKeep = () => {
    try {
      localStorage.setItem("countryDetectPromptAt", String(Date.now()));
      if (detectedCountry) localStorage.setItem("countryDetectPromptFor", detectedCountry);
    } catch {}
    setShowDetectModal(false);
  };

  const handleSwitch = () => {
    if (!detectedCountry) return handleKeep();
    setSelectedCountry(detectedCountry);
    if (detectedCountry === "SA" && locale !== "ar") setLocale("ar");
    try {
      localStorage.setItem("countryDetectPromptAt", String(Date.now()));
      localStorage.setItem("countryDetectPromptFor", detectedCountry);
    } catch {}
    setShowDetectModal(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <CountryDetectModal
        open={showDetectModal}
        currentLabel={currentCountry?.label || (isRTL ? "الكل" : "All")}
        detectedLabel={countries.find(c => c.code === detectedCountry)?.label || (isRTL ? "الكل" : "All")}
        onKeep={handleKeep}
        onSwitch={handleSwitch}
        onClose={() => setShowDetectModal(false)}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#c49a47]/40 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:border-[#c49a47]/80 hover:shadow-md hover:scale-105 active:scale-100 whitespace-nowrap"
      >
        <span className="text-base sm:text-lg">{currentCountry?.flag}</span>
        <span className="hidden sm:inline">{currentCountry?.label}</span>
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
        {countries.map((country) => (
          <button
            key={country.code || "all"}
            onClick={() => {
              setSelectedCountry(country.code);
              // Auto-switch to Arabic when KSA is selected
              if (country.code === "SA" && locale !== "ar") {
                setLocale("ar");
              }
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 ${
              selectedCountry === country.code
                ? "bg-[#c49a47]/5 text-[#c49a47] font-semibold"
                : "text-gray-700"
            }`}
          >
            <span className="text-xl">{country.flag}</span>
            <span>{country.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
