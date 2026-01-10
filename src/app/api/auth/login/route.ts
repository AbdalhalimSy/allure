import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
    const {
        email,
        password,
        device_name,
        platform,
        fcm_token,
    } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const derivedDeviceName = device_name || request.headers.get("user-agent")?.slice(0, 255) || "web";
    const derivedPlatform = platform || "web";

    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: getApiHeaders(request, { includeContentType: true }),
        body: JSON.stringify({
            email,
            password,
            device_name: derivedDeviceName,
            platform: derivedPlatform,
            fcm_token,
        }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}