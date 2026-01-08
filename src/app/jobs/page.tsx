"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import JobFilterBar from "@/components/jobs/filters/JobFilterBar";
import { JobFilters } from "@/types/job";
import { JobsHero } from "./_components/JobsHero";
import { EligibleToggle } from "./_components/EligibleToggle";
import { JobsLoadingState } from "./_components/JobsLoadingState";
import { JobsErrorState } from "./_components/JobsErrorState";
import { JobsEmptyState } from "./_components/JobsEmptyState";
import { JobsGrid } from "./_components/JobsGrid";
import JobDetailModal from "@/components/jobs/modals/JobDetailModal";
import { useJobs } from "./_hooks/useJobs";

export default function JobsPage() {
  const { activeProfileId, isAuthenticated } = useAuth();
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const {
    jobs,
    loading,
    loadingMore,
    error,
    filters,
    setFilters,
    meta,
    hasMore,
    fetchJobs,
    setJobs,
    setLoading,
    setHasMore,
    setMeta,
  } = useJobs(showEligibleOnly);

  // Fetch jobs when filters, profile, or eligible toggle changes (first page)
  useEffect(() => {
    // Skip if still loading auth
    if (isAuthenticated && !activeProfileId) {
      return;
    }
    
    // Reset and fetch
    setJobs([]);
    setLoading(true);
    setHasMore(true);
    setMeta({ current_page: 1, per_page: 12, total: 0, last_page: 1 });
    setSwitching(true);
    
    fetchJobs(1, true).finally(() => {
      setSwitching(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeProfileId, showEligibleOnly, isAuthenticated]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingMore &&
          !loading &&
          jobs.length > 0
        ) {
          fetchJobs(meta.current_page + 1, false);
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
  }, [hasMore, loadingMore, loading, fetchJobs, meta.current_page, jobs.length]);

  const handleFilterChange = (next: JobFilters) => {
    setFilters(next);
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleJobSelect = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="bg-white">
      <JobsHero />

      <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {isAuthenticated && activeProfileId && (
          <EligibleToggle
            checked={showEligibleOnly}
            onChange={setShowEligibleOnly}
            disabled={loading || switching}
          />
        )}

        <div className="relative z-10 mb-12">
          <JobFilterBar
            value={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            loadingResults={loading || switching}
          />
        </div>

        {switching || (loading && jobs.length === 0) ? (
          <JobsLoadingState />
        ) : error ? (
          <JobsErrorState error={error} onRetry={() => fetchJobs(1, true)} />
        ) : jobs.length === 0 ? (
          <JobsEmptyState onReset={handleReset} />
        ) : (
          <JobsGrid
            jobs={jobs}
            meta={meta}
            loadingMore={loadingMore}
            hasMore={hasMore}
            observerTargetRef={observerTargetRef}
            onJobSelect={(job) => handleJobSelect(job.id)}
          />
        )}
      </section>

      <JobDetailModal
        jobId={selectedJobId}
        isOpen={isJobModalOpen}
        onClose={handleCloseJobModal}
      />
    </div>
  );
}
