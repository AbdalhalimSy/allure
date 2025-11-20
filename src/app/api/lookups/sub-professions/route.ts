import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professionId = searchParams.get('profession_id');
    
    const url = professionId 
      ? `${BACKEND_URL}/lookups/sub-professions?profession_id=${professionId}`
      : `${BACKEND_URL}/lookups/sub-professions`;

    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch sub-professions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sub-professions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
