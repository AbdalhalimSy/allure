"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { PartnersSection } from "@/components/home";
import {
  Award,
  Users,
  Globe,
  Heart,
  Sparkles,
  Target,
  Shield,
  Palette,
  Camera,
  UserCheck,
  Megaphone,
  Lightbulb,
  ArrowRight,
  Briefcase,
} from "lucide-react";

type Partner = {
  id: number;
  title: string;
  logo: string;
};

export default function AboutPage() {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

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

  const stats = [
    {
      value: t("about.stats.established.value"),
      label: t("about.stats.established.label"),
      icon: Award,
    },
    {
      value: t("about.stats.branches.value"),
      label: t("about.stats.branches.label"),
      icon: Globe,
    },
    {
      value: t("about.stats.talents.value"),
      label: t("about.stats.talents.label"),
      icon: Users,
    },
    {
      value: t("about.stats.projects.value"),
      label: t("about.stats.projects.label"),
      icon: Target,
    },
  ];

  const values = [
    {
      icon: Sparkles,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.description"),
      color: "from-[var(--primary)] to-[#a57b30]",
    },
    {
      icon: Palette,
      title: t("about.values.creativity.title"),
      description: t("about.values.creativity.description"),
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Shield,
      title: t("about.values.integrity.title"),
      description: t("about.values.integrity.description"),
      color: "from-sky-400 to-blue-600",
    },
    {
      icon: Heart,
      title: t("about.values.diversity.title"),
      description: t("about.values.diversity.description"),
      color: "from-fuchsia-400 to-purple-500",
    },
  ];

  const services = [
    {
      icon: Camera,
      title: t("about.services.casting.title"),
      description: t("about.services.casting.description"),
      color: "from-rose-400 to-red-500",
    },
    {
      icon: UserCheck,
      title: t("about.services.management.title"),
      description: t("about.services.management.description"),
      color: "from-cyan-400 to-indigo-500",
    },
    {
      icon: Megaphone,
      title: t("about.services.production.title"),
      description: t("about.services.production.description"),
      color: "from-[rgba(196,154,71,0.85)] to-[var(--primary)]",
    },
    {
      icon: Lightbulb,
      title: t("about.services.consultation.title"),
      description: t("about.services.consultation.description"),
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-96 w-96 rounded-full bg-[rgba(196,154,71,0.15)] blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary dark:bg-[rgba(196,154,71,0.15)] dark:text-primary">
              <Briefcase className="h-4 w-4" />
              {t("about.hero.badge")}
            </p>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("about.hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900/90"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-[rgba(196,154,71,0.05)] to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="relative">
                    <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <div className="text-4xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative px-6 py-16 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Allure Agency Team"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold text-primary dark:bg-[rgba(196,154,71,0.15)]">
                  {t("about.story.badge")}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                {t("about.story.title")}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {t("about.story.subtitle")}
              </p>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>{t("about.story.paragraph1")}</p>
                <p>{t("about.story.paragraph2")}</p>
                <p>{t("about.story.paragraph3")}</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/talents">
                  <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                    {t("about.story.ctaPrimary")}
                    <ArrowRight
                      className={`h-4 w-4 ${isRTL ? "scale-x-[-1]" : ""}`}
                    />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/5">
                    {t("about.story.ctaSecondary")}
                    <ArrowRight
                      className={`h-4 w-4 ${isRTL ? "scale-x-[-1]" : ""}`}
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expansion Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 px-6 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
              <div>
                <span className="inline-block rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {t("about.expansion.badge")}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                {t("about.expansion.title")}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {t("about.expansion.subtitle")}
              </p>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>{t("about.expansion.paragraph1")}</p>
                <p>{t("about.expansion.paragraph2")}</p>
                <p>{t("about.expansion.paragraph3")}</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/talents">
                  <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                    {t("about.expansion.ctaPrimary")}
                    <ArrowRight
                      className={`h-4 w-4 ${isRTL ? "scale-x-[-1]" : ""}`}
                    />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary/5">
                    {t("about.expansion.ctaSecondary")}
                    <ArrowRight
                      className={`h-4 w-4 ${isRTL ? "scale-x-[-1]" : ""}`}
                    />
                  </button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Allure Expansion"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
              {t("about.values.badge")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {t("about.values.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("about.values.subtitle")}
            </p>
          </div>

          {/* Values Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900"
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${value.color} opacity-0 transition group-hover:opacity-5`}
                  />

                  <div className="relative space-y-4">
                    <div
                      className={`inline-flex rounded-2xl bg-linear-to-br ${value.color} p-3 text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 px-6 py-16 dark:from-gray-950 dark:via-black dark:to-gray-950 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
              {t("about.services.badge")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {t("about.services.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("about.services.subtitle")}
            </p>
          </div>

          {/* Services Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900/90"
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-0 transition group-hover:opacity-10`}
                  />

                  <div className="relative space-y-4">
                    <Icon className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section (reuse home component) */}
      <PartnersSection
        partners={partners}
        loading={partnersLoading}
        kicker={t("about.partners.badge")}
        title={t("homeNew.partners.title")}
        subtitle={t("homeNew.partners.subtitle")}
        cta={t("homeNew.partners.cta")}
        noPartnersText={t("about.partners.noPartners")}
        hideArrows
      />

      {/* CTA Section removed per request */}
    </div>
  );
}
