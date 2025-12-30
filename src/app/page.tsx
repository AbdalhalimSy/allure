"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCountryFilter } from "@/contexts/CountryFilterContext";
import apiClient from "@/lib/api/client";
import {
  HeroBanner,
  ProfessionsSection,
  HomeJobsSection,
  WelcomeSectionNew,
  TalentsSection,
  PartnersSection,
} from "@/components/home";
import type { Talent } from "@/types/talent";
import type { Job } from "@/types/job";

type Profession = {
  id: number;
  name: string;
  description: string;
  accent: string;
  image: string;
};

type Partner = {
  id: number;
  title: string;
  logo: string;
};

const heroArtwork = [
  "https://images.unsplash.com/photo-1539782993767-cd2b2804c3d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1622839238991-d5a092234365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hydrated, activeProfileId } = useAuth();
  const { t, locale } = useI18n();
  const { getCountryId } = useCountryFilter();

  const slides = useMemo(
    () => [
      {
        badge: t("homeNew.hero.badgeCampaigns"),
        title: t("homeNew.hero.slides.0.title"),
        subtitle: t("homeNew.hero.slides.0.subtitle"),
        pulse: t("homeNew.hero.slides.0.pulse"),
        image: heroArtwork[0],
      },
      {
        badge: t("homeNew.hero.badgeProduction"),
        title: t("homeNew.hero.slides.1.title"),
        subtitle: t("homeNew.hero.slides.1.subtitle"),
        pulse: t("homeNew.hero.slides.1.pulse"),
        image: heroArtwork[1],
      },
      {
        badge: t("homeNew.hero.badgePlatform"),
        title: t("homeNew.hero.slides.2.title"),
        subtitle: t("homeNew.hero.slides.2.subtitle"),
        pulse: t("homeNew.hero.slides.2.pulse"),
        image: heroArtwork[2],
      },
    ],
    [t]
  );

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionsLoading, setProfessionsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [talentsLoading, setTalentsLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        setProfessionsLoading(true);
        const res = await apiClient.get(`/lookups/professions?lang=${locale}`);
        if (res.data?.status === "success") {
          const accents = [
            "from-[var(--primary)] to-[#a57b30]",
            "from-sky-400 to-blue-600",
            "from-emerald-400 to-teal-500",
            "from-fuchsia-400 to-purple-500",
            "from-rose-400 to-red-500",
            "from-cyan-400 to-indigo-500",
            "from-[rgba(196,154,71,0.85)] to-[var(--primary)]",
            "from-slate-400 to-slate-600",
          ];
          const curated = (
            res.data.data as Array<{
              id: number;
              name: string;
              description: string | null;
              image: string | null;
            }>
          )
            .slice(0, 8)
            .map((p, idx) => ({
              id: p.id,
              name: p.name,
              description: p.description || t("homeNew.professions.card"),
              accent: accents[idx % accents.length],
              image:
                p.image ||
                `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=70&sig=${idx}`,
            }));
          setProfessions(curated);
        }
      } catch (error) {
        console.error("Failed to load professions", error);
      } finally {
        setProfessionsLoading(false);
      }
    };

    fetchProfessions();
  }, [locale, t]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const res = await apiClient.get(`/lookups/partners`);
        if (res.data?.status === "success") {
          setPartners(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to load partners", error);
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const params = new URLSearchParams({ per_page: "6" });
        const usePublic = !isAuthenticated || !activeProfileId;
        if (!usePublic && activeProfileId) {
          params.append("profile_id", String(activeProfileId));
        }

        // Add country filter if selected
        const countryId = getCountryId();
        if (countryId !== null) {
          params.append("country_ids", String(countryId));
        }

        const res = await fetch(
          `${usePublic ? "/api/public/jobs" : "/api/jobs"}?${params.toString()}`,
          {
            headers: {
              ...(usePublic
                ? {}
                : { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` }),
              "Accept-Language": locale,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.status === "success" || data?.status === true) {
          setJobs(data.data || []);
        }
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [activeProfileId, isAuthenticated, locale, getCountryId]);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setTalentsLoading(true);
        const res = await apiClient.get("/talents?per_page=8");
        if (res.data?.status === "success") {
          setTalents(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to load talents", error);
      } finally {
        setTalentsLoading(false);
      }
    };

    fetchTalents();
  }, []);

  const handleProfessionClick = (id: number) => {
    router.push(`/talents?profession_ids=${id}`);
  };

  return (
 <div className="bg-white text-gray-900 ">
      {/* Hero Banner */}
      <HeroBanner
        slides={slides}
        isAuthenticated={isAuthenticated}
        hydrated={hydrated}
        kicker={t("homeNew.hero.kicker")}
        ctaRegister={t("homeNew.hero.ctaRegister")}
        ctaLogin={t("homeNew.hero.ctaLogin")}
        ctaDashboard={t("homeNew.hero.ctaDashboard")}
        ctaBrowse={t("homeNew.hero.ctaBrowse")}
        metrics={{
          speed: t("homeNew.hero.metrics.speed"),
          profiles: t("homeNew.hero.metrics.profiles"),
          success: t("homeNew.hero.metrics.success"),
        }}
      />

      {/* Professions Section */}
      <ProfessionsSection
        professions={professions}
        loading={professionsLoading}
        kicker={t("homeNew.professions.kicker")}
        title={t("homeNew.professions.title")}
        subtitle={t("homeNew.professions.subtitle")}
        helper={t("homeNew.professions.helper")}
        hint={t("homeNew.professions.hint")}
        label={t("homeNew.professions.label")}
        cta={t("homeNew.professions.cta")}
        loadingText={t("homeNew.professions.loading")}
        emptyText={t("homeNew.professions.empty")}
        onProfessionClick={handleProfessionClick}
      />

      {/* Jobs Section - For all users - Horizontal cards in 2-column grid */}
      <HomeJobsSection
        jobs={jobs}
        loading={jobsLoading}
        kicker={t("homeNew.jobs.kicker")}
        title={t("homeNew.jobs.title")}
        subtitle={t("homeNew.jobs.subtitle")}
        viewAll={t("homeNew.jobs.viewAll")}
        loadingText={t("homeNew.jobs.loading")}
        emptyText={t("homeNew.jobs.empty")}
      />

      {/* Welcome Section */}
      <WelcomeSectionNew
        kicker={t("homeNew.welcome.kicker")}
        title={t("homeNew.welcome.title")}
        subtitle={t("homeNew.welcome.subtitle")}
        pillars={{
          craft: {
            title: t("homeNew.welcome.pillars.craft.title"),
            desc: t("homeNew.welcome.pillars.craft.desc"),
          },
          data: {
            title: t("homeNew.welcome.pillars.data.title"),
            desc: t("homeNew.welcome.pillars.data.desc"),
          },
          support: {
            title: t("homeNew.welcome.pillars.support.title"),
            desc: t("homeNew.welcome.pillars.support.desc"),
          },
          network: {
            title: t("homeNew.welcome.pillars.network.title"),
            desc: t("homeNew.welcome.pillars.network.desc"),
          },
        }}
        ribbon={t("homeNew.welcome.ribbon")}
        ribbonTitle={t("homeNew.welcome.ribbonTitle")}
        ribbonTag={t("homeNew.welcome.ribbonTag")}
      />

      {/* Talents Section */}
      <TalentsSection
        talents={talents}
        loading={talentsLoading}
        kicker={t("homeNew.talents.kicker")}
        title={t("homeNew.talents.title")}
        subtitle={t("homeNew.talents.subtitle")}
        viewAll={t("homeNew.talents.viewAll")}
        loadingText={t("homeNew.talents.loading") || "Loading talents..."}
        emptyText={t("homeNew.talents.empty") || "No talents available"}
      />

      {/* Partners Section */}
      <PartnersSection
        partners={partners}
        loading={partnersLoading}
        kicker={t("homeNew.partners.kicker")}
        title={t("homeNew.partners.title")}
        subtitle={t("homeNew.partners.subtitle")}
        cta={t("homeNew.partners.cta")}
        noPartnersText={
          t("homeNew.partners.noPartners") || "No partners available"
        }
        hideArrows
      />
    </div>
  );
}
