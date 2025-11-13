import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const body = await request.json();
  const { first_name, last_name, email, password, password_confirmation } = body;

  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: getApiHeaders(request),
      body: JSON.stringify({ first_name, last_name, email, password, password_confirmation }),
    });
    const data = await res.json().catch(() => ({ status: res.status }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Registration failed", details: error?.message },
      { status: 500 }
    );
  }
}
