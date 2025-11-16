import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data for syncing professions.' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    if (!formData.has("profile_id")) {
      const profileId = request.headers.get("x-profile-id");
      if (profileId) {
        formData.append("profile_id", profileId);
      }
    }

    const headers = getAuthApiHeaders(request, token);
    delete headers["Content-Type"];

    const response = await fetch(`${BACKEND_URL}/profile/sync-professions`, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseType = response.headers.get("content-type");

    if (!responseType || !responseType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Invalid response from server", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to sync professions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
