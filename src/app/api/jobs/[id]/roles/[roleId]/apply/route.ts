import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; roleId: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { id, roleId } = await params;
    const formData = await request.formData();

    // Remove legacy call time fields to match the new contract
    formData.delete("call_time_slot_id");
    formData.delete("selected_time");

    const profileId = formData.get("profile_id");
    const responsesJson = formData.get("responses");
    const approvedPaymentTerms = formData.get("approved_payment_terms");

    if (!profileId) {
      return NextResponse.json(
        { status: "error", message: "profile_id is required", data: null },
        { status: 400 }
      );
    }

    if (!responsesJson) {
      return NextResponse.json(
        { status: "error", message: "responses are required", data: null },
        { status: 400 }
      );
    }

    if (!approvedPaymentTerms) {
      return NextResponse.json(
        { status: "error", message: "approved_payment_terms is required", data: null },
        { status: 400 }
      );
    }

    // Validate JSON responses early to provide clear feedback
    try {
      JSON.parse(responsesJson as string);
    } catch (err) {
      return NextResponse.json(
        {
          status: "error",
          message: "responses must be valid JSON",
          data: null,
        },
        { status: 400 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const headers = getAuthApiHeaders(request, token);
    // Let fetch set multipart boundaries automatically
    delete (headers as Record<string, string>)["Content-Type"];

    const backendResponse = await fetch(
      `${env.apiBaseUrl}/jobs/${id}/roles/${roleId}/apply`,
      {
        method: "POST",
        headers,
        body: formData,
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
    console.error("Error processing application:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process your application. Please try again.",
        data: null,
      },
      { status: 500 }
    );
  }
}
