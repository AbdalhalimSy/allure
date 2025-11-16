export interface ExperienceEntry {
  id?: number;
  title: string;
  company?: string;
  start_year?: number | null;
  end_year?: number | null;
  is_current?: boolean;
  description?: string;
  attachment?: File | string; // File for new upload, string URL for existing
}

export interface ExperienceResponseItem {
  id: number;
  title: string;
  company?: string;
  start_year?: number | null;
  end_year?: number | null;
  is_current?: boolean;
  description?: string;
  attachment?: string | null; // URL or relative path
}
