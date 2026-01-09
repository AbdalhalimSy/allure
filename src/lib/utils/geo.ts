"use client";

import type { CountryCode } from "@/contexts/CountryFilterContext";

type GeoResponse = {
  country?: string; // ISO 3166-1 alpha-2
};

const STORAGE_KEY = "detectedCountry";
const STORAGE_AT_KEY = "detectedCountryAt";
const DAY_MS = 24 * 60 * 60 * 1000;
let inflight: Promise<CountryCode> | null = null;

function mapIsoToSupported(iso: string | undefined): CountryCode {
  if (!iso) return null;
  const up = iso.toUpperCase();
  if (up === "AE") return "AE";
  if (up === "SA") return "SA";
  if (up === "LB") return "LB";
  return null; // unsupported -> treat as All
}

export async function detectCountryCode(forceRefresh = false): Promise<CountryCode> {
  try {
    if (!forceRefresh) {
      const cached = localStorage.getItem(STORAGE_KEY) as CountryCode | null;
      const at = localStorage.getItem(STORAGE_AT_KEY);
      if (cached && at && Date.now() - Number(at) < DAY_MS) {
        return cached;
      }
      if (inflight) return inflight;
    }

    inflight = (async () => {
      const resp = await fetch("/api/geo", { cache: "no-store" });
      if (!resp.ok) throw new Error("geo fetch failed");
      const data = (await resp.json()) as GeoResponse;
      const mapped = mapIsoToSupported(data.country);
      try {
        if (mapped) {
          localStorage.setItem(STORAGE_KEY, mapped);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
        localStorage.setItem(STORAGE_AT_KEY, String(Date.now()));
      } catch {}
      return mapped;
    })();

    const result = await inflight;
    inflight = null;
    return result;
  } catch {
    return null;
  }
}
