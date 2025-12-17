"use client";

import Image from "next/image";
import { HandHeart, Layers } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface Profession {
  id: number;
  name: string;
  description: string;
  accent: string;
  image: string;
}

interface ProfessionsSectionProps {
  professions: Profession[];
  loading: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  helper: string;
  hint: string;
  label: string;
  cta: string;
  loadingText: string;
  emptyText: string;
  onProfessionClick: (id: number) => void;
}

export default function ProfessionsSection({
  professions,
  loading,
  kicker,
  title,
  subtitle,
  helper,
  hint,
  label,
  cta,
  loadingText,
  emptyText,
  onProfessionClick,
}: ProfessionsSectionProps) {
  useI18n();

  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-12">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary dark:bg-[rgba(196,154,71,0.15)] dark:text-primary">
            {kicker}
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">{subtitle}</p>
        </div>

        {/* Helper and hint */}
        <div className="mt-10 flex items-center justify-between pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HandHeart className="h-4 w-4" />
            <span>{helper}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-[rgba(196,154,71,0.15)] px-3 py-1.5 text-primary dark:text-primary">
              {hint}
            </span>
          </div>
        </div>

        {/* Professions grid */}
        <div className="relative overflow-hidden">
          {loading && (
            <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-[rgba(196,154,71,0.35)] px-6 py-12 text-sm text-primary dark:border-[rgba(196,154,71,0.35)] dark:text-primary">
              {loadingText}
            </div>
          )}

          {!loading && professions.length === 0 && (
            <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              {emptyText}
            </div>
          )}

          {!loading && professions.length > 0 && (
            <div
              className="flex gap-4 overflow-x-auto pb-10 [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {professions.map((profession) => (
                <button
                  key={profession.id}
                  onClick={() => onProfessionClick(profession.id)}
                  className="group relative min-w-72 flex-1 scroll-ml-6 rounded-3xl border border-gray-100 bg-white/90 p-6 text-start shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-gray-900/90"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-linear-to-br ${profession.accent} opacity-0 transition group-hover:opacity-5`}
                    aria-hidden
                  />

                  {/* Content */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-white/50 dark:bg-gray-800">
                      <Image
                        src={profession.image}
                        alt={profession.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary dark:text-primary">
                        {label}
                      </p>
                      <p className="text-lg font-semibold leading-tight">
                        {profession.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profession.description}
                      </p>
                    </div>
                  </div>

                  {/* CTA badge */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1.5 text-xs font-semibold text-primary transition group-hover:bg-[rgba(196,154,71,0.18)] dark:text-primary">
                    <Layers className="h-4 w-4" />
                    {cta}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
