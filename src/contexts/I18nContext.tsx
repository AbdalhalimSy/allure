"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import enCommon from '@/lib/locales/en/common.json';
import enHome from '@/lib/locales/en/home.json';
import enAccount from '@/lib/locales/en/account.json';
import enJobs from '@/lib/locales/en/jobs.json';
import arCommon from '@/lib/locales/ar/common.json';
import arHome from '@/lib/locales/ar/home.json';
import arAccount from '@/lib/locales/ar/account.json';
import arJobs from '@/lib/locales/ar/jobs.json';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  // Aggregate split locale namespaces so t() stays backward-compatible
  en: { ...enCommon, ...enHome, ...enAccount, ...enJobs },
  ar: { ...arCommon, ...arHome, ...arAccount, ...arJobs },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Start with a deterministic locale on the server; read user preference after hydration
  const [locale, setLocale] = useState<Locale>('en');

  const changeLocale = useCallback((next: Locale) => {
    setLocale(next);
    try {
      localStorage.setItem('locale', next);
    } catch {}
  }, []);

  // Hydrate user preference without causing SSR/client markup divergence
  useEffect(() => {
    const readPreferredLocale = (): Locale => {
      try {
        const stored = localStorage.getItem('locale') as Locale | null;
        if (stored && (stored === 'en' || stored === 'ar')) {
          return stored;
        }
        return navigator.language?.startsWith('ar') ? 'ar' : 'en';
      } catch {
        return 'en';
      }
    };

    const preferred = readPreferredLocale();
    if (preferred !== locale) {
      setLocale(preferred);
    }
  }, [locale]);

  // Sync <html> attributes so global styles and fonts react correctly
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('lang', locale);
      html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.') as string[];
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // missing path fallback
      }
    }
    return typeof value === 'string' ? value : key;
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
