"use client";

import { useState, useRef, useEffect } from "react";
import { useCountryFilter, CountryCode } from "@/contexts/CountryFilterContext";
import { useI18n } from "@/contexts/I18nContext";

export default function CountryFilter() {
  const { selectedCountry, setSelectedCountry } = useCountryFilter();
  const { locale } = useI18n();
  const isRTL = locale === "ar";
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

  const countries = [
    { code: null as CountryCode, label: isRTL ? "الكل" : "All", flag: "🌍" },
    { code: "AE" as CountryCode, label: "UAE", flag: "🇦🇪" },
    { code: "SA" as CountryCode, label: "KSA", flag: "🇸🇦" },
    { code: "LB" as CountryCode, label: "LBN", flag: "🇱🇧" },
  ];

  const currentCountry = countries.find((c) => c.code === selectedCountry);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[#c49a47]/40 px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:border-[#c49a47]/80 hover:shadow-md hover:scale-105 active:scale-100 "
      >
        <span>{currentCountry?.flag}</span>
        <span>{currentCountry?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
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
        className={`absolute rtl:start-0 ltr:end-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#c49a47]/40 bg-white shadow-2xl transition-all duration-200 ease-in-out ltr:origin-top-right ${
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
