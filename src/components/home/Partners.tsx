"use client";

import Image from "next/image";
import HorizontalCarousel, { HorizontalCarouselItem } from "@/components/ui/HorizontalCarousel";

const partners = [
  { name: "McDonald's", src: "https://allureagencys.com//front/widgets/hp-trusted-by/McDonalds.png" },
  { name: "ADC Bank", src: "https://allureagencys.com//front/widgets/hp-trusted-by/adc bank.png" },
  { name: "Al Jazeera", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Al Jazeera.png" },
  { name: "Colgate", src: "https://allureagencys.com//front/widgets/hp-trusted-by/colgate.png" },
  { name: "Dubai Fashion Week", src: "https://allureagencys.com//front/widgets/hp-trusted-by/dubai fashion week.png" },
  { name: "Expo 2020", src: "https://allureagencys.com//front/widgets/hp-trusted-by/expo 2020.png" },
  { name: "Hardee's", src: "https://allureagencys.com//front/widgets/hp-trusted-by/hardees.png" },
  { name: "KFC", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Kfc.png" },
  { name: "Kinder", src: "https://allureagencys.com//front/widgets/hp-trusted-by/kinder.png" },
  { name: "Lays", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Lays.png" },
  { name: "Lexus", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Lexus.png" },
  { name: "L'Oréal", src: "https://allureagencys.com//front/widgets/hp-trusted-by/oreal.png" },
];

export default function Partners() {
  return (
    <section>
      <div className="text-center">
        <h3 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">Trusted by partners</h3>
      </div>
      <div className="mt-6">
        <HorizontalCarousel
          items={partners.map<HorizontalCarouselItem<typeof partners[0]>>((p, i) => ({ key: p.name + i, data: p }))}
          renderItem={({ data }) => (
            <div className="flex h-24 w-52 items-center justify-center rounded-2xl border border-gray-200/60 bg-white px-4 shadow-sm transition-colors hover:border-[#c49a47] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#d4a855]">
              <Image src={data.src} alt={data.name} width={200} height={80} className="max-h-16 w-auto object-contain" />
            </div>
          )}
          autoScroll
          autoScrollPxPerSecond={50}
          arrows
          loop
          itemGap={32}
        />
      </div>
    </section>
  );
}
