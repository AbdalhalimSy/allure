"use client";

import Image from "next/image";
import Link from "next/link";
import SurfaceCard from "@/components/ui/SurfaceCard";

export default function TwinsBanner() {
  return (
    <section>
      <SurfaceCard className="overflow-hidden p-0">
        <div className="grid items-center gap-0 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Twins & Siblings Spotlight</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Got a twin or sibling duo? We regularly book twins for campaigns across fashion and film.
              Share your profile and get discovered.
            </p>
            <div className="mt-6">
              <Link href="/register" className="rounded-full bg-[#c49a47] px-5 py-2.5 text-sm font-semibold text-white shadow">
                Join as Twins
              </Link>
            </div>
          </div>
          <div className="relative aspect-16/10 md:aspect-auto md:h-full">
            <Image
              src="https://allureagencys.com/front/widgets/hp-twins-models/image.jpg"
              alt="Twins banner"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </SurfaceCard>
    </section>
  );
}
