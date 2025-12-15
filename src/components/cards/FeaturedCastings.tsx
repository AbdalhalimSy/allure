"use client";
import Link from "next/link";
import CastingOpportunityCard from "./CastingOpportunityCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/contexts/I18nContext";

export default function FeaturedCastings() {
  const { t } = useI18n();
  
  const castings = [
    {
      title: t("castingOpportunities.luxuryResort.title"),
      brand: t("castingOpportunities.luxuryResort.brand"),
      location: t("castingOpportunities.luxuryResort.location"),
      timeline: t("castingOpportunities.luxuryResort.timeline"),
      budget: t("castingOpportunities.luxuryResort.budget"),
      requirements: [
        t("castingOpportunities.luxuryResort.requirements.req1"),
        t("castingOpportunities.luxuryResort.requirements.req2"),
        t("castingOpportunities.luxuryResort.requirements.req3")
      ],
      accent: "midnight" as const,
    },
    {
      title: t("castingOpportunities.beautyEditorial.title"),
      brand: t("castingOpportunities.beautyEditorial.brand"),
      location: t("castingOpportunities.beautyEditorial.location"),
      timeline: t("castingOpportunities.beautyEditorial.timeline"),
      budget: t("castingOpportunities.beautyEditorial.budget"),
      requirements: [
        t("castingOpportunities.beautyEditorial.requirements.req1"),
        t("castingOpportunities.beautyEditorial.requirements.req2"),
        t("castingOpportunities.beautyEditorial.requirements.req3")
      ],
      accent: "rose" as const,
    },
    {
      title: t("castingOpportunities.immersiveFashion.title"),
      brand: t("castingOpportunities.immersiveFashion.brand"),
      location: t("castingOpportunities.immersiveFashion.location"),
      timeline: t("castingOpportunities.immersiveFashion.timeline"),
      budget: t("castingOpportunities.immersiveFashion.budget"),
      requirements: [
        t("castingOpportunities.immersiveFashion.requirements.req1"),
        t("castingOpportunities.immersiveFashion.requirements.req2"),
        t("castingOpportunities.immersiveFashion.requirements.req3")
      ],
      accent: "emerald" as const,
    },
    {
      title: t("castingOpportunities.hospitalityLifestyle.title"),
      brand: t("castingOpportunities.hospitalityLifestyle.brand"),
      location: t("castingOpportunities.hospitalityLifestyle.location"),
      timeline: t("castingOpportunities.hospitalityLifestyle.timeline"),
      budget: t("castingOpportunities.hospitalityLifestyle.budget"),
      requirements: [
        t("castingOpportunities.hospitalityLifestyle.requirements.req1"),
        t("castingOpportunities.hospitalityLifestyle.requirements.req2"),
        t("castingOpportunities.hospitalityLifestyle.requirements.req3")
      ],
      accent: "gold" as const,
    },
  ];
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
