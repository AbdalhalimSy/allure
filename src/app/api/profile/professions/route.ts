import { NextRequest, NextResponse } from "next/server";
import { getAuthApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

function resolveProfileId(request: NextRequest, searchParams?: URLSearchParams): string | null {
  if (searchParams) {
    const queryProfileId = searchParams.get("profile_id");
    if (queryProfileId) {
      return queryProfileId;
    }
  }
  return request.headers.get("x-profile-id");
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { searchParams } = new URL(request.url);
    const profileId = resolveProfileId(request, searchParams);

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required." }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/profile/${profileId}/professions`, {
      method: "GET",
      headers: getAuthApiHeaders(request, token),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Invalid response from server", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch professions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const headers = getAuthApiHeaders(request, token);
    const contentType = request.headers.get("content-type") || "";
    let profileId: string | null = null;
    let body: BodyInit | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const providedId = formData.get("profile_id");
      if (providedId) {
        profileId = String(providedId);
        formData.delete("profile_id");
      }
      if (!profileId) {
        profileId = request.headers.get("x-profile-id");
      }
      if (!profileId) {
        return NextResponse.json({ error: "Profile ID is required." }, { status: 400 });
      }
      delete headers["Content-Type"];
      body = formData;
    } else if (contentType.includes("application/json") || contentType.length === 0) {
      const json = await request.json();

      if (json?.professions) {
        return NextResponse.json(
          { error: "Use /api/profile/sync-professions for syncing professions with media." },
          { status: 400 }
        );
      }

      if (json?.profile_id) {
        profileId = String(json.profile_id);
        delete json.profile_id;
      }
      if (!profileId) {
        profileId = request.headers.get("x-profile-id");
      }
      if (!profileId) {
        return NextResponse.json({ error: "Profile ID is required." }, { status: 400 });
      }

      const params = new URLSearchParams();
      Object.entries(json || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        params.append(key, String(value));
      });
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = params.toString();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const existing = new URLSearchParams(await request.text());
      const providedId = existing.get("profile_id");
      if (providedId) {
        profileId = providedId;
        existing.delete("profile_id");
      }
      if (!profileId) {
        profileId = request.headers.get("x-profile-id");
      }
      if (!profileId) {
        return NextResponse.json({ error: "Profile ID is required." }, { status: 400 });
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = existing.toString();
    } else {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data or application/x-www-form-urlencoded.' },
        { status: 400 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { error: "No payload received." },
        { status: 400 }
      );
    }

    const url = new URL(`${BACKEND_URL}/profile/professions`);
    if (profileId) {
      url.searchParams.set("profile_id", profileId);
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body,
    });

    const responseType = response.headers.get("content-type");

    if (!responseType || !responseType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Invalid response from server", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to save profession" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
