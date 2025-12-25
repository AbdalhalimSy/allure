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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const url = queryString
      ? `${env.apiBaseUrl}/public/jobs/${id}?${queryString}`
      : `${env.apiBaseUrl}/public/jobs/${id}`;

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

    const sanitized = data?.data
      ? { ...data, data: sanitizeJob(data.data) }
      : data;

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("Public job detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
