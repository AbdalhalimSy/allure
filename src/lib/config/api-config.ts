/**
 * Centralized API configuration
 */

export const getBackendUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "https://allureportal.sawatech.ae/api"
  );
};

export const apiBaseUrl = getBackendUrl();

/**
 * Build a complete backend URL with optional query parameters
 */
export function buildBackendUrl(
  endpoint: string,
  params?: Record<string, any>
): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${apiBaseUrl}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}
