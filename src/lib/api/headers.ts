import { NextRequest } from "next/server";

/**
 * Get common API headers for backend requests
 * Includes v-api-key and Accept-Language headers
 */
export function getApiHeaders(request: NextRequest | Request): Record<string, string> {
  const acceptLanguage = request.headers.get("Accept-Language") || "en";
  
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "v-api-key": process.env.API_KEY || "",
    "Accept-Language": acceptLanguage,
  };
}

/**
 * Get authenticated API headers including Authorization token
 */
export function getAuthApiHeaders(request: NextRequest | Request, token: string): Record<string, string> {
  return {
    ...getApiHeaders(request),
    "Authorization": `Bearer ${token}`,
  };
}
