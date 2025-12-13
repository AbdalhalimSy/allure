"use client";

import { MutableRefObject, forwardRef, useEffect, useRef, useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import Loader from "./Loader";
import { useI18n } from "@/contexts/I18nContext";

export type SingleSelectOption = {
  value: string | number;
  label: string;
};

interface SingleSelectProps {
  options: SingleSelectOption[];
  value: string | number | null | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  loading?: boolean;
  searchable?: boolean; // default true; when false, hides search box
  disabled?: boolean;
}

const SingleSelect = forwardRef<HTMLDivElement, SingleSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      error,
      className = "",
      loading = false,
      searchable = true,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const selected = options.find((o) => String(o.value) === String(value));

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = searchable
      ? options.filter((o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    const handleSelect = (opt: SingleSelectOption) => {
      onChange(opt.value);
      setIsOpen(false);
    };

    return (
      <div ref={setRefs} className={`relative w-full ${className}`}>
        <div
          className={`min-h-12 w-full rounded-lg border bg-white px-4 py-2 text-black transition-all focus-within:border-[#c49a47] focus-within:ring-[#c49a47] dark:bg-black dark:text-white ${
            error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !loading && !disabled && setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          role="combobox"
        >
          <div className="flex items-center justify-between gap-2">
            {loading ? (
              <div className="flex items-center gap-2 py-1">
                <Loader size="sm" variant="spinner" color="primary" />
                <span className="text-sm text-gray-500">{t("common.loading")}</span>
              </div>
            ) : selected ? (
              <div className="py-1 text-sm">{selected.label}</div>
            ) : (
              <div className="py-1 text-sm text-gray-500">{placeholder || t("ui.select")}</div>
            )}
            <ChevronDown 
              className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {isOpen && !loading && (
          <div
            className="absolute z-9999 mt-2 max-h-60 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black"
            id={listboxId}
            role="listbox"
          >
            {searchable && (
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
            )}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-start text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      String(value) === String(opt.value)
                        ? "bg-[#c49a47]/10 text-[#c49a47]"
                        : "text-gray-900 dark:text-white"
                    }`}
                    role="option"
                    aria-selected={String(value) === String(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {String(value) === String(opt.value) && (
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

SingleSelect.displayName = "SingleSelect";

export default SingleSelect;
