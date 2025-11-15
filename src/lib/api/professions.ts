import apiClient, { getActiveProfileId } from './client';
import { ProfessionEntry } from '@/types/profession';

const STORAGE_BASE_URL = 'https://allureportal.sawatech.ae/storage';

/**
 * Build FormData payload for syncing professions
 */
export function buildSyncProfessionsPayload(
  professions: ProfessionEntry[],
  profileId: number | string
): FormData {
  const formData = new FormData();
  
  // Add profile ID
  formData.append('profile_id', profileId.toString());
  
  // Add each profession entry
  professions.forEach((entry, index) => {
    const prefix = `professions[${index}]`;
    
    // Include ID if editing existing record
    if (entry.id) {
      formData.append(`${prefix}[id]`, entry.id.toString());
    }
    
    formData.append(`${prefix}[profession_id]`, entry.professionId.toString());
    
    if (entry.subProfessionId !== null) {
      formData.append(`${prefix}[sub_profession_id]`, entry.subProfessionId.toString());
    }
    
    // Media files (only if File, not if string URL)
    if (entry.photo instanceof File) {
      formData.append(`${prefix}[photo]`, entry.photo);
    }
    
    if (entry.video instanceof File) {
      formData.append(`${prefix}[video]`, entry.video);
    }
    
    if (entry.audio instanceof File) {
      formData.append(`${prefix}[audio]`, entry.audio);
    }
    
    // Languages
    entry.languages.forEach((lang, langIndex) => {
      formData.append(`${prefix}[languages][${langIndex}][code]`, lang.code);
      if (lang.voice instanceof File) {
        formData.append(`${prefix}[languages][${langIndex}][voice]`, lang.voice);
      }
    });
    
    // Socials
    entry.socials.forEach((social, socialIndex) => {
      formData.append(`${prefix}[socials][${socialIndex}][platform]`, social.platform);
      formData.append(`${prefix}[socials][${socialIndex}][url]`, social.url);
      if (social.followers !== undefined) {
        formData.append(`${prefix}[socials][${socialIndex}][followers]`, social.followers.toString());
      }
    });
  });
  
  return formData;
}

/**
 * Sync all professions with backend
 */
export async function syncProfessions(professions: ProfessionEntry[]): Promise<void> {
  const profileId = getActiveProfileId();
  
  if (!profileId) {
    throw new Error('No active profile ID found');
  }
  
  const formData = buildSyncProfessionsPayload(professions, profileId);
  
  await apiClient.post('/profile/sync-professions', formData);
}

/**
 * Fetch saved professions from backend
 */
export async function fetchSavedProfessions(): Promise<ProfessionEntry[]> {
  const profileId = getActiveProfileId();

  if (!profileId) {
    throw new Error('No active profile ID found');
  }

  const response = await apiClient.get('/profile/professions', {
    params: {
      profile_id: profileId,
    },
  });
  
  const data = response.data?.data || [];
  
  return mapApiResponseToEntries(data);
}

/**
 * Map API response to ProfessionEntry[]
 */
export function mapApiResponseToEntries(apiData: any[]): ProfessionEntry[] {
  const entries: ProfessionEntry[] = [];
  
  apiData.forEach((item: any) => {
    const professionId = item.profession?.id || item.profession_id || 0;

    if (Array.isArray(item.sub_professions) && item.sub_professions.length > 0) {
      item.sub_professions.forEach((subItem: any) => {
        const media = subItem.media || {};
        entries.push({
          id: media.id || subItem.id,
          professionId,
          subProfessionId: subItem.sub_profession?.id || subItem.sub_profession_id || null,
          photo: media.photo ? getMediaUrl(media.photo) : undefined,
          video: media.video ? getMediaUrl(media.video) : undefined,
          audio: media.audio ? getMediaUrl(media.audio) : undefined,
          languages: mapLanguages(media.languages),
          socials: mapSocials(media.socials),
        });
      });
      return;
    }

    const media = item.media || {};

    entries.push({
      id: media.id || item.id,
      professionId,
      subProfessionId: media.sub_profession_id || item.sub_profession_id || null,
      photo: media.photo ? getMediaUrl(media.photo) : undefined,
      video: media.video ? getMediaUrl(media.video) : undefined,
      audio: media.audio ? getMediaUrl(media.audio) : undefined,
      languages: mapLanguages(media.languages || item.languages),
      socials: mapSocials(media.socials || item.socials),
    });
  });
  
  return entries;
}

/**
 * Convert relative path to full URL
 */
function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STORAGE_BASE_URL}/${path}`;
}

/**
 * Map languages from API response
 */
function mapLanguages(languages: any): ProfessionEntry['languages'] {
  if (!languages || !Array.isArray(languages)) return [];

  return languages
    .map((lang) => {
      const code =
        lang.code ||
        lang.language_code ||
        lang.language?.code ||
        "";

      return {
        code,
        voice: lang.voice ? getMediaUrl(lang.voice) : undefined,
      };
    })
    .filter((lang) => !!lang.code);
}

/**
 * Map socials from API response
 */
function mapSocials(socials: any): ProfessionEntry['socials'] {
  if (!socials || !Array.isArray(socials)) return [];

  return socials
    .map((social) => ({
      platform: social.platform || "",
      url: social.url || "",
      followers:
        typeof social.followers === "number"
          ? social.followers
          : social.followers
          ? Number(social.followers)
          : undefined,
    }))
    .filter((social) => social.platform && social.url);
}
