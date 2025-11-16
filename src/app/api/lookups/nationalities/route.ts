import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

interface LookupErrorResponse { error: string; }
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/lookups/nationalities`, {
      method: "GET",
      headers: getApiHeaders(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch nationalities" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Nationalities fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" } as LookupErrorResponse,
      { status: 500 }
    );
  }
}
