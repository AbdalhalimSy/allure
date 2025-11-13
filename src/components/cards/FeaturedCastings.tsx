"use client";
import Link from "next/link";
import CastingOpportunityCard from "./CastingOpportunityCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/contexts/I18nContext";

const castings = [
  {
    title: "Luxury Resort SS25 Campaign",
    brand: "AMAARI Resorts",
    location: "Abu Dhabi, UAE",
    timeline: "Feb 02 – Feb 08",
    budget: "25,000 AED",
    requirements: ["Mixed gender cast of 6", "Swim + Resort wear", "Comfort with underwater stills"],
    accent: "midnight" as const,
  },
  {
    title: "Beauty Editorial x Global Gloss",
    brand: "Global Gloss",
    location: "Jeddah, KSA",
    timeline: "Jan 15 – Jan 18",
    budget: "16,500 SAR",
    requirements: ["Female-presenting talent", "Expressive eyes + freckles", "Comfortable with closeups"],
    accent: "rose" as const,
  },
  {
    title: "Immersive Fashion Presentation",
    brand: "FutureLab Studios",
    location: "Dubai Design District",
    timeline: "Mar 01 – Mar 12",
    budget: "30,000 AED",
    requirements: ["Movement / choreography background", "Experience with interactive shows", "Multi-lingual bonus"],
    accent: "emerald" as const,
  },
  {
    title: "Hospitality Lifestyle Series",
    brand: "Kafara Collection",
    location: "Doha, Qatar",
    timeline: "Feb 18 – Feb 22",
    budget: "18,000 QAR",
    requirements: ["Couple dynamic", "Comfort with dialog", "Natural chemistry"],
    accent: "gold" as const,
  },
];

export default function FeaturedCastings() {
  const { t } = useI18n();
  return (
    <section className="space-y-10">
      <SectionHeader
        align="center"
        eyebrow={t("featuredCastings.eyebrow")}
        title={t("featuredCastings.title")}
        description={t("featuredCastings.description") || ""}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {castings.map((casting) => (
          <CastingOpportunityCard key={casting.title} {...casting} />
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/casting"
          className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white/10"
        >
          {t("featuredCastings.postYourOwn") || t("featuredCastings.eyebrow")}
        </Link>
      </div>
    </section>
  );
}
