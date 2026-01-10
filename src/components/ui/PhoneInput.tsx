"use client";

import { forwardRef, useState, useEffect, InputHTMLAttributes, useMemo } from "react";
import worldCountries from "world-countries";
import { useI18n } from "@/contexts/I18nContext";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Convert world-countries data to our format and sort by name
const getAllCountries = (): Country[] => {
  return worldCountries
    .map((country) => ({
      code: country.cca2,
      name: country.name.common,
      dialCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
      flag: country.flag,
    }))
    .filter((country) => country.dialCode && country.dialCode !== "+") // Remove countries without valid dial codes
    .sort((a, b) => a.name.localeCompare(b.name));
};

const countries: Country[] = getAllCountries();

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string, countryCode: string) => void;
  error?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, error, className = "", ...props }, ref) => {
    const { t } = useI18n();
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    // Detect country based on IP (optional, fails silently)
    useEffect(() => {
      const detectCountry = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          // Use ip-api.com (HTTP). Works in local dev (http://localhost). For HTTPS production, consider a server proxy.
          const response = await fetch("http://ip-api.com/json/", {
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) return;

          const data = await response.json();
          const code: string | undefined = data?.countryCode || data?.country_code;
          if (code) {
            const detected = countries.find(
              (c) => c.code.toUpperCase() === code.toUpperCase()
            );
            if (detected) {
              setSelectedCountry(detected);
            }
          }
        } catch (err) {
          // Silently ignore; detection is optional and may fail due to CORS/rate limits
          console.debug("Country detection skipped", err);
        } finally {
          setIsInitialized(true);
        }
      };
      detectCountry();
    }, []);

    // Parse initial value if provided (only on mount or when value is explicitly changed by parent)
    useEffect(() => {
      // Only parse value from parent if it hasn't been initialized yet or if value is explicitly provided
      if (isInitialized && value) {
        const country = countries.find((c) => value.startsWith(c.dialCode));
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(value.replace(country.dialCode, "").trim());
        } else {
          setPhoneNumber(value);
        }
      }
    }, [value, isInitialized]);

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchQuery("");
      if (onChange) {
        onChange(`${country.dialCode} ${phoneNumber}`, country.code);
      }
    };

    // Filter countries based on search query
    const filteredCountries = useMemo(() => {
      if (!searchQuery) return countries;
      const query = searchQuery.toLowerCase();
      return countries.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.code.toLowerCase().includes(query)
      );
    }, [searchQuery]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = e.target.value;
      setPhoneNumber(newPhone);
      if (onChange) {
        onChange(`${selectedCountry.dialCode} ${newPhone}`, selectedCountry.code);
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".phone-input-container")) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div dir= "ltr" className="phone-input-container relative">
        <div className="relative flex">
          {/* Country Selector */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 rounded-s-lg border border-e-0 px-3 transition-all focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
 : "border-gray-300 focus:border-[#c49a47] focus:ring-[#c49a47]/20 "
 } bg-white `}
          >
            <span className="text-xl">{selectedCountry.flag}</span>
 <span className="text-sm font-medium text-gray-700 ">{selectedCountry.dialCode}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Phone Input */}
          <input
            ref={ref}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`flex-1 rounded-e-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
 : "border-gray-300 focus:border-[#c49a47] focus:ring-[#c49a47]/20 "
 } bg-white text-black ${className}`}
            placeholder={t("ui.phonePlaceholder") || "52 342 9898"}
            {...props}
          />
        </div>

        {/* Country Dropdown */}
        {isOpen && (
 <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg ">
            {/* Search Input */}
 <div className="sticky top-0 border-b border-gray-200 bg-white p-2 ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("ui.searchCountry") || "Search country..."}
 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 "
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
 className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors hover:bg-gray-100 ${
                      selectedCountry.code === country.code ? "bg-[#c49a47]/10" : ""
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
 <span className="flex-1 text-gray-700 ">{country.name}</span>
 <span className="text-gray-500 ">{country.dialCode}</span>
                  </button>
                ))
              ) : (
 <div className="px-4 py-8 text-center text-sm text-gray-500 ">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
