
import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = `${BACKEND_URL}/jobs/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(request),
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ status: "error", message: data.message || "Job not found.", data: null }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Internal server error", data: null }, { status: 500 });
  }
}
