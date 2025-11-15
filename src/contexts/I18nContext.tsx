"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import enTranslations from '@/locales/en/common.json';
import arTranslations from '@/locales/ar/common.json';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize locale from localStorage, browser language, fallback to 'en'
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') as Locale | null : null;
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLocale(stored);
    } else if (!stored && typeof window !== 'undefined') {
      const navLang = navigator.language?.startsWith('ar') ? 'ar' : 'en';
      setLocale(navLang as Locale);
      localStorage.setItem('locale', navLang);
    }
  }, []);

  const changeLocale = useCallback((next: Locale) => {
    setLocale(next);
    try {
      localStorage.setItem('locale', next);
    } catch {}
  }, []);

  // Sync <html> attributes so global styles and fonts react correctly
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('lang', locale);
      html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
