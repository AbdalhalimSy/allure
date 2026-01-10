
import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const { id } = await params;
    const searchParams = Object.fromEntries(new URL(req.url).searchParams);

    const response = await fetchFromBackend(req, token, `/jobs/${id}`, { params: searchParams });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
