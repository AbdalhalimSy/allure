import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

interface RegisterResponse {
  status?: number | string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const body = await request.json();
  const { first_name, last_name, email, password, password_confirmation, first_twin_name, second_twin_name } = body;

  try {
    const payload: any = {
      first_name,
      last_name,
      email,
      password,
      password_confirmation,
    };

    // Add twin names if provided
    if (first_twin_name) payload.first_twin_name = first_twin_name;
    if (second_twin_name) payload.second_twin_name = second_twin_name;

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: getApiHeaders(request),
      body: JSON.stringify(payload),
    });
    const raw = await res.json().catch(() => ({ status: res.status }));
    const data: RegisterResponse = typeof raw === 'object' && raw !== null ? raw as RegisterResponse : { status: res.status };
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Registration failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
