import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const body = await req.json();

    logger.info("Sending basic information update", { body });

    const response = await fetchFromBackend(req, token, "/profile/basic-information", {
      method: "POST",
      body,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
