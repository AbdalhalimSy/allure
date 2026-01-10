import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders, extractBearerToken } from "@/lib/api/headers";
import { buildBackendUrl } from "@/lib/config/api-config";
import { successResponse } from "@/lib/api/response";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    const token = extractBearerToken(request);

    // If authenticated, use handleAuthenticatedRequest for consistency
    if (token) {
      return handleAuthenticatedRequest(request, async ({ token: authToken, request: req }) => {
        const response = await fetchFromBackend(req, authToken, "/talents", { params });
        const data = await validateBackendResponse(response);
        return successResponse(data);
      });
    }

    // Public endpoint - no authentication required
    const url = buildBackendUrl("/talents", params);
    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch talents" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching talents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
