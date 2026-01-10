import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, profileId, request: req }) => {
    if (!profileId) {
      return errorResponse("Profile ID is required", 400);
    }

    const response = await fetchFromBackend(req, token, `/profile/${profileId}/portfolio`);
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
