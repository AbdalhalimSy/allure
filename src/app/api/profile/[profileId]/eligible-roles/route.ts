import { NextRequest, NextResponse } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const { profileId } = await params;

    const response = await fetchFromBackend(req, token, `/profile/${profileId}/eligible-roles`);
    const data = await validateBackendResponse(response);

    // Transform backend response to expected format
    return NextResponse.json({
      success: data.status === "success",
      message: data.message,
      data: data.data || [],
    });
  });
}
