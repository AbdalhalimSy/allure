
import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const url = queryString
      ? `${BACKEND_URL}/jobs/${id}?${queryString}`
      : `${BACKEND_URL}/jobs/${id}`;

    // Get authorization token from the request
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ status: "error", message: data.message || "Job not found.", data: null }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "error", message: "Internal server error", data: null }, { status: 500 });
  }
}
