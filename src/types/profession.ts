export interface SubProfession {
  id: number;
  profession_id: number;
  name: string;
  requires_photo: boolean;
  requires_video: boolean;
  requires_audio: boolean;
  requires_languages: boolean;
  requires_sizes: boolean;
}

export interface Profession {
  id: number;
  name: string;
  requires_photo: boolean;
  requires_video: boolean;
  requires_audio: boolean;
  requires_languages: boolean;
  requires_socials: boolean;
  sub_professions: SubProfession[];
}

export interface ProfessionRequirements {
  requiresPhoto: boolean;
  requiresVideo: boolean;
  requiresAudio: boolean;
  requiresLanguages: boolean;
}

// Language with optional voice file
export interface ProfessionLanguage {
  code: string;
  voice?: File | string; // File for new upload, string URL for existing
}

// Social media link
export interface ProfessionSocial {
  platform: string;
  url: string;
  followers?: number;
}

// Complete profession entry for form state
export interface ProfessionEntry {
  id?: number; // Backend ID when editing existing record
  professionId: number;
  subProfessionId: number | null;
  // Single file per media type (File for new upload, string URL for existing)
  photo?: File | string;
  video?: File | string;
  audio?: File | string;
  // Arrays for languages and socials
  languages: ProfessionLanguage[];
  socials: ProfessionSocial[];
}

// API response structure for saved professions
