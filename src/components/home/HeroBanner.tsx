"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Waves,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface HeroSlide {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  pulse: string;
}

interface HeroBannerProps {
  slides: HeroSlide[];
  isAuthenticated: boolean;
  hydrated: boolean;
  kicker: string;
  ctaRegister: string;
  ctaLogin: string;
  ctaDashboard: string;
  ctaBrowse: string;
  metrics: {
    speed: string;
    profiles: string;
    success: string;
  };
}

export default function HeroBanner({
  slides,
  isAuthenticated,
  hydrated,
  kicker,
  ctaRegister,
  ctaLogin,
  ctaDashboard,
  ctaBrowse,
  metrics,
}: HeroBannerProps) {
  const { locale } = useI18n();
  const isRTL = locale === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6800);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={idx === 0}
              quality={90}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-3 lg:px-6">
        <button
          aria-label="Previous slide"
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white/30 hover:scale-110"
        >
          <ChevronLeft className={`h-6 w-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
        </button>
        <button
          aria-label="Next slide"
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white/30 hover:scale-110"
        >
          <ChevronRight className={`h-6 w-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center px-12 py-20 lg:px-12 rad">
        <div className="mx-auto w-full max-w-7xl text-center justify-center items-center flex">
          <div className="max-w-3xl space-y-8 animate-fade-in">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{kicker}</span>
            </div>

            {/* Slide badge */}
            <p className="text-sm uppercase tracking-[0.3em] text-white/90">
              {slides[currentSlide].badge}
            </p>

            {/* Main heading */}
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-3xl xl:text-4xl">
              {slides[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-xl text-white/90">
              {slides[currentSlide].subtitle}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center">
              {!isAuthenticated && hydrated && (
                <>
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
                  >
                    {ctaRegister}
                    <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-1 ${isRTL ? "scale-x-[-1]" : ""}`} />
                  </Link>
                  
                </>
              )}

              {isAuthenticated && hydrated && (
                <Link
                  href="/jobs"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
                >
                  {ctaDashboard}
                  <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-1 ${isRTL ? "scale-x-[-1]" : ""}`} />
                </Link>
              )}

              <Link
                href="/talents"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition hover:scale-105"
              >
                <Play className="h-5 w-5" />
                {ctaBrowse}
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                { value: "48h", label: metrics.speed },
                { value: "12k", label: metrics.profiles },
                { value: "92%", label: metrics.success },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/30 bg-white/20 p-5 shadow-lg backdrop-blur-md transition hover:bg-white/30 hover:scale-105"
                >
                  <p className="text-3xl font-bold text-primary">
                    {metric.value}
                  </p>
                  <p className="text-sm text-white/90">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Pulse indicator */}
            <div className="flex items-center gap-2 text-white/80 justify-center">
              <Waves className="h-4 w-4 animate-pulse" />
              <span className="text-sm uppercase tracking-[0.2em]">
                {slides[currentSlide].pulse}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
