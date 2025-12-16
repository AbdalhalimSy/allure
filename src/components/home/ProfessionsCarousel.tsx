"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Profession {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export default function ProfessionsCarousel() {
  const { t } = useI18n("home");
  const [scrollPosition, setScrollPosition] = useState(0);

  const professions: Profession[] = [
    {
      id: "actors",
      name: t("professions.actors", "Actors"),
      icon: "🎭",
      count: 248,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "models",
      name: t("professions.models", "Models"),
      icon: "👗",
      count: 512,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "creators",
      name: t("professions.creators", "Content Creators"),
      icon: "🎬",
      count: 381,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "hosts",
      name: t("professions.hosts", "Hosts & MCs"),
      icon: "🎤",
      count: 156,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "dancers",
      name: t("professions.dancers", "Dancers"),
      icon: "💃",
      count: 203,
      color: "from-pink-500 to-red-500",
    },
    {
      id: "voiceover",
      name: t("professions.voiceover", "Voice Actors"),
      icon: "🎙️",
      count: 89,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("carousel-container");
    if (!container) return;

    const scrollAmount = 320;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">
            {t("professions.eyebrow", "Talent Categories")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("professions.title", "Explore Our Talent")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {t("professions.subtitle", "Browse through our diverse roster of talented professionals")}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            id="carousel-container"
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {professions.map((profession) => (
              <Link
                key={profession.id}
                href={`/talents?profession=${profession.id}`}
                className="flex-shrink-0 w-72 group"
              >
                <div className={`h-64 rounded-2xl bg-gradient-to-br ${profession.color} p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl cursor-pointer`}>
                  {/* Background animation */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">{profession.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {profession.name}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                    <p className="text-white/90 text-sm font-medium">
                      {profession.count}{" "}
                      {t("professions.talents", "talents")}
                    </p>
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-16 translate-x-16" />
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-16 top-1/3 z-10 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-16 top-1/3 z-10 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
