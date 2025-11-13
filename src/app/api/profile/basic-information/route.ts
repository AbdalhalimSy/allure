import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function POST(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const body = await request.json();

        console.log("Sending to backend:", { url: `${BACKEND_URL}/profile/basic-information`, body });

        // Forward request to backend
        const response = await fetch(`${BACKEND_URL}/profile/basic-information`, {
            method: "POST",
            headers: getAuthApiHeaders(request, token),
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get("content-type");
        console.log("Response status:", response.status, "Content-Type:", contentType);

        // Check if response is JSON
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response:", text.substring(0, 500));
            return NextResponse.json(
                { error: "Invalid response from server", details: text.substring(0, 200) },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to update basic information" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Basic information update error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
