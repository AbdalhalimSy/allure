/**
 * React hook for handling language switch callbacks
 * 
 * Automatically registers a callback when component mounts and unregisters when unmounts
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { locale } = useI18n();
 *   const [data, setData] = useState([]);
 *   
 *   // Register refetch callback for language changes
 *   useLanguageSwitch(async (newLocale) => {
 *     const result = await fetchData(newLocale);
 *     setData(result);
 *   });
 *   
 *   return <div>{data.map(...)}</div>;
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { languageSwitchHandler } from '@/lib/api/language-switch-handler';

type LanguageSwitchCallback = (newLocale: string) => void | Promise<void>;

export function useLanguageSwitch(callback: LanguageSwitchCallback) {
  // Use ref to avoid re-registering on every render
  const callbackRef = useRef(callback);

  // Keep ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Register callback that calls the current ref
    const unsubscribe = languageSwitchHandler.onLocaleChange((newLocale) => {
      return callbackRef.current(newLocale);
    });

    // Unregister on unmount
    return unsubscribe;
  }, []); // Empty deps - only register once
}
