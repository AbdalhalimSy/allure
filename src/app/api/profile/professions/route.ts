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
    
    // TODO: Get actual profile ID from user context instead of hardcoded value
    const profileId = 1;

    const response = await fetch(`${BACKEND_URL}/profile/${profileId}/professions`, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Invalid response from server", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch professions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Get FormData from request
    const formData = await request.formData();

    // Get auth headers but remove Content-Type for multipart/form-data
    const headers = getAuthApiHeaders(request, token);
    delete headers["Content-Type"]; // Let fetch set the correct Content-Type with boundary

    // TODO: Get actual profile ID from user context instead of hardcoded value
    const profileId = 1;

    // Forward the FormData to the backend
    const response = await fetch(`${BACKEND_URL}/profile/${profileId}/professions`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Invalid response from server", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to save profession" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
