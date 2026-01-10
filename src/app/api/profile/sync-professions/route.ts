import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, profileId, request: req }) => {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse("Content-Type must be multipart/form-data for syncing professions", 400);
    }

    const formData = await req.formData();
    
    // Ensure profile_id is in the form data
    if (!formData.has("profile_id") && profileId) {
      formData.append("profile_id", profileId);
    }

    const response = await fetchFromBackend(req, token, "/profile/sync-professions", {
      method: "POST",
      body: formData,
      multipart: true,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
