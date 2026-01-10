// Existing media item as returned by backend list endpoint
export interface PortfolioMedia {
  id: number;
  profile_id: number;
  media_type: string; // e.g. photo, video
  file_path: string;
  file_url: string;
  thumbnail_url: string | null;
  approval_status: string; // pending|approved|rejected
  featured_image: boolean;
  request_featured_image?: boolean;
  created_at: string;
  updated_at: string;
  // New optional textual metadata (may be provided by future backend updates)
  title?: string | null;
  description?: string | null;
  priority?: number; // may not be present in legacy response
}

// Editable portfolio item model used in UI sync flow
export interface PortfolioItem {
  id?: number; // undefined for newly added items
  profile_id?: number;
  tempKey?: string; // local-only key for new unsaved items
  media_type: string; // derived from file.type or existing media_type
  file_path?: string;
  file_url?: string;
  thumbnail_url?: string | null;
  approval_status?: string;
  featured_image: boolean;
  request_featured_image?: boolean;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string;
  priority: number; // 0-100
  file?: File; // present for new items or replacements
}

export interface SyncPortfolioResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>; // field level errors from backend
}

