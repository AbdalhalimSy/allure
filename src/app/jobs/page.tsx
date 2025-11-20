"use client";
import { useEffect, useRef, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import Loader from "@/components/ui/Loader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { Job, JobFilters, JobsResponse } from "@/types/job";
import { Briefcase, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [meta, setMeta] = useState({ current_page: 1, per_page: 12, total: 0, last_page: 1 });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { fetchJobs(); }, [filters]);

  const fetchJobs = async () => {
    try {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          if (value.length) params.append(key, value.join(","));
        } else {
          params.append(key, String(value));
        }
      });
      if (!params.has("per_page")) params.append("per_page", String(meta.per_page));
      const response = await fetch(`/api/jobs?${params.toString()}`, { signal: abortRef.current.signal });
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const result: JobsResponse = await response.json();
      if (result.status === "success" || result.status === true) {
        setJobs(result.data);
        if (result.meta) setMeta(result.meta);
      } else {
        throw new Error(result.message || "Failed to load jobs");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (next: JobFilters) => {
    setFilters({ ...next, page: 1 });
  };
  const handleReset = () => { setFilters({}); };
  const handlePageChange = (page: number) => { setFilters({ ...filters, page }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c49a47] to-[#d4af69] shadow-xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Explore <span className="text-[#c49a47]">Casting Calls</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Discover active opportunities and roles. Filter by profession, location, dates and appearance to pinpoint the perfect casting.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="relative z-10 mb-12">
          <JobFilterBar value={filters} onChange={handleFilterChange} onReset={handleReset} loadingResults={loading} />
        </div>

        {/* Loading Initial */}
        {loading && jobs.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center"><div className="text-center"><Loader /><p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading jobs...</p></div></div>
        ) : error ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-8 text-center">
              <div className="mb-4 flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"><AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" /></div></div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Failed to Load Jobs</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
              <button onClick={fetchJobs} className="rounded-full bg-gradient-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">Try Again</button>
            </SurfaceCard>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <SurfaceCard className="max-w-md p-12 text-center">
              <div className="mb-6 flex justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"><Briefcase className="h-10 w-10 text-gray-400" /></div></div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">No Jobs Found</h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">No casting calls match your criteria. Try adjusting filters or reset to see all.</p>
              <button onClick={handleReset} className="rounded-full bg-gradient-to-r from-[#c49a47] to-[#d4af69] px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">Clear All Filters</button>
            </SurfaceCard>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{meta.total} {meta.total === 1 ? 'Job' : 'Jobs'} Found</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Showing {((meta.current_page - 1) * meta.per_page) + 1} - {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total}</p>
              </div>
              {loading && (<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Loader className="h-4 w-4" /><span>Updating...</span></div>)}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (<JobCard key={job.id} job={job} />))}
            </div>
            {meta.last_page > 1 && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => handlePageChange(meta.current_page - 1)} disabled={meta.current_page === 1} className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 px-5 py-3 font-medium text-gray-700 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300">
                    <ChevronLeft className="h-5 w-5" /><span className="relative z-10">Previous</span><div className="absolute inset-0 bg-gradient-to-r from-[#c49a47]/0 to-[#c49a47]/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                      let pageNum;
                      if (meta.last_page <= 5) pageNum = i + 1; else if (meta.current_page <= 3) pageNum = i + 1; else if (meta.current_page >= meta.last_page - 2) pageNum = meta.last_page - 4 + i; else pageNum = meta.current_page - 2 + i;
                      return (
                        <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:scale-105 ${pageNum === meta.current_page ? 'border-[#c49a47] bg-gradient-to-br from-[#c49a47] to-[#d4af69] font-bold text-white shadow-lg' : 'border-gray-200/50 bg-white/90 text-gray-700 backdrop-blur-xl hover:border-[#c49a47]/50 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300'}`}>{pageNum}</button>
                      );
                    })}
                  </div>
                  <button onClick={() => handlePageChange(meta.current_page + 1)} disabled={meta.current_page === meta.last_page} className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 px-5 py-3 font-medium text-gray-700 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300">
                    <span className="relative z-10">Next</span><ChevronRight className="h-5 w-5" /><div className="absolute inset-0 bg-gradient-to-r from-[#c49a47]/10 to-[#c49a47]/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Page {meta.current_page} of {meta.last_page}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
