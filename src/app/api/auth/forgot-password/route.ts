import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const body = await request.json();
  const { email } = body;

  try {
    const res = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: getApiHeaders(request, { includeContentType: true }),
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({ status: res.status }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Request failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
