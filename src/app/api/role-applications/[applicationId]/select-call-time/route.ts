import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { applicationId } = await params;
    const body = await request.json().catch(() => null);

    const callTimeSlotId = body?.call_time_slot_id;
    const selectedTime = body?.selected_time;

    if (!callTimeSlotId || !selectedTime) {
      return NextResponse.json(
        {
          status: "error",
          message: "call_time_slot_id and selected_time are required",
          data: null,
        },
        { status: 422 }
      );
    }

    const headers = getAuthApiHeaders(request, authHeader.replace("Bearer ", ""));

    const backendResponse = await fetch(
      `${env.apiBaseUrl}/role-applications/${applicationId}/select-call-time`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          call_time_slot_id: callTimeSlotId,
          selected_time: selectedTime,
        }),
      }
    );

    const contentType = backendResponse.headers.get("content-type");
    const responseBody = contentType?.includes("application/json")
      ? await backendResponse.json()
      : await backendResponse.text();

    if (!backendResponse.ok) {
      return NextResponse.json(
        typeof responseBody === "string"
          ? { status: "error", message: responseBody }
          : responseBody,
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Call time selection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to select call time",
        data: null,
      },
      { status: 500 }
    );
  }
}
