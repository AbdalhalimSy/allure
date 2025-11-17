"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import JobCard from "@/components/jobs/JobCard";
import Loader from "@/components/ui/Loader";
import { Calendar, MapPin, Briefcase, AlertCircle } from "lucide-react";
import { Job, JobsResponse } from "@/types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/jobs");
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      const result: JobsResponse = await response.json();
      
      if (result.status === "success") {
        setJobs(result.data);
      } else {
        throw new Error(result.message || "Failed to load jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12 text-center dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
            Failed to Load Jobs
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchJobs}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <SectionHeader
          title="Casting Opportunities"
          description="Discover exciting roles and casting calls. Find your next big opportunity."
        />

        {/* Stats Bar */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#c49a47]/10 p-3">
                <Briefcase className="h-6 w-6 text-[#c49a47]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Castings
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.reduce((acc, job) => acc + job.roles_count, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Roles
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(jobs.flatMap(job => job.countries)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Countries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Briefcase className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No Jobs Available
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check back soon for new casting opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
