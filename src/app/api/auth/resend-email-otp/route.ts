import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required", data: null },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { status: "error", message: "Server configuration error", data: null },
        { status: 500 }
      );
    }

    const response = await fetch(`${baseUrl}/auth/resend-email-otp`, {
      method: "POST",
      headers: getApiHeaders(req, { includeContentType: true }),
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to resend OTP", data: null },
      { status: 500 }
    );
  }
}
