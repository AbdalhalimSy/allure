/**
 * Centralized environment configuration
 * All environment variables should be accessed through this file
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  storageBaseUrl: string;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export const env: EnvironmentConfig = {
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://allureportal.sawatech.ae/api'),
  storageBaseUrl: getEnvVar('NEXT_PUBLIC_STORAGE_BASE_URL', 'https://allureportal.sawatech.ae/storage'),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate configuration on load
if (typeof window === 'undefined') {
  // Server-side validation
  console.log('Environment configuration loaded:', {
    nodeEnv: env.nodeEnv,
    apiBaseUrl: env.apiBaseUrl,
  });
}

export default env;
