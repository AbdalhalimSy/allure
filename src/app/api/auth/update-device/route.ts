import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const body = await req.json();

    const response = await fetchFromBackend(req, token, "/auth/update-device", {
      method: "POST",
      body,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
