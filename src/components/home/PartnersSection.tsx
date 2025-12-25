"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import HorizontalCarousel, {
  HorizontalCarouselItem,
} from "@/components/ui/HorizontalCarousel";

interface Partner {
  id: number;
  title: string;
  logo: string;
}

interface PartnersSectionProps {
  partners: Partner[];
  loading: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  noPartnersText: string;
  hideArrows?: boolean;
}

export default function PartnersSection({
  partners,
  loading,
  kicker,
  title,
  subtitle,
  cta,
  noPartnersText,
  hideArrows = false,
}: PartnersSectionProps) {
  return (
    <section className="px-6 pb-20 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10 pt-16">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
 <p className="text-sm uppercase tracking-[0.3em] text-primary ">
              {kicker}
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
 <p className="text-gray-700 ">{subtitle}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
            <Users className="h-4 w-4" />
            {cta}
          </div>
        </div>

        {/* Partners carousel */}
        <div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : partners.length > 0 ? (
            <HorizontalCarousel
              items={partners.map<HorizontalCarouselItem<Partner>>((p) => ({
                key: p.id,
                data: p,
              }))}
              renderItem={({ data }) => (
 <div className="flex h-28 w-52 items-center justify-center rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 shadow-md transition hover:-translate-y-1 hover:border-[rgba(196,154,71,0.35)] hover:shadow-xl ">
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
              arrows={!hideArrows}
              loop
              itemGap={24}
            />
          ) : (
 <div className="py-8 text-center text-gray-500 ">
              {noPartnersText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
