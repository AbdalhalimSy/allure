"use client";

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'ar' as const, label: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[#c49a47]/40 px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-[#c49a47]/80 dark:text-white"
      >
        <span>{currentLang?.flag}</span>
        <span>{currentLang?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#c49a47]/40 bg-white shadow-2xl dark:border-[#c49a47]/20 dark:bg-gray-900">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLocale(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                locale === language.code
                  ? 'bg-[#c49a47]/10 text-[#c49a47]'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{language.label}</span>
              {locale === language.code && (
                <svg className="w-5 h-5 ml-auto text-[#c49a47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
