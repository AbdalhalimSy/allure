import { Briefcase } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export function JobsHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-10 top-10 h-96 w-96 rounded-full bg-[rgba(196,154,71,0.15)] blur-3xl" />
        <div className="absolute -end-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            <Briefcase className="h-4 w-4" />
            {t("jobs.hero.badge")}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t("jobs.hero.title")}
          </h1>

          <p className="text-lg text-gray-600 sm:text-xl">
            {t("jobs.hero.subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
