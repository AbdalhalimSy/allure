import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

interface ApiError { error: string; details?: string; }

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

function resolveProfileId(request: NextRequest, searchParams?: URLSearchParams): string | null {
  if (searchParams) {
    const q = searchParams.get("profile_id");
    if (q) return q;
  }
  return request.headers.get("x-profile-id");
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { searchParams } = new URL(request.url);
    const profileId = resolveProfileId(request, searchParams);
    if (!profileId) return NextResponse.json({ error: "Profile ID is required." }, { status: 400 });

    const response = await fetch(`${BACKEND_URL}/profile/${profileId}/experiences`, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json({ error: "Invalid response from server", details: text.substring(0,200) }, { status: 500 });
    }

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to fetch experiences" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message } satisfies ApiError, { status: 500 });
  }
}
