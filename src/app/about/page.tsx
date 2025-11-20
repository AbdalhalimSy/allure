import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  const stats = [
    { value: "2009", label: "Established" },
    { value: "3", label: "Branches" },
    { value: "500+", label: "Talents" },
    { value: "1000+", label: "Projects" },
  ];

  const partnerLogos = [
    { name: "McDonald's", src: "https://allureagencys.com//front/widgets/hp-trusted-by/McDonalds.png" },
    { name: "ADC Bank", src: "https://allureagencys.com//front/widgets/hp-trusted-by/adc bank.png" },
    { name: "Al Jazeera", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Al Jazeera.png" },
    { name: "Colgate", src: "https://allureagencys.com//front/widgets/hp-trusted-by/colgate.png" },
    { name: "Dubai Fashion Week", src: "https://allureagencys.com//front/widgets/hp-trusted-by/dubai fashion week.png" },
    { name: "Expo 2020", src: "https://allureagencys.com//front/widgets/hp-trusted-by/expo 2020.png" },
    { name: "Hardee's", src: "https://allureagencys.com//front/widgets/hp-trusted-by/hardees.png" },
    { name: "KFC", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Kfc.png" },
    { name: "Kinder", src: "https://allureagencys.com//front/widgets/hp-trusted-by/kinder.png" },
    { name: "Lay's", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Lays.png" },
    { name: "Lexus", src: "https://allureagencys.com//front/widgets/hp-trusted-by/Lexus.png" },
    { name: "L'Oréal", src: "https://allureagencys.com//front/widgets/hp-trusted-by/oreal.png" },
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              About <span className="text-[#c49a47]">Allure</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              A distinguished casting and modeling agency celebrated for
              excellence, creativity, and superior service across the Middle
              East.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <SurfaceCard key={stat.label} className="p-6 text-center">
                <div className="text-4xl font-bold text-[#c49a47]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://allureagencys.com//front/widgets/about-widget/welcome.jpg"
              alt="Allure Agency"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-block rounded-full bg-[#c49a47]/10 px-4 py-1.5 text-sm font-semibold text-[#c49a47]">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to Allure Media Agency
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Founded in Lebanon in 2009, Allure evolved from a boutique roster into a regional casting and modeling partner trusted for disciplined scouting, creative collaboration, and production reliability.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Our multidisciplinary team—casting directors, production crew, editors, photographers, and videographers—translates briefs into polished selections supported by refreshed digitals, reels, and transparent availability.
            </p>
          </div>
        </div>
      </section>

      {/* Expansion Story */}
      <section className="bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block rounded-full bg-[#c49a47]/10 px-4 py-1.5 text-sm font-semibold text-[#c49a47]">
                  Our History
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Expanding Across the Region
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Responding to growing regional demand we expanded to Dubai and later Abu Dhabi—forming a tri‑city presence that gives productions diverse talent pools with on‑the‑ground support.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Each new branch strengthens our promise: curated representation, faster booking cycles, and a unified workflow that reduces friction from first brief to final usage.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/talent">
                  <Button variant="primary">Become a Talent</Button>
                </Link>
                <Link href="/casting">
                  <Button variant="secondary">Find a Job</Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:order-first">
              <Image
                src="https://allureagencys.com//front/widgets/hp-welcome-to-allure/image.jpg"
                alt="Allure Expansion"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Talents */}
      <section className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Our Roster"
          title="Meet our talented and creative professionals"
          description="Discover the diverse range of exceptional talents who bring creativity and professionalism to every project."
        />
        <div className="mt-12 text-center">
          <Link href="/talent">
            <Button variant="primary" className="px-8 py-4">
              Check All Talents
            </Button>
          </Link>
        </div>
      </section>

      {/* Partners Section (Logo Grid) */}
      <section className="bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <SectionHeader
            align="center"
            eyebrow="Trusted By"
            title="Partners"
            description="We have worked with some of the best names in the market. Be one of them!"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {partnerLogos.map((p) => (
              <div
                key={p.name}
                className="flex h-24 w-full items-center justify-center rounded-2xl border border-gray-200/60 bg-white px-4 shadow-sm transition-colors hover:border-[#c49a47] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#d4a855]"
              >
                <Image
                  src={p.src}
                  alt={p.name}
                  width={180}
                  height={72}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SurfaceCard className="overflow-hidden bg-gradient-to-br from-[#c49a47] to-[#a58138] p-12 text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Ready to work with us?</h2>
          <p className="mb-8 text-lg opacity-90">
            Whether you&apos;re a talent looking to join our roster or a client
            seeking the perfect cast, let&apos;s start a conversation.
          </p>
          <Link href="/contact">
            <Button
              variant="secondary"
              className="bg-white text-[#c49a47] hover:bg-gray-100"
            >
              Get in Touch
            </Button>
          </Link>
        </SurfaceCard>
      </section>
    </div>
  );
}
