"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type CountryCode = 'AE' | 'SA' | 'LB' | null; // null means "All Countries"

interface CountryFilterContextType {
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
  getCountryId: () => number | null;
  getCountryName: () => string;
}

const COUNTRY_MAP = {
  'AE': { id: 2, name: 'UAE' },
  'SA': { id: 191, name: 'KSA' },
  'LB': { id: 125, name: 'LBN' },
} as const;

const CountryFilterContext = createContext<CountryFilterContextType | undefined>(undefined);

export function CountryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState<CountryCode>(null);

  const setSelectedCountry = useCallback((country: CountryCode) => {
    setSelectedCountryState(country);
    try {
      if (country === null) {
        localStorage.removeItem('countryFilter');
      } else {
        localStorage.setItem('countryFilter', country);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Hydrate user preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('countryFilter') as CountryCode | null;
      if (stored && (stored === 'AE' || stored === 'SA' || stored === 'LB')) {
        setSelectedCountryState(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const getCountryId = useCallback((): number | null => {
    if (selectedCountry === null) return null;
    return COUNTRY_MAP[selectedCountry].id;
  }, [selectedCountry]);

  const getCountryName = useCallback((): string => {
    if (selectedCountry === null) return 'All';
    return COUNTRY_MAP[selectedCountry].name;
  }, [selectedCountry]);

  return (
    <CountryFilterContext.Provider value={{ selectedCountry, setSelectedCountry, getCountryId, getCountryName }}>
      {children}
    </CountryFilterContext.Provider>
  );
}

export function useCountryFilter() {
  const context = useContext(CountryFilterContext);
  if (context === undefined) {
    throw new Error('useCountryFilter must be used within a CountryFilterProvider');
  }
  return context;
}
