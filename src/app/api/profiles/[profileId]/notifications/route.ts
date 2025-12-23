import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";
import { logger } from "@/lib/utils/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params;

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${env.apiBaseUrl}/profiles/${profileId}/notifications?${queryString}`
      : `${env.apiBaseUrl}/profiles/${profileId}/notifications`;

      const headers = {
        ...getAuthApiHeaders(request, token),
        "x-profile-id": profileId,
      };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch notifications" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("Error fetching notifications", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
