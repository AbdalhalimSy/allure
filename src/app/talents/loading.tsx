"use client";

import Loader from "@/components/ui/Loader";
import TalentCardSkeleton from "@/components/talent/TalentCardSkeleton";
import { useI18n } from "@/contexts/I18nContext";

export default function LoadingTalents() {
  const { t } = useI18n();
  return (
    <section className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
 <div className="h-6 w-48 animate-pulse rounded bg-gray-200 " />
 <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 " />
        </div>
 <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <Loader className="h-4 w-4" />
          <span>{t('content.loadingTalents')}</span>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <TalentCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
