import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";
import { env } from "@/lib/config/env";

const sanitizeRole = (role: any) => ({
  ...role,
  can_apply: false,
  has_applied: false,
  eligibility_score: 0,
  budget: null,
  call_time_enabled: Boolean(role?.call_time_enabled),
  call_time_slots: role?.call_time_slots || [],
});

const sanitizeJob = (job: any) => ({
  ...job,
  has_applied: false,
  roles: Array.isArray(job?.roles)
    ? job.roles.map(sanitizeRole)
    : [],
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = queryString
      ? `${env.apiBaseUrl}/public/jobs?${queryString}`
      : `${env.apiBaseUrl}/public/jobs`;

    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(request),
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return NextResponse.json(
        typeof data === "string" ? { error: data } : data,
        { status: response.status }
      );
    }

    if (typeof data === "string") {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const sanitized = Array.isArray(data?.data)
      ? { ...data, data: data.data.map(sanitizeJob) }
      : data;

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("Public jobs list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
