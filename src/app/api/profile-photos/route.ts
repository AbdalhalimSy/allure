import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

/**
 * GET /api/profile-photos
 * Fetch all profile photos for a specific profile
 *
 * BREAKING CHANGE: Now requires profile_id query parameter
 */
export async function GET(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);

    const response = await fetchFromBackend(req, token, "/profile-photos", { params });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}

/**
 * POST /api/profile-photos
 * Upload a new profile photo
 *
 * BREAKING CHANGE: Now requires profile_id in the request body
 */
export async function POST(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const formData = await req.formData();

    const response = await fetchFromBackend(req, token, "/profile-photos", {
      method: "POST",
      body: formData,
      multipart: true,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
