import { NextRequest } from "next/server";
import { handleAuthenticatedRequest, fetchFromBackend, validateBackendResponse } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";

/**
 * PUT /api/profile-photos/[id]
 * Update profile photo (mark as profile picture)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const { id } = await params;
    const body = await req.json();

    const response = await fetchFromBackend(req, token, `/profile-photos/${id}`, {
      method: "PUT",
      body,
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}

/**
 * DELETE /api/profile-photos/[id]
 * Delete a profile photo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleAuthenticatedRequest(request, async ({ token, request: req }) => {
    const { id } = await params;

    const response = await fetchFromBackend(req, token, `/profile-photos/${id}`, {
      method: "DELETE",
    });
    const data = await validateBackendResponse(response);

    return successResponse(data);
  });
}
