import { NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

interface LogoutResponse {
  status?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const res = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: getAuthApiHeaders(request, token),
    });

    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      data = { status: res.ok ? "ok" : "error" };
    }
    const safe: LogoutResponse = typeof data === 'object' && data !== null ? (data as LogoutResponse) : { status: String(data) };
    return NextResponse.json(safe, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Logout failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
