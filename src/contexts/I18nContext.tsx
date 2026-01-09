"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import enCommon from '@/lib/locales/en/common.json';
import enHome from '@/lib/locales/en/home.json';
import enAccountMain from '@/lib/locales/en/account-main.json';
import enAccountBasic from '@/lib/locales/en/account-basic.json';
import enAccountAppearance from '@/lib/locales/en/account-appearance.json';
import enAccountBilling from '@/lib/locales/en/account-billing.json';
import enAccountSecurity from '@/lib/locales/en/account-security.json';
import enAccountProfession from '@/lib/locales/en/account-profession.json';
import enAccountExperience from '@/lib/locales/en/account-experience.json';
import enAccountPortfolio from '@/lib/locales/en/account-portfolio.json';
import enAccountProfilePhotos from '@/lib/locales/en/account-profilePhotos.json';
import enJobs from '@/lib/locales/en/jobs.json';
import enTalents from '@/lib/locales/en/talents.json';
import enAbout from '@/lib/locales/en/about.json';
import enContact from '@/lib/locales/en/contact.json';
import enFaq from '@/lib/locales/en/faq.json';
import enAuth from '@/lib/locales/en/auth.json';
import enPackages from '@/lib/locales/en/packages.json';
import enPolicies from '@/lib/locales/en/policies.json';
import arCommon from '@/lib/locales/ar/common.json';
import arHome from '@/lib/locales/ar/home.json';
import arAccountMain from '@/lib/locales/ar/account-main.json';
import arAccountBasic from '@/lib/locales/ar/account-basic.json';
import arAccountAppearance from '@/lib/locales/ar/account-appearance.json';
import arAccountBilling from '@/lib/locales/ar/account-billing.json';
import arAccountSecurity from '@/lib/locales/ar/account-security.json';
import arAccountProfession from '@/lib/locales/ar/account-profession.json';
import arAccountExperience from '@/lib/locales/ar/account-experience.json';
import arAccountPortfolio from '@/lib/locales/ar/account-portfolio.json';
import arAccountProfilePhotos from '@/lib/locales/ar/account-profilePhotos.json';
import arJobs from '@/lib/locales/ar/jobs.json';
import arTalents from '@/lib/locales/ar/talents.json';
import arAbout from '@/lib/locales/ar/about.json';
import arContact from '@/lib/locales/ar/contact.json';
import arFaq from '@/lib/locales/ar/faq.json';
import arAuth from '@/lib/locales/ar/auth.json';
import arPackages from '@/lib/locales/ar/packages.json';
import arPolicies from '@/lib/locales/ar/policies.json';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    ...enCommon,
    ...enHome,
    account: {
      ...enAccountMain,
      profession: enAccountProfession,
      experience: enAccountExperience,
      portfolio: enAccountPortfolio,
      profilePhotos: enAccountProfilePhotos,
      billing: enAccountBilling,
      basic: enAccountBasic,
      appearance: enAccountAppearance,
      security: enAccountSecurity,
    },
    ...enAuth,
    ...enJobs,
    ...enTalents,
    ...enAbout,
    ...enContact,
    ...enFaq,
    ...enPackages,
    ...enPolicies,
  },
  ar: {
    ...arCommon,
    ...arHome,
    account: {
      ...arAccountMain,
      profession: arAccountProfession,
      experience: arAccountExperience,
      portfolio: arAccountPortfolio,
      profilePhotos: arAccountProfilePhotos,
      billing: arAccountBilling,
      basic: arAccountBasic,
      appearance: arAccountAppearance,
      security: arAccountSecurity,
    },
    ...arAuth,
    ...arJobs,
    ...arTalents,
    ...arAbout,
    ...arContact,
    ...arFaq,
    ...arPackages,
    ...arPolicies,
  },
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
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale} suppressHydrationWarning>
        {children}
      </div>
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
