"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import TalentCard from "@/components/talent/TalentCard";
import Link from "next/link";
import apiClient from "@/lib/api/client";

export default function TalentsPreview() {
  const [talents, setTalents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/talents?per_page=8");
        if (res.data?.status === "success") setTalents(res.data.data || []);
      } catch (e) {
        console.error("Failed to load talents", e);
      }
    };
    load();
  }, []);

  return (
    <section>
      <SectionHeader
        eyebrow="Top Talents"
        title="Discover Featured Talents"
        description="Explore standout profiles across our roster"
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {talents.map((t, i) => (
          <TalentCard key={t?.profile?.id ?? i} talent={t} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/talents" className="text-sm font-semibold text-[#c49a47] hover:underline">
          Explore More →
        </Link>
      </div>
    </section>
  );
}
