import { NextResponse } from "next/server";

/**
 * Standardized API error response structure
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Standardized API success response structure
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  timestamp?: string;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: Record<string, any>
): [ApiErrorResponse, number] {
  return [
    {
      error: message,
      code: code || `ERROR_${status}`,
      details,
      timestamp: new Date().toISOString(),
    },
    status,
  ];
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Convert fetch response to standardized error response
 */
export async function handleBackendError(
  response: Response
): Promise<[ApiErrorResponse, number]> {
  try {
    const data = await response.json();
    const message = data.message || data.error || "Backend request failed";
    return createErrorResponse(message, response.status);
  } catch {
    return createErrorResponse(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
}

/**
 * Helper to return error as NextResponse
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string
): NextResponse {
  const [error, statusCode] = createErrorResponse(message, status, code);
  return NextResponse.json(error, { status: statusCode });
}

/**
 * Helper to return success as NextResponse
 */
export function successResponse<T>(data: T): NextResponse {
  return NextResponse.json(createSuccessResponse(data));
}
