"use client";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import TalentSpotlightCard from "./TalentSpotlightCard";
import { useI18n } from "@/contexts/I18nContext";

const talents = [
  {
    name: "Layla Arif",
    category: "Runway & Editorial",
    location: "Dubai, UAE",
    availability: "Available for SS25",
    tags: ["Height 178cm", "Versatile Looks", "Arabic + English"],
    coverGradient: "bg-gradient-to-tr from-gray-900 via-gray-700 to-amber-600",
  },
  {
    name: "Omar El Fayed",
    category: "Commercial Talent",
    location: "Riyadh, KSA",
    availability: "Booked thru Nov",
    tags: ["Lifestyle", "Swimwear", "TV Ready"],
    coverGradient: "bg-gradient-to-tr from-emerald-400 via-emerald-600 to-gray-900",
  },
  {
    name: "Sofia Haddad",
    category: "Actors & Hosts",
    location: "Beirut, Lebanon",
    availability: "Accepting Voiceovers",
    tags: ["Acting", "Voice", "MC Experience"],
    coverGradient: "bg-gradient-to-tr from-rose-500 via-fuchsia-600 to-gray-900",
  },
  {
    name: "Malik Rahman",
    category: "Digital Creators",
    location: "Doha, Qatar",
    availability: "Studio + Remote",
    tags: ["Content", "Beauty", "AR Ready"],
    coverGradient: "bg-gradient-to-tr from-slate-900 via-blue-700 to-cyan-500",
  },
];

export default function FeaturedTalents() {
  const { t } = useI18n();
  return (
    <section className="space-y-10">
      <SectionHeader
        align="center"
        eyebrow={t("featuredTalents.eyebrow")}
        title={t("featuredTalents.title")}
        description={t("featuredTalents.description")}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
          <TalentSpotlightCard key={talent.name} {...talent} />
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/talent"
          className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white/10"
        >
          {t("featuredTalents.viewAll") || t("featuredTalents.title")}
        </Link>
      </div>
    </section>
  );
}
