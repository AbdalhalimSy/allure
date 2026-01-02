"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TwinsSectionProps {
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  backgroundImage: string;
}

export default function TwinsSection({
  kicker,
  title,
  subtitle,
  cta,
  backgroundImage,
}: TwinsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gray-900 px-6 py-24 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Twins Models"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.2)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4a855] backdrop-blur-sm">
          {kicker}
        </p>

        {/* Title */}
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 sm:text-xl">
          {subtitle}
        </p>

        {/* CTA Button */}
        <Link
          href="/talents?twins=true"
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47] bg-size-200 bg-pos-0 px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-500 hover:bg-pos-100 hover:shadow-xl hover:scale-105"
        >
          {cta}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c49a47]/20 blur-3xl" />
        <div className="absolute -end-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#d4a855]/20 blur-3xl" />
      </div>
    </section>
  );
}
