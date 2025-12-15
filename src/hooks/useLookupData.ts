/**
 * Custom hook for fetching lookup data (countries, nationalities, ethnicities, etc.)
 * Eliminates code duplication across multiple profile/filter components
 */

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import apiClient from '@/lib/api/client';

export interface LookupData {
  nationalities: any[];
  ethnicities: any[];
  countries: any[];
  hairColors?: any[];
  eyeColors?: any[];
  skinTones?: any[];
  bodyTypes?: any[];
  tattooMarks?: any[];
  scars?: any[];
}

interface LookupOptions {
  fetchNationalities?: boolean;
  fetchEthnicities?: boolean;
  fetchCountries?: boolean;
  fetchAppearanceOptions?: boolean;
  showError?: boolean;
}

const DEFAULT_OPTIONS: LookupOptions = {
  fetchNationalities: true,
  fetchEthnicities: true,
  fetchCountries: true,
  fetchAppearanceOptions: false,
  showError: true,
};

/**
 * Hook to fetch lookup data with configurable options
 * Reduces code duplication across BasicInformationContent, AppearanceContent, and filter components
 *
 * @example
 * const { data, loading, error } = useLookupData({
 *   fetchCountries: true,
 *   fetchNationalities: true,
 * });
 */
export function useLookupData(options: LookupOptions = {}) {
  const { locale } = useI18n();
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const [data, setData] = useState<Partial<LookupData>>({
    nationalities: [],
    ethnicities: [],
    countries: [],
    hairColors: [],
    eyeColors: [],
    skinTones: [],
    bodyTypes: [],
    tattooMarks: [],
    scars: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoading(true);
        setError(null);

        const requests: Promise<any>[] = [];
        const keys: ('countries' | 'nationalities' | 'ethnicities')[] = [];

        if (mergedOptions.fetchCountries) {
          requests.push(apiClient.get(`/lookups/countries?lang=${locale}`));
          keys.push('countries');
        }

        if (mergedOptions.fetchNationalities) {
          requests.push(apiClient.get(`/lookups/nationalities?lang=${locale}`));
          keys.push('nationalities');
        }

        if (mergedOptions.fetchEthnicities) {
          requests.push(apiClient.get(`/lookups/ethnicities?lang=${locale}`));
          keys.push('ethnicities');
        }

        if (requests.length === 0 && !mergedOptions.fetchAppearanceOptions) {
          setLoading(false);
          return;
        }

        const responses = await Promise.all(requests);

        const newData: Partial<LookupData> = { ...data };

        // Handle standard lookups
        responses.forEach((response, index) => {
          const key = keys[index];
          if (response.data.status === 'success') {
            newData[key] = response.data.data;
          }
        });

        // Handle appearance options separately if requested
        if (mergedOptions.fetchAppearanceOptions) {
          try {
            const appResponse = await apiClient.get(`/lookups/appearance-options?lang=${locale}`);
            if (appResponse.data.status === 'success' && appResponse.data.data) {
              const appOptions = appResponse.data.data;
              newData.hairColors = appOptions.hair_colors || [];
              newData.eyeColors = appOptions.eye_colors || [];
              newData.skinTones = appOptions.skin_tones || [];
              newData.bodyTypes = appOptions.body_types || [];
              newData.tattooMarks = appOptions.tattoo_marks || [];
              newData.scars = appOptions.scars || [];
            }
          } catch (error) {
            // Silently fail for appearance options
            console.error('Failed to fetch appearance options:', error);
          }
        }

        setData(newData);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load form options';
        setError(errorMsg);
        if (mergedOptions.showError) {
          console.error('❌ Failed to fetch lookups:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, [locale, mergedOptions.fetchCountries, mergedOptions.fetchEthnicities, mergedOptions.fetchNationalities, mergedOptions.fetchAppearanceOptions]);

  return { data, loading, error };
}
