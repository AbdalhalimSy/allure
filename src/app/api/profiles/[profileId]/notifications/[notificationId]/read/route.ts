import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";
import { logger } from "@/lib/utils/logger";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ profileId: string; notificationId: string }> }
) {
    const { profileId, notificationId } = await params;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const url = `${env.apiBaseUrl}/profiles/${profileId}/notifications/${notificationId}/read`;

        const headers = {
            ...getAuthApiHeaders(request, token),
            "x-profile-id": profileId,
        };

        const response = await fetch(url, {
            method: "POST",
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to mark notification as read" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: unknown) {
        logger.error("Error marking notification as read", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
