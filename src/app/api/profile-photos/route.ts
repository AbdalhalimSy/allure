import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

/**
 * GET /api/profile-photos
 * Fetch all profile photos for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/profile-photos`, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching profile photos:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile photos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile-photos
 * Upload a new profile photo
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the backend
    const headers = getAuthApiHeaders(request, token);
    // Remove Content-Type so fetch sets multipart boundary automatically
    delete headers["Content-Type"];

    const response = await fetch(`${BACKEND_URL}/profile-photos`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload profile photo" },
      { status: 500 }
    );
  }
}
