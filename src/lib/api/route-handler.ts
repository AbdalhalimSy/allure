import { NextRequest, NextResponse } from "next/server";
import { extractAndValidateToken, getAuthApiHeaders, getMultipartHeaders } from "./headers";
import { buildBackendUrl } from "@/lib/config/api-config";
import { errorResponse, handleBackendError } from "./response";
import { logger } from "@/lib/utils/logger";

/**
 * Context provided to authenticated route handlers
 */
export interface AuthenticatedRouteContext {
  token: string;
  profileId?: string;
  request: NextRequest;
}

/**
 * Base handler for authenticated API route handlers
 * Handles token extraction, validation, and common error handling
 *
 * @example
 * export async function GET(request: NextRequest) {
 *   return handleAuthenticatedRequest(request, async ({ token, request }) => {
 *     const response = await fetch(buildBackendUrl("/profile/me"), {
 *       headers: getAuthApiHeaders(request, token),
 *     });
 *     const data = await response.json();
 *     return NextResponse.json(data);
 *   });
 * }
 */
export async function handleAuthenticatedRequest(
  request: NextRequest,
  handler: (context: AuthenticatedRouteContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const { token, error } = extractAndValidateToken(request);
    if (error) return error;

    const profileId =
      request.headers.get("x-profile-id") ||
      new URL(request.url).searchParams.get("profile_id") ||
      undefined;

    return await handler({ token, profileId, request });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error("Route handler error:", error);
    return errorResponse(message, 500);
  }
}

/**
 * Helper to fetch from backend with standardized error handling
 */
export async function fetchFromBackend(
  request: NextRequest,
  token: string,
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    params?: Record<string, any>;
    multipart?: boolean;
  } = {}
): Promise<Response> {
  const url = buildBackendUrl(endpoint, options.params);
  const headers = options.multipart
    ? getMultipartHeaders(request, token)
    : getAuthApiHeaders(request, token, { includeContentType: !!options.body });

  return fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body
      ? options.multipart
        ? options.body // FormData
        : JSON.stringify(options.body)
      : undefined,
  });
}

/**
 * Helper to validate backend response and extract data
 */
export async function validateBackendResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Invalid response format: ${contentType || "unknown"}. Content: ${text.substring(0, 200)}`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const [error] = await handleBackendError(response);
    throw new Error(error.error);
  }

  return data;
}
