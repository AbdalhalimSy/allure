"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import JobCard from "@/components/jobs/JobCard";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { logger } from "@/lib/utils/logger";
import type { Job } from "@/types/job";

export default function JobsPreview() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/jobs?per_page=6");
        if (res.data?.status === "success") setJobs(res.data.data || []);
      } catch (error) {
        logger.error("Failed to load jobs", error);
      }
    };
    load();
  }, []);

  return (
    <section>
      <SectionHeader
        eyebrow="Open Roles"
        title="Featured Jobs"
        description="Latest casting calls curated for you"
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/jobs" className="text-sm font-semibold text-[#c49a47] hover:underline">
          Explore More →
        </Link>
      </div>
    </section>
  );
}
