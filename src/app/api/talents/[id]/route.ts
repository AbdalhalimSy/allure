import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders, getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = `${BACKEND_URL}/talents/${id}`;
    const authHeader = request.headers.get("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    const response = await fetch(url, {
      method: "GET",
      headers: token ? getAuthApiHeaders(request, token) : getApiHeaders(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Talent not found", data: null },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching talent:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
