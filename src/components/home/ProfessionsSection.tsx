"use client";

import Image from "next/image";
import { HandHeart, Layers } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import HorizontalCarousel, {
  HorizontalCarouselItem,
} from "@/components/ui/HorizontalCarousel";

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
 <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 " />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary ">
            {kicker}
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
 <p className="text-lg text-gray-700 ">{subtitle}</p>
        </div>

        {/* Helper and hint */}
        <div className="mt-10 flex items-center justify-between pb-4">
 <div className="flex items-center gap-2 text-sm text-gray-600 ">
            <HandHeart className="h-4 w-4" />
            <span>{helper}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
 <span className="rounded-full bg-[rgba(196,154,71,0.15)] px-3 py-1.5 text-primary ">
              {hint}
            </span>
          </div>
        </div>

        {/* Professions carousel */}
        <div className="relative">
          {loading && (
 <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-[rgba(196,154,71,0.35)] px-6 py-12 text-sm text-primary ">
              {loadingText}
            </div>
          )}

          {!loading && professions.length === 0 && (
 <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-sm text-gray-600 ">
              {emptyText}
            </div>
          )}

          {!loading && professions.length > 0 && (
            <HorizontalCarousel
              items={professions.map<HorizontalCarouselItem<Profession>>(
                (p) => ({
                  key: p.id,
                  data: p,
                })
              )}
              renderItem={({ data: profession }) => (
                <button
                  onClick={() => onProfessionClick(profession.id)}
 className="group relative min-w-72 shrink-0 rounded-3xl border border-gray-100 bg-white/90 p-6 text-start shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary "
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-linear-to-br ${profession.accent} opacity-0 transition group-hover:opacity-5`}
                    aria-hidden
                  />

                  {/* Content */}
                  <div className="flex items-center gap-4">
 <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-white/50 ">
                      <Image
                        src={profession.image}
                        alt={profession.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold leading-tight">
                        {profession.name}
                      </p>
 <p className="text-sm text-gray-600 ">
                        {profession.description}
                      </p>
                    </div>
                  </div>

                  {/* CTA badge */}
 <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1.5 text-xs font-semibold text-primary transition group-hover:bg-[rgba(196,154,71,0.18)] ">
                    <Layers className="h-4 w-4" />
                    {cta}
                  </div>
                </button>
              )}
              autoScroll
              autoScrollPxPerSecond={50}
              arrows={false}
              loop
            />
          )}
        </div>
      </div>
    </section>
  );
}
