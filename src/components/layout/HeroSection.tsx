"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { Sparkles, TrendingUp, Clock, Target } from "lucide-react";

const heroStats = [
  { 
    value: "4.2K+", 
    label: "Represented Talents",
    icon: Sparkles,
    color: "from-amber-500 to-yellow-500"
  },
  { 
    value: "380", 
    label: "Active Castings",
    icon: Target,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    value: "92%", 
    label: "Booking Success",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  },
  { 
    value: "24h", 
    label: "Avg Response",
    icon: Clock,
    color: "from-purple-500 to-pink-500"
  },
];

const workflow = [
  {
    step: 1,
    title: "Publish Your Brief",
    description: "Create detailed casting calls with all requirements and specifications.",
  },
  {
    step: 2,
    title: "Get Curated Matches",
    description: "Our AI matches talents based on your specific needs and preferences.",
  },
  {
    step: 3,
    title: "Book & Manage",
    description: "Schedule fittings, callbacks, and finalize selections seamlessly.",
  },
];

type Profession = { id: number; name: string };

export default function HeroSection() {
  const { t, locale } = useI18n();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/lookups/professions?lang=${locale}`);
        if (res.data?.status === "success") {
          setProfessions(res.data.data || []);
        }
      } catch (e) {
        console.error("Failed to load professions for hero", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [locale]);
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-20 top-20 h-96 w-96 animate-pulse rounded-full bg-[#c49a47]/10 blur-3xl" />
        <div className="absolute -end-20 top-40 h-80 w-80 animate-pulse rounded-full bg-amber-400/10 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute start-1/3 -bottom-20 h-72 w-72 animate-pulse rounded-full bg-yellow-400/10 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {/* Main Hero Content */}
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Main Content */}
          <div className="space-y-8 lg:pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49a47]/20 bg-[#c49a47]/5 px-4 py-2 text-sm font-medium text-[#c49a47] backdrop-blur-sm dark:border-[#c49a47]/30 dark:bg-[#c49a47]/10">
              <Sparkles className="h-4 w-4" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl lg:leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/talents"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#c49a47] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#c49a47]/40 active:translate-y-0 sm:text-lg"
              >
                {t("hero.browseTalents")}
                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg active:translate-y-0 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10 sm:text-lg"
              >
                {t("hero.exploreJobs")}
                <Target className="h-5 w-5" />
              </Link>
            </div>

            {/* Professions Carousel */}
            <div className="pt-4">
              <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("hero.exploreProfessions") || "Explore by profession:"}
              </p>
              {isLoading ? (
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"
                    />
                  ))}
                </div>
              ) : (
                <div className="group relative -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex gap-3 pb-2 sm:flex-wrap">
                    {professions.map((profession) => (
                      <Link
                        key={profession.id}
                        href={`/talents?profession_ids=${profession.id}`}
                        className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#c49a47] hover:bg-[#c49a47]/5 hover:text-[#c49a47] hover:shadow-md active:scale-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-[#c49a47] dark:hover:bg-[#c49a47]/10"
                      >
                        {profession.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Workflow */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="rounded-3xl border border-gray-200/50 bg-linear-to-br from-white to-gray-50/50 p-6 shadow-xl backdrop-blur-sm dark:border-white/10 dark:from-white/5 dark:to-white/5 sm:p-8">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {heroStats.map((stat) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/5 dark:bg-white/5"
                    >
                      {/* Icon Background Gradient */}
                      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-linear-to-br ${stat.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
                      
                      <div className="relative">
                        <IconComponent className={`mb-3 h-6 w-6 bg-linear-to-br ${stat.color} bg-clip-text text-transparent`} />
                        <p className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workflow Card */}
            <div className="rounded-3xl border border-gray-200/50 bg-linear-to-br from-[#c49a47]/5 to-amber-50/50 p-6 shadow-xl backdrop-blur-sm dark:border-[#c49a47]/20 dark:from-[#c49a47]/10 dark:to-[#c49a47]/5 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-linear-to-r from-[#c49a47] to-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {t("hero.workflow") || "How It Works"}
                </h3>
              </div>
              <div className="space-y-5">
                {workflow.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#c49a47] to-amber-500 text-lg font-bold text-white shadow-lg shadow-[#c49a47]/30">
                      {item.step}
                    </div>
                    <div className="pt-1">
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
