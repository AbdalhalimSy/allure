"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Film,
  Flame,
  HandHeart,
  Layers,
  Play,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import HorizontalCarousel, { HorizontalCarouselItem } from "@/components/ui/HorizontalCarousel";

type Profession = {
  id: number;
  name: string;
  description: string;
  accent: string;
  image: string;
};
type TalentCard = {
  name: string;
  focus: string;
  location: string;
  tags: string[];
  image: string;
};
type Slide = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  pulse: string;
};
type UpcomingJob = {
  id: number;
  title: string;
  location: string;
  timeline: string;
  rate?: string;
};

const heroArtwork = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hydrated, activeProfileId } = useAuth();
  const { t, locale } = useI18n();

  const slides: Slide[] = useMemo(
    () => [
      {
        badge: t("homeNew.hero.badgeCampaigns"),
        title: t("homeNew.hero.slides.0.title"),
        subtitle: t("homeNew.hero.slides.0.subtitle"),
        pulse: t("homeNew.hero.slides.0.pulse"),
        image: heroArtwork[0],
      },
      {
        badge: t("homeNew.hero.badgeProduction"),
        title: t("homeNew.hero.slides.1.title"),
        subtitle: t("homeNew.hero.slides.1.subtitle"),
        pulse: t("homeNew.hero.slides.1.pulse"),
        image: heroArtwork[1],
      },
      {
        badge: t("homeNew.hero.badgePlatform"),
        title: t("homeNew.hero.slides.2.title"),
        subtitle: t("homeNew.hero.slides.2.subtitle"),
        pulse: t("homeNew.hero.slides.2.pulse"),
        image: heroArtwork[2],
      },
    ],
    [t]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionsLoading, setProfessionsLoading] = useState(false);
  const [upcomingJobs, setUpcomingJobs] = useState<UpcomingJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [partners, setPartners] = useState<{ id: number; title: string; logo: string }[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6800);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setProfessionsLoading(true);
        const res = await apiClient.get(`/lookups/professions?lang=${locale}`);
        if (res.data?.status === "success") {
          const accents = [
            "from-[var(--primary)] to-[#a57b30]",
            "from-sky-400 to-blue-600",
            "from-emerald-400 to-teal-500",
            "from-fuchsia-400 to-purple-500",
            "from-rose-400 to-red-500",
            "from-cyan-400 to-indigo-500",
            "from-[rgba(196,154,71,0.85)] to-[var(--primary)]",
            "from-slate-400 to-slate-600",
          ];
          const curated = (res.data.data as Array<{ id: number; name: string }>)
            .slice(0, 8)
            .map((p, idx) => ({
              id: p.id,
              name: p.name,
              description: t("homeNew.professions.card"),
              accent: accents[idx % accents.length],
              image: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=70&sig=${idx}`,
            }));
          setProfessions(curated);
        }
      } catch (error) {
        console.error("Failed to load professions", error);
      } finally {
        setProfessionsLoading(false);
      }
    };

    fetchProfessions();
  }, [locale, t]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const res = await apiClient.get(`/lookups/partners`);
        if (res.data?.status === "success") {
          setPartners(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to load partners", error);
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchUpcomingJobs = async () => {
      if (!isAuthenticated || !activeProfileId) return;
      try {
        setJobsLoading(true);
        const params = new URLSearchParams({
          profile_id: String(activeProfileId),
          per_page: "4",
        });
        const res = await fetch(`/api/jobs?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
            "Accept-Language": locale,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.status === "success" || data?.status === true) {
          const jobs: UpcomingJob[] = (data.data || []).map((job: any) => ({
            id: job.id,
            title: job.title || job.role_title,
            location:
              job.country?.name ||
              job.location ||
              t("homeNew.jobs.defaultLocation"),
            timeline: job.deadline || job.start_date || "",
            rate: job.rate || job.budget,
          }));
          setUpcomingJobs(jobs);
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchUpcomingJobs();
  }, [activeProfileId, isAuthenticated, locale, t]);

  const talentShowcase: TalentCard[] = useMemo(
    () => [
      {
        name: "Layla Arif",
        focus: t("homeNew.talents.cards.0.focus"),
        location: "Dubai, UAE",
        tags: [
          t("homeNew.talents.tags.height"),
          t("homeNew.talents.tags.languages"),
          t("homeNew.talents.tags.availability"),
        ],
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Omar El Fayed",
        focus: t("homeNew.talents.cards.1.focus"),
        location: "Riyadh, KSA",
        tags: [
          t("homeNew.talents.tags.camera"),
          t("homeNew.talents.tags.voice"),
          t("homeNew.talents.tags.motion"),
        ],
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Sofia Haddad",
        focus: t("homeNew.talents.cards.2.focus"),
        location: "Beirut, Lebanon",
        tags: [
          t("homeNew.talents.tags.hosting"),
          t("homeNew.talents.tags.bilingual"),
          t("homeNew.talents.tags.ready"),
        ],
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80&sat=-20",
      },
    ],
    [t]
  );

  const handleProfessionClick = (id: number) => {
    router.push(`/talents?profession_ids=${id}`);
  };

  return (
    <div className="bg-white text-gray-900 dark:bg-black dark:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.18)] via-white to-emerald-200/20 dark:from-[rgba(196,154,71,0.12)] dark:via-gray-900 dark:to-emerald-500/10" />
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[rgba(196,154,71,0.2)] blur-3xl" />
          <div className="absolute right-20 bottom-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>

        <div className="relative grid items-center gap-12 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-20 xl:px-16">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur dark:border-white/10 dark:bg-gray-900/70">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("homeNew.hero.kicker")}</span>
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-700 dark:text-gray-300">
                {slides[currentSlide].badge}
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl xl:text-6xl">
                {slides[currentSlide].title}
              </h1>
              <p className="max-w-2xl text-lg text-gray-700/80 dark:text-gray-300">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {!isAuthenticated && hydrated && (
                <>
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl dark:bg-white dark:text-black"
                  >
                    {t("homeNew.hero.ctaRegister")}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-5 py-3 text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-xl dark:border-white/20 dark:bg-gray-900/80 dark:text-white"
                  >
                    {t("homeNew.hero.ctaLogin")}
                  </Link>
                </>
              )}

              {isAuthenticated && hydrated && (
                <Link
                  href="/jobs"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-black shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {t("homeNew.hero.ctaDashboard")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              )}

              <Link
                href="/talents"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 dark:text-primary"
              >
                <Play className="h-4 w-4" />
                {t("homeNew.hero.ctaBrowse")}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                t("homeNew.hero.metrics.speed"),
                t("homeNew.hero.metrics.profiles"),
                t("homeNew.hero.metrics.success"),
              ].map((item, idx) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80"
                >
                  <p className="text-2xl font-semibold text-primary dark:text-primary">
                    {idx === 0 ? "48h" : idx === 1 ? "12k" : "92%"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-white/60 to-white/20 shadow-2xl backdrop-blur dark:from-white/10 dark:to-white/5" />
            <div className="relative overflow-hidden rounded-4xl border border-white/50 shadow-2xl ring-1 ring-white/40 dark:border-white/10 dark:ring-white/5">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                width={1200}
                height={900}
                className="h-[420px] w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  <Waves className="h-3.5 w-3.5" />
                  <span>{slides[currentSlide].pulse}</span>
                </div>
                <p className="text-lg font-medium leading-snug text-white/90">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
              <div className="absolute inset-x-0 top-0 flex justify-between p-4">
                <button
                  aria-label="Previous slide"
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + slides.length) % slides.length
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/50 text-gray-900 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/15 dark:bg-gray-900/70 dark:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next slide"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % slides.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/50 text-gray-900 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/15 dark:bg-gray-900/70 dark:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-16 lg:px-12">
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />
        <div className="relative mx-auto max-w-6xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary dark:bg-[rgba(196,154,71,0.15)] dark:text-primary">
            {t("homeNew.professions.kicker")}
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            {t("homeNew.professions.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-700 dark:text-gray-300">
            {t("homeNew.professions.subtitle")}
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <HandHeart className="h-4 w-4" />
              <span>{t("homeNew.professions.helper")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-[rgba(196,154,71,0.15)] px-2 py-1 text-primary dark:text-primary">
                {t("homeNew.professions.hint")}
              </span>
            </div>
          </div>

          <div
            className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {professionsLoading && (
              <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-[rgba(196,154,71,0.35)] px-6 py-10 text-sm text-primary dark:border-[rgba(196,154,71,0.35)] dark:text-primary">
                {t("homeNew.professions.loading")}
              </div>
            )}
            {!professionsLoading && professions.length === 0 && (
              <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                {t("homeNew.professions.empty")}
              </div>
            )}
            {professions.map((profession) => (
              <button
                key={profession.id}
                onClick={() => handleProfessionClick(profession.id)}
                className="group relative min-w-60 flex-1 scroll-ml-6 rounded-3xl border border-gray-100 bg-white/90 p-6 text-left transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-gray-900/90"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-br ${profession.accent} opacity-0 transition group-hover:opacity-5`}
                  aria-hidden
                />
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gray-100 shadow-inner ring-1 ring-white/50 dark:bg-gray-800">
                    <Image
                      src={profession.image}
                      alt={profession.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.2em] text-primary dark:text-primary">
                      {t("homeNew.professions.label")}
                    </p>
                    <p className="text-lg font-semibold">{profession.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profession.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1 text-xs font-semibold text-primary transition group-hover:bg-[rgba(196,154,71,0.18)] dark:text-primary">
                  <Layers className="h-4 w-4" />
                  {t("homeNew.professions.cta")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary dark:text-primary">
                  {t("homeNew.jobs.kicker")}
                </p>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  {t("homeNew.jobs.title")}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("homeNew.jobs.subtitle")}
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/15 dark:hover:border-primary"
              >
                {t("homeNew.jobs.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {jobsLoading && (
                <div className="col-span-2 flex items-center justify-center rounded-3xl border border-gray-200 p-8 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
                  {t("homeNew.jobs.loading")}
                </div>
              )}

              {!jobsLoading && upcomingJobs.length === 0 && (
                <div className="col-span-2 rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                  {t("homeNew.jobs.empty")}
                </div>
              )}

              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-[rgba(196,154,71,0.35)] hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/80"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.06)] via-transparent to-emerald-400/5 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-primary dark:text-primary">
                    <BadgeCheck className="h-4 w-4" />
                    {t("homeNew.jobs.badge")}
                  </div>
                  <h3 className="relative mt-3 text-xl font-semibold">
                    {job.title}
                  </h3>
                  <p className="relative mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {job.location}
                  </p>
                  <div className="relative mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1 text-primary dark:text-primary">
                      <Film className="h-4 w-4" />
                      {job.timeline || t("homeNew.jobs.timeline")}
                    </span>
                    {job.rate && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-200">
                        <Flame className="h-4 w-4" />
                        {job.rate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden bg-linear-to-br from-gray-50 via-white to-[rgba(196,154,71,0.08)] px-6 py-16 dark:from-gray-950 dark:via-black dark:to-gray-950 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary dark:text-primary">
              {t("homeNew.welcome.kicker")}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("homeNew.welcome.title")}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t("homeNew.welcome.subtitle")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {["craft", "data", "support", "network"].map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80"
                >
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1 text-xs font-semibold text-primary dark:text-primary">
                    <Sparkles className="h-4 w-4" />
                    {t(`homeNew.welcome.pillars.${key}.title`)}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t(`homeNew.welcome.pillars.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {["casting", "production", "delivery"].map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm dark:bg-gray-800/80 dark:text-white"
                >
                  <CircleIcon />
                  {t(`homeNew.welcome.badges.${key}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white/80 shadow-xl ring-1 ring-white/60 backdrop-blur dark:border-white/10 dark:bg-gray-900/80 dark:ring-white/10">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1100&q=80"
                alt="Allure casting studio"
                width={1100}
                height={900}
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                  {t("homeNew.welcome.ribbon")}
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {t("homeNew.welcome.ribbonTitle")}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
                  <ShieldIcon />
                  {t("homeNew.welcome.ribbonTag")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary dark:text-primary">
                {t("homeNew.talents.kicker")}
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {t("homeNew.talents.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t("homeNew.talents.subtitle")}
              </p>
            </div>
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/15 dark:hover:border-primary"
            >
              {t("homeNew.talents.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {talentShowcase.map((talent) => (
              <div
                key={talent.name}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/80 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-gray-900/80"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.06)] via-transparent to-emerald-400/5 opacity-0 transition group-hover:opacity-100" />
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={talent.image}
                    alt={talent.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                      {talent.focus}
                    </p>
                    <h3 className="text-xl font-semibold">{talent.name}</h3>
                    <p className="text-sm text-white/80">{talent.location}</p>
                  </div>
                </div>
                <div className="relative space-y-2 p-4">
                  <div className="flex flex-wrap gap-2">
                    {talent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1 text-xs font-semibold text-primary dark:text-primary"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm text-primary transition group-hover:text-primary dark:text-primary">
                    <span>{t("homeNew.talents.book")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-10 rounded-4xl border border-gray-100 bg-linear-to-br from-white/80 via-white to-[rgba(196,154,71,0.08)] p-10 shadow-2xl backdrop-blur dark:border-white/10 dark:from-gray-950/80 dark:via-black dark:to-gray-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary dark:text-primary">
                {t("homeNew.partners.kicker")}
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {t("homeNew.partners.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t("homeNew.partners.subtitle")}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-white dark:text-white">
              <Users className="h-4 w-4" />
              {t("homeNew.partners.cta")}
            </div>
          </div>

          <div>
            {partnersLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : partners.length > 0 ? (
              <HorizontalCarousel
                items={partners.map<HorizontalCarouselItem<typeof partners[0]>>((p) => ({
                  key: p.id,
                  data: p,
                }))}
                renderItem={({ data }) => (
                  <div className="flex h-28 w-52 items-center justify-center rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 shadow-inner transition hover:-translate-y-1 hover:border-[rgba(196,154,71,0.35)] hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80">
                    <Image
                      src={data.logo}
                      alt={data.title}
                      width={200}
                      height={80}
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                )}
                autoScroll
                autoScrollPxPerSecond={50}
                arrows
                loop
                itemGap={24}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t("homeNew.partners.noPartners") || "No partners available"}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CircleIcon() {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full bg-primary"
      aria-hidden
    />
  );
}

function ShieldIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/30">
      <HandHeart className="h-4 w-4" />
    </span>
  );
}
