"use client";

import { useEffect, useState } from "react";
import SurfaceCard from "@/components/ui/SurfaceCard";
import apiClient from "@/lib/api/client";
import { logger } from "@/lib/utils/logger";
import { Users, Briefcase, BadgeCheck, Clock } from "lucide-react";

interface Stats {
  talents: number;
  jobs: number;
  booking: number;
  response: string;
}

export default function Numbers() {
  const [stats, setStats] = useState<Stats>({
    talents: 0,
    jobs: 0,
    booking: 96,
    response: "24h",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [talentsRes, jobsRes] = await Promise.all([
          apiClient.get("/talents?per_page=1"),
          apiClient.get("/jobs?per_page=1"),
        ]);
        const talentsTotal = talentsRes.data?.meta?.total ?? 0;
        const jobsTotal = jobsRes.data?.meta?.total ?? 0;
        setStats((s) => ({ ...s, talents: talentsTotal, jobs: jobsTotal }));
      } catch (error) {
        logger.error("Failed to load stats", error);
      }
    };
    load();
  }, []);

  const items = [
    {
      label: "represented talents",
      value: stats.talents.toLocaleString(),
      Icon: Users,
    },
    {
      label: "active jobs",
      value: stats.jobs.toLocaleString(),
      Icon: Briefcase,
    },
    { label: "booking success", value: `${stats.booking}%`, Icon: BadgeCheck },
    { label: "average response", value: stats.response, Icon: Clock },
  ];

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ label, value, Icon }) => (
          <SurfaceCard
            key={label}
            // className="p-5 md:p-6"
            backgroundClassName="border border-gray-200/60 bg-white/90 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br from-[#c49a47]/15 via-white to-[#d4a855]/15 text-[#c49a47] dark:from-[#c49a47]/25 dark:to-[#d4a855]/25">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-[#c49a47] to-[#d4a855] bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {label}
                </div>
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </section>
  );
}
