import { NextResponse } from "next/server";

type GeoResult = {
  country?: string;
};

let cachedCountry: string | null = null;
let cachedAt = 0;
let inflight: Promise<GeoResult> | null = null;

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

function mapIso(iso?: string): string | null {
  if (!iso) return null;
  const up = iso.toUpperCase();
  return ["AE", "SA", "LB"].includes(up) ? up : null;
}

async function fetchGeo(): Promise<GeoResult> {
  const token = process.env.IPINFO_TOKEN || process.env.NEXT_PUBLIC_IPINFO_TOKEN;
  const provider = token
    ? `https://ipinfo.io/json?token=${encodeURIComponent(token)}`
    : "https://ipapi.co/json/";

  const resp = await fetch(provider, { cache: "no-store" });
  if (!resp.ok) {
    // If rate limited, return cached if available
    if (resp.status === 429 && cachedCountry) {
      return { country: cachedCountry };
    }
    throw new Error(`geo provider error ${resp.status}`);
  }
  const data = (await resp.json()) as Record<string, any>;
  // ipinfo: country, ipapi: country
  return { country: data.country };
}

export async function GET() {
  try {
    // Serve cached for 24h
    if (cachedCountry && Date.now() - cachedAt < DAY_MS) {
      return NextResponse.json({ country: cachedCountry }, { status: 200 });
    }

    if (!inflight) {
      inflight = fetchGeo().then((res) => {
        const mapped = mapIso(res.country || undefined);
        cachedCountry = mapped;
        cachedAt = Date.now();
        return { country: mapped ?? null };
      }).catch(() => {
        // On error, keep previous cache; set short TTL to avoid hammering
        cachedAt = Date.now() - (DAY_MS - MINUTE_MS * 10); // pretend stale in ~10m
        return { country: cachedCountry };
      });
    }

    const result = await inflight;
    inflight = null;
    return NextResponse.json(result, {
      status: 200,
      headers: {
        // Allow CDN/browser caching for an hour; client also caches in localStorage
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ country: cachedCountry }, { status: 200 });
  }
}
