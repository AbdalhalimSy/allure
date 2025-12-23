// Base Role type for job listings
export interface Role {
  id: number;
  name: string;
  gender: string;
  start_age: number;
  end_age: number;
  can_apply?: boolean | null;
  eligibility_score?: number | null;
}

// Base Job type for job listings
export interface Job {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  highlights?: string | null; // Optional highlights field
  usage_terms?: string | null;
  skills?: string; // Optional field
  shooting_date: string;
  expiration_date: string;
  is_active: boolean;
  open_to_apply: boolean;
  roles_count: number;
  countries?: string[]; // For list endpoint
  job_countries?: string[]; // For detail endpoint
  professions?: string[]; // Optional
  roles: Role[];
}

// Extended types for job details
export interface Condition {
  id: number;
  label: string;
  input_type: "yes_no" | "textarea" | "checkbox" | "radio" | "text" | "media_upload";
  options: Array<{ value: string; label: string }>;
  is_required: boolean;
}

export interface MetaCondition {
  hair_color?: string;
  hair_length?: string;
  hair_type?: string;
  eye_color?: string;
  height?: number;
  weight?: number;
  shoe_size?: string;
  pants_size?: string;
  tshirt_size?: string;
  tattoos?: number;
  piercings?: number;
}

// Call Time types
export interface AvailableTime {
  time: string; // HH:MM:SS format
  available_spots: number;
  is_fully_booked: boolean;
}

export interface CallTimeSlot {
  id: number;
  start_time: string; // HH:MM:SS format
  end_time: string; // HH:MM:SS format
  interval_minutes: number;
  max_talents: number;
  available_times: AvailableTime[];
}

export interface CallTimeSlotGroup {
  date: string; // "YYYY-MM-DD" (date-only)
  slots: CallTimeSlot[];
}

export interface DetailedRole extends Role {
  description: string;
  ethnicity: string[];
  payment_terms_days: number;
  budget?: number | null;
  meta_conditions: MetaCondition[];
  conditions: Condition[];
  call_time_enabled: boolean;
  call_time_slots?: CallTimeSlotGroup[];
}

export interface DetailedJob extends Omit<Job, 'roles' | 'roles_count' | 'countries'> {
  image?: string | null;
  job_countries: string[]; // Detail endpoint uses 'job_countries' instead of 'countries'
  residence_countries?: string[];
  sub_professions: string[];
  roles: DetailedRole[];
}

// API Response types
export interface JobsResponse {
  status: string | boolean; // Can be 'success' string or boolean
  message: string;
  data: Job[];
  meta: { // API returns 'meta' field
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Filter parameters for jobs API
export interface JobFilters {
  per_page?: number;
  title?: string;
  shooting_date_from?: string; // YYYY-MM-DD format
  shooting_date_to?: string; // YYYY-MM-DD format
  expiration_date_from?: string; // YYYY-MM-DD format
  expiration_date_to?: string; // YYYY-MM-DD format
  country_ids?: number | number[]; // Job location countries
  talent_country_ids?: number | number[]; // Talent residence countries
  profession_ids?: number | number[]; // Required professions
  sub_profession_ids?: number | number[]; // Required sub professions
  nationality_ids?: number | number[]; // Talent nationalities (same lookup as talents page)
  ethnicity_ids?: number | number[]; // Talent ethnicities
  hair_color_ids?: number | number[]; // Hair colors
  eye_color_ids?: number | number[]; // Eye colors
  eligible?: boolean; // Filter by eligibility
  page?: number; // Pagination page index (1-based)
}

export interface JobDetailResponse {
  status: string | boolean; // Can be 'success' string or boolean
  message: string;
  data: DetailedJob;
}

// Applied jobs
export interface AppliedJobRole extends Omit<DetailedRole, 'call_time_slots'> {
  call_time_enabled: boolean;
}

export interface AppliedJob {
  id: number;
  status: string;
  approved_payment_terms: boolean;
  job_role_id: number;
  profile_id: number;
  role: AppliedJobRole;
  created_at: string;
}

export interface AppliedJobsResponse {
  status: string | boolean;
  message: string;
  data: AppliedJob[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Eligible Roles API types
export interface EligibleRole extends Omit<DetailedRole, 'budget'> {
  // All properties from DetailedRole, but budget is a string in this API
  budget: string | null; // e.g., "4876.00"
  eligibility_score: number;
  can_apply: boolean;
}

export interface EligibleJob extends Omit<DetailedJob, 'roles'> {
  roles: EligibleRole[];
}

export interface EligibleRolesResponse {
  success: boolean;
  message: string;
  data: EligibleJob[];
}
