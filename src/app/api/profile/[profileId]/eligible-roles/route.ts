import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await params;
    
    // Get authorization token from request
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const url = `${BACKEND_URL}/profile/${profileId}/eligible-roles`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to fetch eligible roles",
          data: []
        },
        { status: response.status }
      );
    }

    // Transform backend response to our expected format
    // Backend returns { status: "success", message, data }
    // We need { success: true, message, data }
    return NextResponse.json({
      success: data.status === "success",
      message: data.message,
      data: data.data,
    });
  } catch (error: unknown) {
    console.error("Error fetching eligible roles:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
