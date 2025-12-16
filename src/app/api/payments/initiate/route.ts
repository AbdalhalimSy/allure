import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

/**
 * POST /api/payments/initiate
 * Initiate a CCAvenue payment for a subscription package
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/payments/initiate`, {
      method: "POST",
      headers: getAuthApiHeaders(request, token),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to initiate payment",
        data: null,
      },
      { status: 500 }
    );
  }
}
