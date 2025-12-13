"use client";

import { MutableRefObject, forwardRef, useState, useRef, useEffect } from "react";
import Loader from "./Loader";
import { useI18n } from "@/contexts/I18nContext";

interface Option {
  id: number;
  name: string;
  code?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  loading?: boolean;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value, onChange, placeholder, error, className = "", loading = false }, ref) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOptions = options.filter((option) => value.includes(option.id));

    const toggleOption = (optionId: number) => {
      if (value.includes(optionId)) {
        onChange(value.filter((id) => id !== optionId));
      } else {
        onChange([...value, optionId]);
      }
    };

    const removeOption = (optionId: number) => {
      onChange(value.filter((id) => id !== optionId));
    };

    return (
      <div ref={setRefs} className="relative w-full">
        <div
          className={`min-h-12 w-full rounded-lg border bg-white px-4 py-2 text-black transition-all focus-within:border-[#c49a47] focus-within:ring-[#c49a47] dark:bg-black dark:text-white ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          } ${className}`}
          onClick={() => !loading && setIsOpen(true)}
        >
          {loading ? (
            <div className="flex items-center gap-2 py-1">
              <Loader size="sm" variant="spinner" color="primary" />
              <span className="text-sm text-gray-500">{t("common.loading")}</span>
            </div>
          ) : selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[#c49a47]/10 px-3 py-1 text-sm font-medium text-[#c49a47]"
                >
                  {option.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option.id);
                    }}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="py-1 text-sm text-gray-500">{placeholder || t("ui.select")}</div>
          )}
        </div>

        {isOpen && !loading && (
          <div className="absolute z-9999 mt-2 max-h-60 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black">
            <div className="border-b border-gray-200 p-2 dark:border-gray-700">
              <input
                type="text"
                placeholder={t("ui.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#c49a47] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.id);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-start text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      value.includes(option.id) ? "bg-[#c49a47]/10 text-[#c49a47]" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    <span>{option.name}</span>
                    {value.includes(option.id) && (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-sm text-gray-500">{t("ui.noResults")}</div>
              )}
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
