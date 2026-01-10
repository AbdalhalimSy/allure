import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const response = await fetchFromBackend(req, token, "/logout", { method: "POST" });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
