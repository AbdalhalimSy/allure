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

  const partners = [
    "ADC Bank",
    "Al Jazeera",
    "Colgate",
    "Dubai Fashion Week",
    "Expo 2020",
    "Hardee's",
    "KFC",
    "Kinder",
    "Lay's",
    "Lexus",
    "L'Oréal",
    "McDonald's",
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
              Established in 2009 and deeply rooted in Lebanon, we have
              flourished into a distinguished casting and modeling agency
              celebrated for our steadfast commitment to excellence, creativity,
              and superior service.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We are powered by a dynamic team of seasoned professionals,
              including casting directors, crew members, editors, photographers,
              and videographers, all dedicated to bringing your vision to life
              with precision and artistry.
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
                In a recent and exhilarating development, we extended our reach
                to the vibrant city of Dubai, establishing a second branch, and
                later to Abu Dhabi, marking our third branch.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                This expansion is a testament to our unwavering dedication to
                growth and our enthusiasm for exploring new horizons to serve
                our clients in exciting and innovative ways. We eagerly embrace
                the opportunities this expansion presents and remain ardent in
                our commitment to continue offering unparalleled service.
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

      {/* Partners Section */}
      <section className="bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <SectionHeader
            align="center"
            eyebrow="Trusted By"
            title="Partners"
            description="We have worked with some of the best names in the market. Be one of them!"
          />
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {partners.map((partner) => (
              <SurfaceCard
                key={partner}
                className="flex items-center justify-center p-6 transition-all hover:scale-105"
              >
                <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {partner}
                </p>
              </SurfaceCard>
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
