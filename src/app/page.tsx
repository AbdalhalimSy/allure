import HeroSection from "@/components/layout/HeroSection";
import FeaturedTalents from "@/components/cards/FeaturedTalents";
import FeaturedCastings from "@/components/cards/FeaturedCastings";
import AgencyIntro from "@/components/layout/AgencyIntro";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-black">
      <HeroSection />
      <div className="container mx-auto max-w-7xl space-y-24 px-6 py-24 lg:px-8">
        <FeaturedTalents />
        <FeaturedCastings />
        <AgencyIntro />
      </div>
    </div>
  );
}
