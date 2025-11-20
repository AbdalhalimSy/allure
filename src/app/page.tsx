import HeroSection from "@/components/layout/HeroSection";
import Numbers from "@/components/home/Numbers";
import JobsPreview from "@/components/home/JobsPreview";
import TalentsPreview from "@/components/home/TalentsPreview";
import TwinsBanner from "@/components/home/TwinsBanner";
import AboutSnippet from "@/components/home/AboutSnippet";
import Partners from "@/components/home/Partners";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-black">
      {/* Hero */}
      <HeroSection />

      <div className="container mx-auto max-w-7xl space-y-24 px-6 py-24 lg:px-8">
        {/* Numbers */}
        <Numbers />

        {/* Jobs */}
        <JobsPreview />

        {/* Talents */}
        <TalentsPreview />

        {/* Twins banner */}
        <TwinsBanner />

        {/* About */}
        <AboutSnippet />

        {/* Partners */}
        <Partners />
      </div>
    </div>
  );
}
