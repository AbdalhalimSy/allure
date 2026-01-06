import { Media, Profile, Profession } from "@/types/talent";

export type MediaKind = "photo" | "video" | "audio";

export type MediaItem = Media & { type: MediaKind };

export interface LightboxItem {
  type: MediaKind;
  url: string;
  thumbnail?: string | null;
}

export interface LightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export interface BaseSectionProps {
  t: (key: string) => string;
  isRTL?: boolean;
}

export interface HeaderStatsProps extends BaseSectionProps {
  profile: Profile;
  professions: Profession[];
}

export interface FeatureImageProps {
  featurePhoto?: Media;
  alt: string;
  fallbackLabel: string;
}

export interface ContactAndAttributesProps extends BaseSectionProps {
  profile: Profile;
}

export interface InfoListsProps extends BaseSectionProps {
  profile: Profile;
  professions: Profession[];
  languages: string[];
}

export interface ExperienceAccountProps extends BaseSectionProps {
  profile: Profile;
}

export interface MediaSectionProps extends BaseSectionProps {
  photos: Media[];
  videos: Media[];
  audios: Media[];
  mediaTab: MediaKind | "all";
  onTabChange: (tab: MediaKind | "all") => void;
  onOpenLightbox: (item: LightboxItem) => void;
}

export interface LightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
}
