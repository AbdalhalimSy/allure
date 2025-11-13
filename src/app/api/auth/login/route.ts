import { NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: getApiHeaders(request),
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}