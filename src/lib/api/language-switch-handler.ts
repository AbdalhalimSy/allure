/**
 * Centralized Language Switch Handler
 * 
 * This module provides a centralized way to handle language changes across the application.
 * When the user switches languages, this handler:
 * 1. Updates localStorage
 * 2. Updates apiClient headers
 * 3. Triggers callbacks to refetch language-dependent data
 * 4. Ensures all API requests use the new language
 */

type LanguageSwitchCallback = (newLocale: string) => void | Promise<void>;

class LanguageSwitchHandler {
  private callbacks: Set<LanguageSwitchCallback> = new Set();
  private currentLocale: string = 'en';

  constructor() {
    // Initialize from localStorage on client
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('locale');
      if (stored === 'ar' || stored === 'en') {
        this.currentLocale = stored;
      }
    }
  }

  /**
   * Get the current locale
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Switch to a new locale and notify all registered callbacks
   */
  async switchLocale(newLocale: string): Promise<void> {
    if (this.currentLocale === newLocale) {
      return; // No change needed
    }

    this.currentLocale = newLocale;

    // Update localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('locale', newLocale);
      } catch (error) {
        console.error('Failed to update locale in localStorage:', error);
      }
    }

    // Notify all registered callbacks
    const promises: Promise<void>[] = [];
    this.callbacks.forEach((callback) => {
      const result = callback(newLocale);
      if (result instanceof Promise) {
        promises.push(result);
      }
    });

    // Wait for all callbacks to complete
    await Promise.all(promises);
  }

  /**
   * Register a callback to be called when locale changes
   * Returns an unsubscribe function
   */
  onLocaleChange(callback: LanguageSwitchCallback): () => void {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Trigger all callbacks manually (useful for testing or force refresh)
   */
  async triggerRefresh(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.callbacks.forEach((callback) => {
      const result = callback(this.currentLocale);
      if (result instanceof Promise) {
        promises.push(result);
      }
    });
    await Promise.all(promises);
  }

  /**
   * Clear all registered callbacks
   */
  clearCallbacks(): void {
    this.callbacks.clear();
  }
}

// Export singleton instance
export const languageSwitchHandler = new LanguageSwitchHandler();
