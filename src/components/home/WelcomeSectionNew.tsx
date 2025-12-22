"use client";

import Image from "next/image";
import { HandHeart, Sparkles } from "lucide-react";

interface WelcomeSectionProps {
  kicker: string;
  title: string;
  subtitle: string;
  pillars: {
    craft: { title: string; desc: string };
    data: { title: string; desc: string };
    support: { title: string; desc: string };
    network: { title: string; desc: string };
  };
  ribbon: string;
  ribbonTitle: string;
  ribbonTag: string;
}

export default function WelcomeSectionNew({
  kicker,
  title,
  subtitle,
  pillars,
  ribbon,
  ribbonTitle,
  ribbonTag,
}: WelcomeSectionProps) {
  return (
    <section className="overflow-hidden bg-linear-to-br from-gray-50 via-white to-[rgba(196,154,71,0.08)] px-6 py-16 dark:from-gray-950 dark:via-black dark:to-gray-950 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left column - Content */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary dark:text-primary">
            {kicker}
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {subtitle}
          </p>

          {/* Pillars grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(pillars).map(([key, pillar]) => (
              <div
                key={key}
                className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900/80"
              >
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.1)] px-3 py-1 text-xs font-semibold text-primary dark:text-primary">
                  <Sparkles className="h-4 w-4" />
                  {pillar.title}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Badges removed per request */}
        </div>

        {/* Right column - Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white/80 shadow-2xl ring-1 ring-white/60 backdrop-blur dark:border-white/10 dark:bg-gray-900/80 dark:ring-white/10">
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
                {ribbon}
              </p>
              <p className="mt-2 text-2xl font-semibold">{ribbonTitle}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur">
                <ShieldIcon />
                {ribbonTag}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CircleIcon removed with badges

function ShieldIcon() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/30">
      <HandHeart className="h-4 w-4" />
    </span>
  );
}
