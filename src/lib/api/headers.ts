import { NextRequest, NextResponse } from "next/server";

interface HeaderOptions {
  includeContentType?: boolean;
  multipart?: boolean;
}

/**
 * Extract Bearer token from Authorization header
 * Returns null if header is missing or malformed
 */
export function extractBearerToken(request: NextRequest | Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7); // Remove "Bearer " prefix
}

/**
 * Get common API headers for backend requests
 * Includes v-api-key and Accept-Language headers
 */
export function getApiHeaders(
  request: NextRequest | Request,
  options: HeaderOptions = {}
): Record<string, string> {
  const acceptLanguage = request.headers.get("Accept-Language") || "en";
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "v-api-key": process.env.API_KEY || "",
    "Accept-Language": acceptLanguage,
  };

  // Only add Content-Type for non-multipart requests
  if (options.includeContentType && !options.multipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Get authenticated API headers including Authorization token
 */
export function getAuthApiHeaders(
  request: NextRequest | Request,
  token: string,
  options: HeaderOptions = {}
): Record<string, string> {
  return {
    ...getApiHeaders(request, options),
    "Authorization": `Bearer ${token}`,
  };
}

/**
 * Get headers for multipart FormData requests with authentication
 * Does NOT include Content-Type header - let fetch set the multipart boundary
 */
export function getMultipartHeaders(
  request: NextRequest | Request,
  token: string
): Record<string, string> {
  const acceptLanguage = request.headers.get("Accept-Language") || "en";
  return {
    "Accept": "application/json",
    "v-api-key": process.env.API_KEY || "",
    "Accept-Language": acceptLanguage,
    "Authorization": `Bearer ${token}`,
  };
}

/**
 * Extract and validate Bearer token in one call
 * Returns token and error response if validation fails
 */
export function extractAndValidateToken(request: NextRequest | Request): {
  token: string;
  error?: NextResponse;
} {
  const token = extractBearerToken(request);
  if (!token) {
    return {
      token: "",
      error: NextResponse.json(
        { error: "Unauthorized", code: "MISSING_AUTH_TOKEN" },
        { status: 401 }
      ),
    };
  }
  return { token };
}
