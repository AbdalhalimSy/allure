"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";
import apiClient from "@/lib/api/client";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import AccentTag from "@/components/ui/AccentTag";
import { Talent, TalentsResponse } from "@/types/talent";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Ruler,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Briefcase,
  Palette,
  AlertCircle,
  Globe,
  Sparkles,
  PlayCircle,
  Users,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TalentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetchTalent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from talents list - the API doesn't have a single talent endpoint
      // We'll get the full list and filter client-side, or we can optimize later
      const response = await apiClient.get(`/talents`, {
        params: { per_page: 100 },
      });

      const result: TalentsResponse = response.data;

      if (result.status === "success") {
        const foundTalent = result.data.find(
          (t) => t.profile.id === Number(params.id)
        );
        if (foundTalent) {
          setTalent(foundTalent);
        } else {
          throw new Error("Talent not found");
        }
      } else {
        throw new Error(result.message || "Failed to load talent");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching talent:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTalent();
  }, [fetchTalent]);

  // Refetch when language changes
  useLanguageSwitch(fetchTalent);

  // Set selected photo when talent loads
  useEffect(() => {
    if (talent) {
      const featuredPhoto =
        talent.media.photos.find((p) => p.featured_image) ||
        talent.media.photos[0];
      if (featuredPhoto && !selectedPhoto) {
        setSelectedPhoto(featuredPhoto);
      }
    }
  }, [talent, selectedPhoto]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12 text-center ">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-900 ">
            {t("talents.failedToLoad")}
          </h3>
          <p className="mb-4 text-sm text-red-700 ">{error}</p>
          <button
            onClick={() => router.push("/talents")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {t("talents.backToTalents")}
          </button>
        </div>
      </div>
    );
  }

  const { profile, professions, sub_professions, media } = talent;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white ">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/talents")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#c49a47] "
        >
          <ArrowLeft className="h-4 w-4" />
          {t("talents.backToTalents")}
        </button>

        {/* Header Section (mirrors Job header card) */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg ">
          <div className="h-2 bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47]" />
          <div className="p-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900 ">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600 ">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-4 w-4" />
                    {profile.age} {t("talents.years")}
                  </span>
                  <span className="hidden text-gray-400 sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4" />
                    {profile.country.name}
                  </span>
                </div>
              </div>
              {professions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {professions.slice(0, 3).map((profession) => (
                    <span
                      key={profession.id}
                      className="rounded-full border border-[#c49a47]/50 bg-[#c49a47]/10 px-3 py-1 text-xs font-semibold text-[#c49a47]"
                    >
                      {profession.name}
                    </span>
                  ))}
                  {professions.length > 3 && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 ">
                      +{professions.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 ">
                <User className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 ">
                    {t("content.gender")}
                  </p>
                  <p className="font-semibold text-gray-900 ">
                    {t(`filters.${profile.gender}`)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 ">
                <Ruler className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 ">
                    {t("talents.height")}
                  </p>
                  <p className="font-semibold text-gray-900 ">
                    {profile.height} cm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 ">
                <Globe className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 ">
                    {t("talents.nationalities")}
                  </p>
                  <p className="font-semibold text-gray-900 ">
                    {profile.nationalities.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 ">
                <Users className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 ">
                    {t("talents.professions")}
                  </p>
                  <p className="font-semibold text-gray-900 ">
                    {professions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content (left, 2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Photo Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#c49a47]" />
                <h2 className="text-xl font-bold text-gray-900 ">
                  {t("talents.portfolio")}
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Main Photo */}
                {selectedPhoto && (
                  <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                    <Image
                      src={selectedPhoto.url}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                    {selectedPhoto.featured_image && (
                      <div className="absolute start-3 top-3">
                        <AccentTag
                          variant="primary"
                          icon={<Sparkles className="h-3 w-3" />}
                        >
                          {t("talents.featured")}
                        </AccentTag>
                      </div>
                    )}
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute bottom-3 end-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/90"
                    >
                      <Maximize2 className="h-4 w-4" /> {t("talents.viewFull")}
                    </button>
                  </div>
                )}

                {/* Thumbnails */}
                {media.photos.length > 1 && (
                  <div className="grid grid-cols-3 gap-3 self-start">
                    {media.photos.slice(0, 9).map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                          selectedPhoto?.id === photo.id
                            ? "ring-2 ring-[#c49a47] ring-offset-2 ring-offset-white "
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={photo.url}
                          alt="Gallery"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 33vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
              <div className="mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#c49a47]" />
                <h2 className="text-xl font-bold text-gray-900 ">
                  {t("home.content.physicalAttributes")}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.hairColor")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.hair_color}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.hairType")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.hair_type}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.eyeColor")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.eye_color}
                  </div>
                </div>
                {profile.chest && (
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-500 ">
                      {t("home.content.chest")}
                    </div>
                    <div className="font-semibold text-gray-900 ">
                      {profile.chest} cm
                    </div>
                  </div>
                )}
                {profile.waist && (
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-500 ">
                      {t("home.content.waist")}
                    </div>
                    <div className="font-semibold text-gray-900 ">
                      {profile.waist} cm
                    </div>
                  </div>
                )}
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.shoeSize")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.shoe_size}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.tshirtSize")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.tshirt_size}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-500 ">
                    {t("home.content.pantsSize")}
                  </div>
                  <div className="font-semibold text-gray-900 ">
                    {profile.pants_size}
                  </div>
                </div>
              </div>
            </div>

            {/* Background */}
            {(profile.nationalities.length > 0 ||
              profile.ethnicities.length > 0) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
                <h2 className="mb-4 text-xl font-bold text-gray-900 ">
                  {t("talents.background")}
                </h2>
                <div className="space-y-6">
                  {profile.nationalities.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-medium text-gray-500 ">
                        {t("talents.nationalities")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.nationalities.map((nat) => (
                          <AccentTag key={nat.id}>{nat.name}</AccentTag>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.ethnicities.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-medium text-gray-500 ">
                        {t("talents.ethnicities")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.ethnicities.map((eth) => (
                          <AccentTag key={eth.id}>{eth.name}</AccentTag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Videos */}
            {media.videos.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
                <div className="mb-4 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-[#c49a47]" />
                  <h2 className="text-xl font-bold text-gray-900 ">
                    {t("talents.videos")}
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {media.videos.map((video) => (
                    <div
                      key={video.id}
                      className="relative aspect-video overflow-hidden rounded-xl bg-gray-900"
                    >
                      <video
                        src={video.url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (right) */}
          <div className="space-y-6">
            {/* Location */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <h3 className="text-lg font-bold text-gray-900 ">
                  {t("talents.location")}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 ">
                <div className="h-1.5 w-1.5 rounded-full bg-[#c49a47]" />
                {profile.country.name}
              </div>
            </div>

            {/* Professions */}
            {professions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
                <div className="mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#c49a47]" />
                  <h3 className="text-lg font-bold text-gray-900 ">
                    {t("talents.professions")}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {professions.map((profession) => (
                    <span
                      key={profession.id}
                      className="rounded-lg border border-[#c49a47] bg-[#c49a47]/5 px-3 py-1 text-sm font-medium text-[#c49a47]"
                    >
                      {profession.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations */}
            {sub_professions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
                <h3 className="mb-4 text-lg font-bold text-gray-900 ">
                  {t("talents.specializations")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sub_professions.map((subProf) => (
                    <span
                      key={subProf.id}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 "
                    >
                      {subProf.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Summary */}
            {(profile.instagram_followers ||
              profile.youtube_followers ||
              profile.tiktok_followers ||
              profile.facebook_followers) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ">
                <h3 className="mb-4 text-lg font-bold text-gray-900 ">
                  {t("talents.socialMedia")}
                </h3>
                <div className="space-y-4">
                  {profile.instagram_followers &&
                    profile.instagram_followers > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-purple-600">
                            <Instagram className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 ">
                            Instagram
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ">
                          {profile.instagram_followers.toLocaleString()}
                        </span>
                      </div>
                    )}
                  {profile.youtube_followers &&
                    profile.youtube_followers > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                            <Youtube className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 ">
                            YouTube
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ">
                          {profile.youtube_followers.toLocaleString()}
                        </span>
                      </div>
                    )}
                  {profile.tiktok_followers && profile.tiktok_followers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 ">
                          <Music2 className="h-5 w-5 text-white " />
                        </div>
                        <span className="text-sm text-gray-700 ">TikTok</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 ">
                        {profile.tiktok_followers.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {profile.facebook_followers &&
                    profile.facebook_followers > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                            <Facebook className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 ">
                            Facebook
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ">
                          {profile.facebook_followers.toLocaleString()}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute -end-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[90vh] max-w-7xl">
            <Image
              src={selectedPhoto.url}
              alt={`${profile.first_name} ${profile.last_name}`}
              width={1200}
              height={1600}
              className="h-auto max-h-[90vh] w-auto rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation */}
            {media.photos.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = media.photos.findIndex(
                      (p) => p.id === selectedPhoto.id
                    );
                    const prevIndex =
                      currentIndex > 0
                        ? currentIndex - 1
                        : media.photos.length - 1;
                    setSelectedPhoto(media.photos[prevIndex]);
                  }}
                  className="rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6 rtl:scale-x-[-1]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = media.photos.findIndex(
                      (p) => p.id === selectedPhoto.id
                    );
                    const nextIndex =
                      currentIndex < media.photos.length - 1
                        ? currentIndex + 1
                        : 0;
                    setSelectedPhoto(media.photos[nextIndex]);
                  }}
                  className="rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6 rtl:scale-x-[-1]" />
                </button>
              </div>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {media.photos.findIndex((p) => p.id === selectedPhoto.id) + 1} /{" "}
              {media.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
