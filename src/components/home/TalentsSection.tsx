"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TalentCard from "@/components/talent/TalentCard";
import TalentDetailModal from "@/components/talent/TalentDetailModal";
import type { Talent } from "@/types/talent";

interface TalentsSectionProps {
  talents: Talent[];
  loading: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  viewAll: string;
  loadingText: string;
  emptyText: string;
}

export default function TalentsSection({
  talents,
  loading,
  kicker,
  title,
  subtitle,
  viewAll,
  loadingText,
  emptyText,
}: TalentsSectionProps) {
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              {kicker}
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="text-gray-700 ">{subtitle}</p>
          </div>

          {/* Talents grid */}
          <div className="mt-8">
            {loading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 p-16 text-center">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin mb-4"></div>
                <p className="text-sm text-gray-600">{loadingText}</p>
              </div>
            )}

            {!loading && talents.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">{emptyText}</p>
              </div>
            )}

            {!loading && talents.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {talents.map((talent) => (
                  <TalentCard
                    key={talent.profile.id}
                    talent={talent}
                    onClick={() => {
                      setSelectedTalent(talent);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Centered Browse All Talents Button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary "
            >
              {viewAll}
              <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Talent Detail Modal */}
      <TalentDetailModal
        talent={selectedTalent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTalent(null);
        }}
      />
    </>
  );
}
