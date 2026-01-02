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
 * Fetch all profile photos for the authenticated user
 */
export async function getProfilePhotos(
  token: string
): Promise<ProfilePhotosResponse> {
  const response = await fetch("/api/profile-photos", {
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
 */
export async function uploadProfilePhoto(
  file: File,
  token: string
): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append("profile_picture", file);

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
 */
export async function markAsProfilePicture(
  photoId: number,
  token: string
): Promise<UpdatePhotoResponse> {
  const response = await fetch(`/api/profile-photos/${photoId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ is_profile_picture: true }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile photo");
  }

  return data;
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
