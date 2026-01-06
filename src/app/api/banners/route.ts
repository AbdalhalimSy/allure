import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

/**
 * GET /api/banners
 * Public endpoint to fetch active banners
 * No authentication required as per API documentation
 */
export async function GET(request: NextRequest) {
  try {
    const url = `${BACKEND_URL}/banners`;

    // Forward request to backend with API headers
    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(request),
      cache: 'no-store', // Don't cache banners to ensure fresh content
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch banners" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
