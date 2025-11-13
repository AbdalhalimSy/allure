export interface SubProfession {
  id: number;
  profession_id: number;
  name: string;
  requires_photo: boolean;
  requires_video: boolean;
  requires_audio: boolean;
  requires_languages: boolean;
}

export interface Profession {
  id: number;
  name: string;
  requires_photo: boolean;
  requires_video: boolean;
  requires_audio: boolean;
  requires_languages: boolean;
  sub_professions: SubProfession[];
}

export interface ProfessionRequirements {
  requiresPhoto: boolean;
  requiresVideo: boolean;
  requiresAudio: boolean;
  requiresLanguages: boolean;
}

export interface ProfessionEntry {
  id: string;
  professionId: number | null;
  subProfessionId: number | null;
}
