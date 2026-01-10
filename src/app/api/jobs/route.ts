import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);

    const response = await fetchFromBackend(req, token, "/jobs", { params });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
