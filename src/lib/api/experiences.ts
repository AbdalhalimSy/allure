import apiClient, { getActiveProfileId } from './client';
import type { ExperienceEntry, ExperienceResponseItem } from '@/types/experience';

const STORAGE_BASE_URL = 'https://allureportal.sawatech.ae/storage';

export function buildSyncExperiencesPayload(
  experiences: ExperienceEntry[],
  profileId: number | string
): FormData {
  const formData = new FormData();
  formData.append('profile_id', String(profileId));
  experiences.forEach((exp, index) => {
    const prefix = `experiences[${index}]`;
    if (exp.id) formData.append(`${prefix}[id]`, String(exp.id));
    formData.append(`${prefix}[title]`, exp.title);
    if (typeof exp.is_current === 'boolean') formData.append(`${prefix}[is_current]`, exp.is_current ? '1' : '0');

    // Only send dates if they have values
    if (exp.start_date) {
      console.log(`[Experience ${index}] Sending start_date:`, exp.start_date);
      formData.append(`${prefix}[start_date]`, exp.start_date);
    }
    if (exp.end_date) {
      console.log(`[Experience ${index}] Sending end_date:`, exp.end_date);
      formData.append(`${prefix}[end_date]`, exp.end_date);
    }

    if (exp.description) formData.append(`${prefix}[description]`, exp.description);

    if (exp.attachment instanceof File) {
      formData.append(`${prefix}[attachment]`, exp.attachment);
    }
  });
  return formData;
}

export async function syncExperiences(experiences: ExperienceEntry[]): Promise<void> {
  const profileId = getActiveProfileId();
  if (!profileId) throw new Error('No active profile ID found');
  const formData = buildSyncExperiencesPayload(experiences, profileId);
  await apiClient.post('/profile/sync-experiences', formData);
}

export async function fetchSavedExperiences(): Promise<ExperienceEntry[]> {
  const profileId = getActiveProfileId();
  if (!profileId) throw new Error('No active profile ID found');
  const response = await apiClient.get('/profile/experiences', {
    params: { profile_id: profileId },
  });
  const data = response.data?.data || [];
  return mapApiResponseToEntries(data);
}

function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STORAGE_BASE_URL}/${path}`;
}

export function mapApiResponseToEntries(apiData: ExperienceResponseItem[]): ExperienceEntry[] {
  return (apiData || []).map((item) => ({
    id: item.id,
    title: item.title,
    start_date: item.start_date ?? null,
    end_date: item.end_date ?? null,
    is_current: !!item.is_current,
    description: item.description,
    attachment: item.attachment_url || (item.attachment ? getMediaUrl(item.attachment) : undefined),
  }));
}
