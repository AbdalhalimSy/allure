// Base Role type for job listings
export interface Role {
  id: number;
  name: string;
  gender: string;
  start_age: number;
  end_age: number;
}

// Base Job type for job listings
export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string;
  shooting_date: string;
  expiration_date: string;
  is_active: boolean;
  roles_count: number;
  countries: string[];
  professions: string[];
  roles: Role[];
}

// Extended types for job details
export interface Condition {
  id: number;
  label: string;
  input_type: "yes_no" | "textarea" | "checkbox" | "radio" | "text";
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

export interface DetailedRole extends Role {
  description: string;
  ethnicity: string;
  payment_terms_days: number;
  meta_conditions: MetaCondition[];
  conditions: Condition[];
}

export interface DetailedJob extends Omit<Job, 'roles' | 'roles_count'> {
  sub_professions: string[];
  roles: DetailedRole[];
}

// API Response types
export interface JobsResponse {
  status: string;
  message: string;
  data: Job[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface JobDetailResponse {
  status: string;
  message: string;
  data: DetailedJob;
}
