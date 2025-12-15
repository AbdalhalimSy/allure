import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";
import { logger } from "@/lib/utils/logger";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = queryString
      ? `${env.apiBaseUrl}/jobs?${queryString}`
      : `${env.apiBaseUrl}/jobs`;

    // Get authorization token from the request
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    // Forward request to backend with API key and auth token
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch jobs" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("Error fetching jobs", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
