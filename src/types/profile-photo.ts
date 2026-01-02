/**
 * Profile Photo Types
 */

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ProfilePhoto {
  id: number;
  profile_picture: string; // Full URL to the photo
  approval_status: ApprovalStatus;
  is_profile_picture: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfilePhotosResponse {
  success: boolean;
  data: ProfilePhoto[];
  message?: string;
}

export interface UploadPhotoResponse {
  success: boolean;
  message: string;
  data: ProfilePhoto;
  errors?: Record<string, string[]>;
}

export interface UpdatePhotoResponse {
  success: boolean;
  message: string;
  data: ProfilePhoto;
}

export interface DeletePhotoResponse {
  success: boolean;
  message: string;
}
