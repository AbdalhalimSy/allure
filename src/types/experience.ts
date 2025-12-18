export interface ExperienceEntry {
  id?: number;
  title: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  description?: string;
  attachment?: File | string; // File for new upload, string URL for existing
}

export interface ExperienceResponseItem {
  id: number;
  profile_id: number;
  title: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  description?: string;
  attachment?: string | null;
  attachment_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
