"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCountryFilter } from "@/contexts/CountryFilterContext";
import apiClient from "@/lib/api/client";
import {
  HeroBanner,
  HomeJobsSection,
  WelcomeSectionNew,
  TalentsSection,
  PartnersSection,
  TwinsSection,
} from "@/components/home";
import type { Talent } from "@/types/talent";
import type { Job } from "@/types/job";

// type Profession = {
//   id: number;
//   name: string;
//   description: string;
//   accent: string;
//   image: string;
// };

type Partner = {
  id: number;
  title: string;
  logo: string;
};

export default function HomePage() {
  // const router = useRouter();
  const { isAuthenticated, hydrated, activeProfileId } = useAuth();
  const { t, locale } = useI18n();
  const { getCountryId } = useCountryFilter();

  // const [professions, setProfessions] = useState<Profession[]>([]);
  // const [professionsLoading, setProfessionsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [talentsLoading, setTalentsLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  // useEffect(() => {
  //   const fetchProfessions = async () => {
  //     try {
  //       setProfessionsLoading(true);
  //       const res = await apiClient.get(`/lookups/professions?lang=${locale}`);
  //       if (res.data?.status === "success") {
  //         const accents = [
  //           "from-[var(--primary)] to-[#a57b30]",
  //           "from-sky-400 to-blue-600",
  //           "from-emerald-400 to-teal-500",
  //           "from-fuchsia-400 to-purple-500",
  //           "from-rose-400 to-red-500",
  //           "from-cyan-400 to-indigo-500",
  //           "from-[rgba(196,154,71,0.85)] to-[var(--primary)]",
  //           "from-slate-400 to-slate-600",
  //         ];
  //         const curated = (
  //           res.data.data as Array<{
  //             id: number;
  //             name: string;
  //             description: string | null;
  //             image: string | null;
  //           }>
  //         )
  //           .slice(0, 8)
  //           .map((p, idx) => ({
  //             id: p.id,
  //             name: p.name,
  //             description: p.description || t("home.content.professions.card"),
  //             accent: accents[idx % accents.length],
  //             image:
  //               p.image ||
  //               `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=70&sig=${idx}`,
  //           }));
  //         setProfessions(curated);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load professions", error);
  //     } finally {
  //       setProfessionsLoading(false);
  //     }
  //   };

  //   fetchProfessions();
  // }, [locale, t]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const res = await apiClient.get(`/lookups/partners`, {
          headers: { 'Accept-Language': locale },
        });
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
  }, [locale]);

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
          `${
            usePublic ? "/api/public/jobs" : "/api/jobs"
          }?${params.toString()}`,
          {
            headers: {
              ...(usePublic
                ? {}
                : {
                    Authorization: `Bearer ${
                      localStorage.getItem("auth_token") || ""
                    }`,
                  }),
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
        const res = await apiClient.get("/talents?per_page=8", {
          headers: { 'Accept-Language': locale },
        });
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
  }, [locale]);

  // const handleProfessionClick = (id: number) => {
  //   router.push(`/talents?profession_ids=${id}`);
  // };

  return (
    <div className="bg-white text-gray-900 ">
      {/* Hero Banner */}
      <HeroBanner
        isAuthenticated={isAuthenticated}
        hydrated={hydrated}
        kicker={t("home.content.hero.kicker")}
        ctaRegister={t("home.content.hero.ctaRegister")}
        ctaLogin={t("home.content.hero.ctaLogin")}
        ctaDashboard={t("home.content.hero.ctaDashboard")}
        ctaBrowse={t("home.content.hero.ctaBrowse")}
        metrics={{
          speed: t("home.content.hero.metrics.speed"),
          profiles: t("home.content.hero.metrics.profiles"),
          success: t("home.content.hero.metrics.success"),
        }}
      />

      {/* Professions Section */}
      {/* TODO: Add Disciplines section here if needed */}
      {/* <ProfessionsSection
        professions={professions}
        loading={professionsLoading}
        kicker={t("home.content.professions.kicker")}
        title={t("home.content.professions.title")}
        subtitle={t("home.content.professions.subtitle")}
        helper={t("home.content.professions.helper")}
        hint={t("home.content.professions.hint")}
        label={t("home.content.professions.label")}
        cta={t("home.content.professions.cta")}
        loadingText={t("home.content.professions.loading")}
        emptyText={t("home.content.professions.empty")}
        onProfessionClick={handleProfessionClick}
      /> */}

      {/* Jobs Section - For all users - Horizontal cards in 2-column grid */}
      <HomeJobsSection
        jobs={jobs}
        loading={jobsLoading}
        kicker={t("home.content.jobs.kicker")}
        title={t("home.content.jobs.title")}
        subtitle={t("home.content.jobs.subtitle")}
        viewAll={t("home.content.jobs.viewAll")}
        loadingText={t("home.content.jobs.loading")}
        emptyText={t("home.content.jobs.empty")}
      />

      {/* Welcome Section */}
      <WelcomeSectionNew
        kicker={t("home.content.welcome.kicker")}
        title={t("home.content.welcome.title")}
        subtitle={t("home.content.welcome.subtitle")}
        pillars={{
          craft: {
            title: t("home.content.welcome.pillars.craft.title"),
            desc: t("home.content.welcome.pillars.craft.desc"),
          },
          data: {
            title: t("home.content.welcome.pillars.data.title"),
            desc: t("home.content.welcome.pillars.data.desc"),
          },
          support: {
            title: t("home.content.welcome.pillars.support.title"),
            desc: t("home.content.welcome.pillars.support.desc"),
          },
          network: {
            title: t("home.content.welcome.pillars.network.title"),
            desc: t("home.content.welcome.pillars.network.desc"),
          },
        }}
        ribbon={t("home.content.welcome.ribbon")}
        ribbonTitle={t("home.content.welcome.ribbonTitle")}
        ribbonTag={t("home.content.welcome.ribbonTag")}
      />

      {/* Talents Section */}
      <TalentsSection
        talents={talents}
        loading={talentsLoading}
        kicker={t("home.content.talents.kicker")}
        title={t("home.content.talents.title")}
        subtitle={t("home.content.talents.subtitle")}
        viewAll={t("home.content.talents.viewAll")}
        loadingText={t("home.content.talents.loading") || "Loading talents..."}
        emptyText={t("home.content.talents.empty") || "No talents available"}
      />

      {/* Twins Section */}
      <TwinsSection
        kicker={t("home.content.twins.kicker")}
        title={t("home.content.twins.title")}
        subtitle={t("home.content.twins.subtitle")}
        cta={t("home.content.twins.cta")}
        backgroundImage="https://plus.unsplash.com/premium_photo-1681492310064-b835a82d5c1c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      {/* Partners Section */}
      <PartnersSection
        partners={partners}
        loading={partnersLoading}
        kicker={t("home.content.partners.kicker")}
        title={t("home.content.partners.title")}
        subtitle={t("home.content.partners.subtitle")}
        cta={t("home.content.partners.cta")}
        noPartnersText={
          t("home.content.partners.noPartners") || "No partners available"
        }
        hideArrows
      />
    </div>
  );
}
