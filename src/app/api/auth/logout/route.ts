import { NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const res = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: getAuthApiHeaders(request, token),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch (_) {
      data = { status: res.ok ? "ok" : "error" };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Logout failed", details: error?.message },
      { status: 500 }
    );
  }
}
