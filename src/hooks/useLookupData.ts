/**
 * Custom hook for fetching lookup data (countries, nationalities, ethnicities, etc.)
 * Eliminates code duplication across multiple profile/filter components
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch';

export interface LookupData {
  nationalities: any[];
  ethnicities: any[];
  countries: any[];
  hairColors?: any[];
  hairTypes?: any[];
  hairLengths?: any[];
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
  
  // Stabilize options to prevent unnecessary re-fetches
  const mergedOptions = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  const [data, setData] = useState<Partial<LookupData>>({
    nationalities: [],
    ethnicities: [],
    countries: [],
    hairColors: [],
    hairTypes: [],
    hairLengths: [],
    eyeColors: [],
    skinTones: [],
    bodyTypes: [],
    tattooMarks: [],
    scars: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLookups = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const requests: Promise<any>[] = [];
        const keys: ('countries' | 'nationalities' | 'ethnicities')[] = [];

        if (mergedOptions.fetchCountries) {
          requests.push(apiClient.get(`/lookups/countries`));
          keys.push('countries');
        }

        if (mergedOptions.fetchNationalities) {
          requests.push(apiClient.get(`/lookups/nationalities`));
          keys.push('nationalities');
        }

        if (mergedOptions.fetchEthnicities) {
          requests.push(apiClient.get(`/lookups/ethnicities`));
          keys.push('ethnicities');
        }

        if (requests.length === 0 && !mergedOptions.fetchAppearanceOptions) {
          setLoading(false);
          return;
        }

        const responses = await Promise.all(requests);

        const newData: Partial<LookupData> = {
          nationalities: [],
          ethnicities: [],
          countries: [],
          hairColors: [],
          hairTypes: [],
          hairLengths: [],
          eyeColors: [],
          skinTones: [],
          bodyTypes: [],
          tattooMarks: [],
          scars: [],
        };

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
            const appResponse = await apiClient.get(`/lookups/appearance-options`);
            if (appResponse.data.status === 'success' && appResponse.data.data) {
              const appOptions = appResponse.data.data;
              newData.hairColors = appOptions.hair_colors || [];
              newData.hairTypes = appOptions.hair_types || [];
              newData.hairLengths = appOptions.hair_lengths || [];
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
  }, [mergedOptions]);

  // Initial fetch
  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  // Refetch when language changes
  useLanguageSwitch(fetchLookups);

  return { data, loading, error };
}
