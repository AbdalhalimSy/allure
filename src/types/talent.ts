export interface Country {
  id: number;
  name: string;
  iso_alpha_2: string;
  iso_alpha_3: string;
}

export interface Nationality {
  id: number;
  code: string;
  name: string;
}

export interface Ethnicity {
  id: number;
  code: string;
  name: string;
}

export interface ColorOption {
  id: number;
  slug: string;
  name: string;
  is_active: boolean;
}

export interface Experience {
  id: number;
  profile_id?: number;
  title: string;
  description?: string;
  year?: number;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean;
  attachment_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: number;
  talent_id: number;
  first_name: string;
  last_name: string;
  second_twin_name?: string | null;
  gender: "male" | "female" | "other";
  dob: string;
  age: number;
  mobile: string;
  whatsapp?: string;
  languages_spoken?: string | null;
  progress_step: string;
  
  // Physical attributes
  hair_color_id: number;
  hair_color: string;
  hair_color_option: ColorOption;
  hair_type_id: number;
  hair_type: string;
  hair_type_option: ColorOption;
  hair_length_id: number;
  hair_length: string;
  hair_length_option: ColorOption;
  eye_color_id: number;
  eye_color: string;
  eye_color_option: ColorOption;
  height: number;
  shoe_size: string;
  tshirt_size: string;
  pants_size: string;
  jacket_size: string;
  chest?: number;
  bust?: number;
  waist?: number;
  
  // Status
  approval_status: "pending" | "approved" | "rejected";
  
  // Social media
  instagram_url?: string | null;
  instagram_followers?: number;
  tiktok_url?: string | null;
  tiktok_followers?: number;
  youtube_url?: string | null;
  youtube_followers?: number;
  facebook_url?: string | null;
  facebook_followers?: number;
  
  // Location
  lc_country_id: number;
  country: Country;
  nationalities: Nationality[];
  ethnicities: Ethnicity[];
  experiences: Experience[];
  
  created_at: string;
  updated_at: string;
}

export interface Profession {
  id: number;
  name: string;
}

export interface SubProfession {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  source: "profession" | "portfolio";
  media_type: "photo" | "video" | "audio";
  profession_id?: number;
  sub_profession_id?: number;
  url: string;
  thumbnail_url?: string | null;
  featured_image: boolean;
  priority: number | null;
}

export interface TalentMedia {
  photos: Media[];
  videos: Media[];
  audios: Media[];
  audios_languages: string[];
}

export interface Talent {
  profile: Profile;
  professions: Profession[];
  sub_professions: SubProfession[];
  media: TalentMedia;
}

export interface TalentsResponse {
  status: string | boolean; // Can be 'success' string or boolean
  message: string;
  data: Talent[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface TalentDetailResponse {
  status: string | boolean;
  message: string;
  data: Talent;
}

export interface TalentFilters {
  // Basic filters
  gender?: "male" | "female" | "other";
  search?: string;
  
  // Age filters
  min_age?: number;
  max_age?: number;
  
  // Height filters (in cm)
  min_height?: number;
  max_height?: number;
  
  // Multi-select filters (comma-separated IDs)
  profession_ids?: string;
  sub_profession_ids?: string;
  country_ids?: string;
  nationality_ids?: string;
  ethnicity_ids?: string;
  
  // Appearance filters
  hair_color_ids?: string;
  hair_type_ids?: string;
  hair_length_ids?: string;
  eye_color_ids?: string;
  
  // Sorting
  sort_by?: "first_name" | "age" | "height" | "created_at" | "instagram_followers";
  sort_order?: "asc" | "desc";
  
  // Pagination
  per_page?: number;
  page?: number;
}
