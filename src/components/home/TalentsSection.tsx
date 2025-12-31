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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary ">
                {kicker}
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
              <p className="text-gray-700 ">{subtitle}</p>
            </div>
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary "
            >
              {viewAll}
              <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
            </Link>
          </div>

          {/* Talents grid */}
          <div className="mt-8">
            {loading && (
              <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-sm text-gray-600 ">
                {loadingText}
              </div>
            )}

            {!loading && talents.length === 0 && (
              <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-sm text-gray-600 ">
                {emptyText}
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
