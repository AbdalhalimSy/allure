import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    let queryString = searchParams.toString();

    // Fallback to profile ID header if not present in query
    if (!searchParams.has("profile_id")) {
      const headerProfileId = request.headers.get("x-profile-id");
      if (headerProfileId) {
        queryString = queryString
          ? `${queryString}&profile_id=${headerProfileId}`
          : `profile_id=${headerProfileId}`;
      }
    }

    const url = queryString
      ? `${BACKEND_URL}/profile/me?${queryString}`
      : `${BACKEND_URL}/profile/me`;

    // Forward request to backend with query parameters
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Profile fetch error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const body = await request.json();

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/profile/me`, {
      method: "PUT",
      headers: getAuthApiHeaders(request, token),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to update profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Profile update error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
