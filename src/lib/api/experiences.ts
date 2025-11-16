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
    if (exp.company) formData.append(`${prefix}[company]`, exp.company);
    if (typeof exp.is_current === 'boolean') formData.append(`${prefix}[is_current]`, exp.is_current ? '1' : '0');

    // Year rules: if is_current => end_year must be null; if not current, end_year required
    const isCurrent = !!exp.is_current;
    if (exp.start_year != null) formData.append(`${prefix}[start_year]`, String(exp.start_year));
    if (!isCurrent && exp.end_year != null) formData.append(`${prefix}[end_year]`, String(exp.end_year));
    if (isCurrent) formData.append(`${prefix}[end_year]`, '');

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
    company: item.company,
    start_year: item.start_year ?? null,
    end_year: item.end_year ?? null,
    is_current: !!item.is_current,
    description: item.description,
    attachment: item.attachment ? getMediaUrl(item.attachment) : undefined,
  }));
}
