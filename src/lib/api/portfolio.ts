import apiClient, { getActiveProfileId } from './client';
import { PortfolioMedia, PortfolioItem, SyncPortfolioResult } from '@/types/portfolio';

/**
 * Fetch portfolio list for active profile (legacy endpoint retained for initial load)
 */
export const fetchPortfolio = async (): Promise<PortfolioItem[]> => {
  const profileId = getActiveProfileId();
  if (!profileId) throw new Error('No active profile ID found');

  const response = await apiClient.get('/profile/portfolio', {
    params: { profile_id: profileId },
  });

  const data: PortfolioMedia[] = response.data.data || [];
  return data.map((m, idx): PortfolioItem => ({
    id: m.id,
    profile_id: m.profile_id,
    media_type: m.media_type || 'image',
    file_path: m.file_path,
    file_url: m.file_url,
    thumbnail_url: m.thumbnail_url,
    approval_status: m.approval_status,
    featured_image: !!m.featured_image,
    request_featured_image: !!m.request_featured_image,
    created_at: m.created_at,
    updated_at: m.updated_at,
    title: (m.title as string) || '',
    description: (m.description as string) || '',
    priority: typeof m.priority === 'number' ? m.priority : idx,
  }));
};

/**
 * Build FormData for sync-portfolio request
 */
const buildSyncFormData = (profileId: number | string, items: PortfolioItem[]): FormData => {
  const formData = new FormData();
  formData.append('profile_id', String(profileId));

  items.forEach((item, index) => {
    const priority = Math.min(Math.max(index, 0), 100); // clamp 0-100
    formData.append(`portfolio[${index}][priority]`, priority.toString());
    formData.append(`portfolio[${index}][featured_image]`, item.featured_image ? '1' : '0');

    if (item.id) {
      formData.append(`portfolio[${index}][id]`, item.id.toString());
    }

    // Only append file if new item (no id) or replacement file present
    if (!item.id || item.file) {
      if (item.file) {
        formData.append(`portfolio[${index}][file]`, item.file, item.file.name);
      }
    }
  });
  return formData;
};

/**
 * Validate portfolio items before sync
 */
export const validatePortfolioItems = (items: PortfolioItem[]): string[] => {
  const errors: string[] = [];
  let featuredCount = 0;

  items.forEach((item, idx) => {
    if (!item.id && !item.file) {
      errors.push(`New item at position ${idx + 1} is missing file.`);
    }
    if (item.file && item.file.size > 100 * 1024 * 1024) {
      errors.push(`File ${item.file.name} exceeds 100MB limit.`);
    }
    if (item.featured_image) featuredCount += 1;
  });

  if (items.length > 0 && featuredCount === 0) {
    errors.push('Select one item as your profile picture.');
  }
  if (featuredCount > 1) {
    errors.push('Only one item can be set as the profile picture.');
  }

  return errors;
};

/**
 * Sync entire portfolio list in single request
 */
export const syncPortfolio = async (items: PortfolioItem[]): Promise<SyncPortfolioResult> => {
  const profileId = getActiveProfileId();
  if (!profileId) return { success: false, message: 'No active profile ID found' };

  const validationErrors = validatePortfolioItems(items);
  if (validationErrors.length) {
    return { success: false, message: 'Validation failed', errors: { general: validationErrors } };
  }

  const formData = buildSyncFormData(profileId, items);

  try {
    const response = await apiClient.post('/profile/sync-portfolio', formData);
    return { success: true, message: response.data?.message || 'Portfolio synced successfully' };
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
    const backendErrors = e.response?.data?.errors;
    return { success: false, message: e.response?.data?.message || e.message || 'Unknown error', errors: backendErrors };
  }
};
