import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

/**
 * GET /api/payments/status?order_id=xxx
 * Check the status of a payment by order ID
 */
export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Order ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/payments/status?order_id=${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: getAuthApiHeaders(request, token),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check payment status",
        data: null,
      },
      { status: 500 }
    );
  }
}
