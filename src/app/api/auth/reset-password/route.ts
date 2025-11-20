import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const body = await request.json();
  const { email, code, password, password_confirmation } = body;

  try {
    const res = await fetch(`${baseUrl}/auth/reset-password`, {
      method: "POST",
      headers: getApiHeaders(request),
      body: JSON.stringify({ email, code, password, password_confirmation }),
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
