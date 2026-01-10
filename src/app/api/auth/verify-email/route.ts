import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

interface VerifyEmailResponse {
  status?: number | string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { email, code } = await request.json();

  try {
    const res = await fetch(`${baseUrl}/auth/verify-email`, {
      method: "POST",
      headers: getApiHeaders(request, { includeContentType: true }),
      body: JSON.stringify({ email, code }),
    });
    const raw = await res.json().catch(() => ({ status: res.status }));
    const data: VerifyEmailResponse = typeof raw === 'object' && raw !== null ? raw as VerifyEmailResponse : { status: res.status };
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Verification failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
