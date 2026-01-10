import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, profileId, request: req }) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);

    // Add profile ID to params if available
    if (profileId && !params.profile_id) {
      params.profile_id = profileId;
    }

    const response = await fetchFromBackend(req, token, "/profile/me", { params });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}

export async function PUT(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const body = await req.json();

    const response = await fetchFromBackend(req, token, "/profile/me", {
      method: "PUT",
      body,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
