"use client";
import SectionHeader from "@/components/ui/SectionHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { useI18n } from "@/contexts/I18nContext";

const pillars = [
  {
    title: "Curated Representation",
    description:
      "We build long-term development plans with each talent—digitals, comps, and reels are refreshed quarterly for instant briefs.",
  },
  {
    title: "Human + Data Matching",
    description:
      "Our bookers combine relationship knowledge with platform data, surfacing a short list that reflects your storyboard from day one.",
  },
  {
    title: "Production-Safe Workflow",
    description:
      "Centralize NDAs, call sheets, fittings, and usage terms in one secure workspace, available to clients and talent managers.",
  },
];

const commitments = [
  "MENA-centric scouting team",
  "Bilingual account managers",
  "Casting studio partnerships",
  "On-set and remote support",
];

export default function AgencyIntro() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 text-white shadow-[0_40px_120px_rgba(3,7,18,0.45)]">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-y-0 start-0 w-1/3 bg-gradient-to-br from-[#c49a47]/40 via-transparent to-transparent blur-3xl" />
        <div className="absolute -end-10 bottom-0 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl" />
      </div>
      <div className="relative space-y-12">
        <SectionHeader
          align="center"
          eyebrow={t("agencyIntro.eyebrow")}
          title={t("agencyIntro.title")}
          description={t("agencyIntro.description") || undefined}
          tone="dark"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <SurfaceCard
              key={pillar.title}
              accent="none"
              padding="p-6"
              backgroundClassName="border border-white/15 bg-white/5"
              className="text-start"
            >
              <h3 className="text-2xl font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm text-gray-300">{pillar.description}</p>
            </SurfaceCard>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {commitments.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
