"use client";
import Link from "next/link";
import AccentTag from "@/components/ui/AccentTag";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { useI18n } from "@/contexts/I18nContext";

const heroStats = [
  { value: "4.2K+", label: "represented talents" },
  { value: "380", label: "active castings" },
  { value: "92%", label: "booking success" },
  { value: "24h", label: "average response" },
];

const workflow = [
  "Publish your casting brief with all the nuance it deserves.",
  "Receive curated submissions matched by our talent intelligence.",
  "Book fittings, callbacks, and final selections in one dashboard.",
];

const categories = ["Fashion", "Commercial", "Content Creators", "Actors", "Hosts"];

export default function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
        <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10">
            <div className="space-y-6">
              <AccentTag icon="★">{t("hero.badge")}</AccentTag>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-6xl md:leading-[1.05]">
                {t("hero.title")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 md:text-xl">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/talent"
                className="inline-flex items-center justify-center rounded-full bg-[#c49a47] px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-[#c49a47]/40 transition-transform hover:-translate-y-0.5"
              >
                {t("hero.browseTalents")}
              </Link>
              <Link
                href="/casting"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-900/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              >
                {t("hero.postCasting")}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-gray-200/70 bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <SurfaceCard accent="midnight" padding="p-6">
              <div className="grid grid-cols-2 gap-5">
                {heroStats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={[
                      "space-y-1",
                      idx !== 0 ? "border-s border-white/20 ps-4" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
            <SurfaceCard accent="rose" padding="p-7">
              <p className="text-sm uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">
                Intelligent Workflow
              </p>
              <div className="mt-6 space-y-6">
                {workflow.map((step, idx) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-lg font-semibold text-gray-900 shadow-sm dark:bg-white/10 dark:text-white">
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-base text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </section>
  );
}
