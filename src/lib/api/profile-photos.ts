/**
 * Profile Photos API Service
 */

import {
  ProfilePhotosResponse,
  UploadPhotoResponse,
  UpdatePhotoResponse,
  DeletePhotoResponse,
} from "@/types/profile-photo";

/**
 * Fetch all profile photos for a specific profile
 * 
 * BREAKING CHANGE: Now requires profile_id parameter
 */
export async function getProfilePhotos(
  profileId: number,
  token: string
): Promise<ProfilePhotosResponse> {
  const response = await fetch(`/api/profile-photos?profile_id=${profileId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile photos");
  }

  return data;
}

/**
 * Upload a new profile photo
 * 
 * BREAKING CHANGE: Now requires profile_id in the request body
 */
export async function uploadProfilePhoto(
  file: File,
  profileId: number,
  token: string
): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("profile_id", profileId.toString());

  const response = await fetch("/api/profile-photos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload profile photo");
  }

  return data;
}

/**
 * Mark a photo as profile picture
 * 
 * NOTE: This endpoint is DEPRECATED. Use uploadProfilePhoto to upload a new photo instead.
 * Once approved by admin, the new photo becomes the profile picture automatically.
 */
export async function markAsProfilePicture(
  _photoId: number,
  _token: string
): Promise<UpdatePhotoResponse> {
  // This endpoint is deprecated - return error
  throw new Error(
    "This endpoint is deprecated. To update your profile photo, please upload a new one using uploadProfilePhoto(). Your current photo will remain active until the new one is approved."
  );
}

/**
 * Delete a profile photo
 */
export async function deleteProfilePhoto(
  photoId: number,
  token: string
): Promise<DeletePhotoResponse> {
  const response = await fetch(`/api/profile-photos/${photoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete profile photo");
  }

  return data;
}
