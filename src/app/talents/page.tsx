"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import TalentCard from "@/components/talent/TalentCard";
import TalentFilterBar from "@/components/talent/TalentFilterBar";
import TalentCardSkeleton from "@/components/talent/TalentCardSkeleton";
import Loader from "@/components/ui/Loader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { Talent, TalentFilters, TalentsResponse } from "@/types/talent";
import { Users, AlertCircle } from "lucide-react";

export default function TalentsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, t } = useI18n();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TalentFilters>({});
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const requestIdRef = useRef(0); // Track the latest request to avoid stale loading flips
  const abortRef = useRef<AbortController | null>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const queryHydratedRef = useRef(false);

  // Reset talents and show loading when pathname changes (navigation)
  useEffect(() => {
    setTalents([]);
    setLoading(true);
    setHasMore(true);
    setMeta({ current_page: 1, per_page: 12, total: 0, last_page: 1 });
  }, [pathname]);

  useEffect(() => {
    if (queryHydratedRef.current) return;
    const professionParam = searchParams.get("profession_ids");
    if (professionParam) {
      setFilters(prev => ({ ...prev, profession_ids: professionParam }));
    }
    queryHydratedRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(filters).length > 0 || Object.keys(filters).length === 0) {
      fetchTalents(1, true);
    }
  }, [filters, locale, fetchTalents]);

  const fetchTalents = useCallback(async (page: number = 1, reset: boolean = false) => {
    const requestId = ++requestIdRef.current;
    try {
      // Abort any in-flight request to avoid race conditions
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      if (page === 1) setError(null);

      // Build query string from filters
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      // Add page and per_page
      params.append("page", String(page));
      params.append("per_page", "12");

      const response = await fetch(`/api/talents?${params.toString()}`, {
        signal: abortRef.current.signal,
        headers: {
          "Accept-Language": locale,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch talents");
      }

      const result: TalentsResponse = await response.json();

      if (result.status === "success") {
        if (reset) {
          setTalents(result.data);
          setMeta(result.meta || { current_page: 1, per_page: 12, total: 0, last_page: 1 });
          setHasMore((result.meta?.current_page || 1) < (result.meta?.last_page || 1));
        } else {
          setTalents(prev => [...prev, ...result.data]);
          setMeta(result.meta || { current_page: page, per_page: 12, total: 0, last_page: 1 });
          setHasMore((result.meta?.current_page || page) < (result.meta?.last_page || 1));
        }
      } else {
        throw new Error(result.message || "Failed to load talents");
      }
    } catch (err) {
      // Ignore abort errors silently
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      if (reset) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
      console.error("Error fetching talents:", err);
    } finally {
      // Only clear loading for the latest request so aborted/stale calls don't hide the skeleton
      if (requestIdRef.current === requestId) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [filters, locale]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && talents.length > 0) {
          fetchTalents(meta.current_page + 1, false);
        }
      },
      { rootMargin: "200px" }
    );

    const currentRef = observerTargetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, loading, fetchTalents, meta.current_page, talents.length]);

  const handleFilterChange = (newFilters: TalentFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Banner Section - Same style as About page */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#c49a47] to-[#d4af69] shadow-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              {t("talents.heroTitlePrefix")}
              <span className="text-[#c49a47]">{t("talents.heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {t("talents.heroSubtitleLine1")}
              <br />
              {t("talents.heroSubtitleLine2")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Filter Section */}
        <div className="relative z-10 mb-12">
          <TalentFilterBar 
            value={filters} 
            onChange={handleFilterChange} 
            onReset={handleReset}
            loadingResults={loading}
          />
        </div>

        {/* Loading State */}
        {loading && talents.length === 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader className="h-4 w-4" />
                <span>{t("talents.loading")}</span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <TalentCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          /* Error State */
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t("talents.failedToLoad")}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => fetchTalents(1, true)}
                className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {t("talents.tryAgain")}
              </button>
            </SurfaceCard>
          </div>
        ) : talents.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                {t("talents.noTalentsFound")}
              </h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {t("talents.noTalentsHint")}
              </p>
              <button
                onClick={handleReset}
                className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {t("talents.clearFilters")}
              </button>
            </SurfaceCard>
          </div>
        ) : (
          /* Talents Grid */
          <>
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {meta.total} {meta.total === 1 ? t("talents.talentSingular") : t("talents.talentPlural")} {t("talents.found")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("talents.showing")} {talents.length} {t("talents.of")} {meta.total}
                </p>
              </div>
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader className="h-4 w-4" />
                  <span>{t("talents.updating")}</span>
                </div>
              )}
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {talents.map((talent) => (
                <TalentCard key={talent.profile.id} talent={talent} />
              ))}
            </div>

            {/* Infinite scroll trigger point */}
            {hasMore && (
              <div ref={observerTargetRef} className="mt-12 flex justify-center py-8">
                <div className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin text-[#c49a47]" />
                  <span className="text-gray-600 dark:text-gray-400">{t("talents.loading")}</span>
                </div>
              </div>
            )}
            
            {/* End of results message */}
            {!hasMore && talents.length > 0 && (
              <div className="mt-12 py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">{t("talents.noMoreTalents")}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
