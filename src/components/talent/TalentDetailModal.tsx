"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { Talent } from "@/types/talent";
import { ContactAndAttributes } from "./TalentDetailModal/ContactAndAttributes";
import { ExperienceAccount } from "./TalentDetailModal/ExperienceAccount";
import { FeatureImage } from "./TalentDetailModal/FeatureImage";
import { HeaderStats } from "./TalentDetailModal/HeaderStats";
import { InfoLists } from "./TalentDetailModal/InfoLists";
import { Lightbox } from "./TalentDetailModal/Lightbox";
import { MediaSection } from "./TalentDetailModal/MediaSection";
import { LightboxItem } from "./TalentDetailModal/types";
import { normalizeLanguages } from "./TalentDetailModal/utils";

interface TalentDetailModalProps {
  talent: Talent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TalentDetailModal({ talent, isOpen, onClose }: TalentDetailModalProps) {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";
  const [mediaTab, setMediaTab] = useState<"all" | "photo" | "video" | "audio">("all");
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !talent) return null;

  const { profile, professions, media } = talent;
  const photos = media.photos || [];
  const videos = media.videos || [];
  const audios = media.audios || [];

  const featurePhoto = photos.find((p) => p.featured_image) || photos[0];
  const languagesList = normalizeLanguages(profile.languages_spoken);
  const hasMedia = photos.length + videos.length + audios.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl max-h-[95vh] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 end-0 z-20 p-4">
            <button
              onClick={onClose}
              className="rounded-full bg-white/90 p-3 backdrop-blur-sm transition-all hover:bg-white shadow-lg hover:shadow-xl"
            >
              <X className="h-5 w-5 text-gray-900" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className={`relative flex gap-6 p-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <FeatureImage
                featurePhoto={featurePhoto}
                alt={`${profile.first_name} ${profile.last_name}`}
                fallbackLabel={t("talents.noPhotos") || "No photos"}
              />

              <div className="flex-1 space-y-6">
                <HeaderStats profile={profile} professions={professions} isRTL={isRTL} t={t} />
                <ContactAndAttributes profile={profile} t={t} />
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-6" />

            <div className="px-8 pb-8 space-y-8">
              <InfoLists profile={profile} professions={professions} languages={languagesList} t={t} />
              <ExperienceAccount profile={profile} t={t} />

              {hasMedia && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t("talents.media")}</h3>
                  <MediaSection
                    photos={photos}
                    videos={videos}
                    audios={audios}
                    mediaTab={mediaTab}
                    onTabChange={setMediaTab}
                    onOpenLightbox={setLightboxItem}
                    t={t}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
