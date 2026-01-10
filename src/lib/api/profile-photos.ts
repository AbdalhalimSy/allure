/**
 * Profile Photos API Service
 * Uses centralized apiClient for consistent auth and error handling
 */

import apiClient from './client';
import type {
  ProfilePhotosResponse,
  UploadPhotoResponse,
  UpdatePhotoResponse,
  DeletePhotoResponse,
} from "@/types/profile-photo";

/**
 * Fetch all profile photos for a specific profile
 */
export async function getProfilePhotos(
  profileId: number
): Promise<ProfilePhotosResponse> {
  const { data } = await apiClient.get<ProfilePhotosResponse>('/profile-photos', {
    params: { profile_id: profileId },
  });
  return data;
}

/**
 * Upload a new profile photo
 */
export async function uploadProfilePhoto(
  file: File,
  profileId: number
): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("profile_id", profileId.toString());

  const { data } = await apiClient.post<UploadPhotoResponse>(
    '/profile-photos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}

/**
 * Delete a profile photo
 */
export async function deleteProfilePhoto(
  photoId: number,
  profileId: number
): Promise<DeletePhotoResponse> {
  const { data } = await apiClient.delete<DeletePhotoResponse>(
    `/profile-photos/${photoId}`,
    {
      params: { profile_id: profileId },
    }
  );
  return data;
}

/**
 * Update a profile photo (mark as profile picture)
 */
export async function updateProfilePhoto(
  photoId: number,
  profileId: number,
  payload: any
): Promise<UpdatePhotoResponse> {
  const { data } = await apiClient.put<UpdatePhotoResponse>(
    `/profile-photos/${photoId}`,
    payload,
    {
      params: { profile_id: profileId },
    }
  );
  return data;
}
