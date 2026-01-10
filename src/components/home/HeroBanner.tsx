"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
} from "lucide-react";
import { getBanners, type Banner } from "@/lib/api/banners";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";

interface HeroBannerProps {
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
  isAuthenticated,
  hydrated,
  kicker,
  ctaRegister,
  ctaDashboard,
  ctaBrowse,
}: HeroBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners from API
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      if (response.success && response.data && response.data.length > 0) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error("Failed to load banners:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Auto-refetch on language change
  useLanguageSwitch(fetchBanners);

  // Auto-play banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6800);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative min-h-[90vh] overflow-hidden bg-gray-900">
        <div className="flex h-[90vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  // If no banners, don't render
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Full-width background image/video */}
      <div className="absolute inset-0">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {banner.media_type === "video" ? (
              <video
                src={banner.media_url}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={banner.media_url}
                alt={banner.title || "Banner"}
                fill
                className="object-cover"
                priority={idx === 0}
                quality={90}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/20 via-black/30 to-black/10" />
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-3 lg:px-6">
          <button
            aria-label="Previous slide"
            onClick={prevSlide}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white/30 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 rtl:scale-x-[-1]" />
          </button>
          <button
            aria-label="Next slide"
            onClick={nextSlide}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white/30 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 rtl:scale-x-[-1]" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center px-12 py-20 lg:px-12 rad">
        <div className="mx-auto w-full max-w-7xl text-center justify-center items-center flex">
          <div className="max-w-3xl space-y-8 animate-fade-in">
            {/* Kicker badge - Find Talents link */}
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/30 hover:border-white/60 hover:scale-105"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{kicker}</span>
            </Link>

            {/* Banner title */}
            {banners[currentSlide]?.title && (
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl xl:text-5xl">
                {banners[currentSlide].title}
              </h1>
            )}

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center">
              {!isAuthenticated && hydrated && (
                <>
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
                  >
                    {ctaRegister}
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:scale-x-[-1]" />
                  </Link>
                </>
              )}

              {isAuthenticated && hydrated && (
                <Link
                  href="/jobs"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
                >
                  {ctaDashboard}
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:scale-x-[-1]" />
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
          </div>
        </div>
      </div>

      {/* Slide indicators - only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 start-1/2 z-20 flex ltr:-translate-x-1/2 rtl:translate-x-1/2 gap-2">
          {banners.map((banner, idx) => (
            <button
              key={banner.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to banner ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
