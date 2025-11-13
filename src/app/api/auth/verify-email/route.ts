import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { email, code } = await request.json();

  try {
    const res = await fetch(`${baseUrl}/auth/verify-email`, {
      method: "POST",
      headers: getApiHeaders(request),
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json().catch(() => ({ status: res.status }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Verification failed", details: error?.message },
      { status: 500 }
    );
  }
}
