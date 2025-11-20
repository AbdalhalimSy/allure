"use client";

import Image from "next/image";
import SurfaceCard from "@/components/ui/SurfaceCard";

export default function AboutSnippet() {
  return (
    <section>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src="https://allureagencys.com//front/widgets/hp-welcome-to-allure/image.jpg"
            alt="Welcome to Allure Agency"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">About Allure Agency</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Allure is a boutique, tech‑forward casting and talent platform built for brands across the Middle East.
            We combine agency expertise with a modern, streamlined workflow to help teams source, evaluate, and book
            talent with cinematic precision.
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Whether you're casting for fashion, commercials, film, or creators — Allure is your centralized
            workspace from brief to booking.
          </p>
        </div>
      </div>
    </section>
  );
}
