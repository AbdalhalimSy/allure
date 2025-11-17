"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import TalentCard from "@/components/talent/TalentCard";
import TalentFilterBar from "@/components/talent/TalentFilterBar";
import Loader from "@/components/ui/Loader";
import { Talent, TalentFilters, TalentsResponse } from "@/types/talent";
import { Users, AlertCircle, Briefcase } from "lucide-react";

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TalentFilters>({});
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchTalents();
  }, [filters]);

  const fetchTalents = async () => {
    try {
      // Abort any in-flight request to avoid race conditions
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      setLoading(true);
      setError(null);

      // Build query string from filters
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      // Set default per_page if not specified
      if (!params.has("per_page")) {
        params.append("per_page", "12");
      }

      const response = await fetch(`/api/talents?${params.toString()}`, {
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch talents");
      }

      const result: TalentsResponse = await response.json();

      if (result.status === "success") {
        setTalents(result.data);
        setMeta(result.meta);
      } else {
        throw new Error(result.message || "Failed to load talents");
      }
    } catch (err) {
      // Ignore abort errors silently
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching talents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: TalentFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 on filter change
  };

  const handleReset = () => {
    setFilters({});
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && talents.length === 0) {
    return (
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        <SectionHeader title="Talents" />
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        <SectionHeader title="Talents" />
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Failed to Load Talents
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchTalents}
            className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c49a47] to-[#d4af69] shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Discover Talents
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse our curated collection of professional talents
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TalentFilterBar value={filters} onChange={handleFilterChange} onReset={handleReset} />

      {/* Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c49a47]/10">
              <Users className="h-5 w-5 text-[#c49a47]" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{meta.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Briefcase className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Showing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{talents.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Page</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {meta.current_page}/{meta.last_page}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Per Page</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{meta.per_page}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Talents Grid */}
      {talents.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-3xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 p-12 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No talents found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters to see more results
            </p>
          </div>
          <button
            onClick={handleReset}
            className="rounded-full bg-gradient-to-r from-[#c49a47] to-[#d4af69] px-6 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {talents.map((talent) => (
            <TalentCard key={talent.profile.id} talent={talent} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handlePageChange(meta.current_page - 1)}
            disabled={meta.current_page === 1}
            className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 px-6 py-3 font-medium text-gray-700 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300"
          >
            <span className="relative z-10">Previous</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#c49a47]/0 to-[#c49a47]/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
          
          <div className="flex items-center gap-2 rounded-xl border border-gray-200/50 bg-gradient-to-br from-white/90 to-white/70 px-6 py-3 backdrop-blur-xl dark:border-white/10 dark:from-gray-900/80 dark:to-gray-900/60">
            <span className="font-medium text-gray-900 dark:text-white">
              {meta.current_page}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">
              {meta.last_page}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(meta.current_page + 1)}
            disabled={meta.current_page === meta.last_page}
            className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 px-6 py-3 font-medium text-gray-700 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300"
          >
            <span className="relative z-10">Next</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#c49a47]/10 to-[#c49a47]/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      )}
    </section>
  );
}
