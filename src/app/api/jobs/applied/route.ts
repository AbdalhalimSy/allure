import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profileId = searchParams.get("profile_id");
    const applicationStatus = searchParams.get("application_status");
    const perPage = searchParams.get("per_page") || "20";
    const page = searchParams.get("page") || "1";

    // Get authorization token from request
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    if (!profileId) {
      return NextResponse.json(
        { status: "error", message: "profile_id is required", data: null },
        { status: 400 }
      );
    }

    const profileIdNum = Number(profileId);
    if (!Number.isInteger(profileIdNum) || profileIdNum < 1) {
      return NextResponse.json(
        { status: "error", message: "profile_id must be a positive integer", data: null },
        { status: 422 }
      );
    }

    const perPageNum = Number(perPage);
    if (!Number.isInteger(perPageNum) || perPageNum < 1 || perPageNum > 100) {
      return NextResponse.json(
        { status: "error", message: "per_page must be an integer between 1 and 100", data: null },
        { status: 422 }
      );
    }

    const validStatuses = ["pending", "shortlisted", "rejected", "selected"];
    if (applicationStatus && !validStatuses.includes(applicationStatus)) {
      return NextResponse.json(
        { status: "error", message: "application_status must be one of pending, shortlisted, rejected, selected", data: null },
        { status: 422 }
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      profile_id: profileIdNum.toString(),
      per_page: perPageNum.toString(),
      page: page,
    });

    if (applicationStatus) {
      queryParams.set("application_status", applicationStatus);
    }

    const url = `${BACKEND_URL}/jobs/applied?${queryParams.toString()}`;

    // Forward request to backend API with proper headers
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getApiHeaders(request),
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Applied jobs API error:", error);

    return NextResponse.json(
      { status: "error", message: "Failed to fetch applied jobs", data: null },
      { status: 500 }
    );
  }
}
