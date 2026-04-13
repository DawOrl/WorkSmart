// ─── Shared backend types ───────────────────────────────────────────────────

export type UserPlan = 'free' | 'pro' | 'premium';

export interface UserProfile {
  id: string;
  email: string;
  plan: UserPlan;
  stripe_customer_id?: string;
  created_at: string;
}

export interface CVProfile {
  id: string;
  user_id: string;
  file_url?: string;
  raw_text?: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  ats_score: number;              // 0–100
  suggestions: ATSSuggestion[];
  embedding?: number[];           // 1536-dim vector
  created_at: string;
  updated_at: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  graduation?: string;
}

export interface ATSSuggestion {
  issue: string;
  fix: string;
  impact: 'low' | 'medium' | 'high';
}

export type JobSource = 'justjoin' | 'pracuj' | 'nofluffjobs' | 'rocketjobs' | 'olx';
export type RemoteType = 'remote' | 'hybrid' | 'office';

export interface JobListing {
  id: string;
  external_id: string;
  source: JobSource;
  title: string;
  company?: string;
  location?: string;
  remote_type?: RemoteType;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description?: string;
  requirements: string[];
  url: string;
  embedding?: number[];
  is_active: boolean;
  scraped_at: string;
  expires_at?: string;
}

export interface MatchScore {
  id: string;
  user_id: string;
  job_id: string;
  score: number;                  // 0–100
  missing_skills: string[];
  matching_skills: string[];
  recommendation: string;
  computed_at: string;
  // Joined
  job?: JobListing;
}

export type ApplicationStatus = 'sent' | 'interview' | 'rejected' | 'offer';

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  applied_at: string;
  notes?: string;
  follow_up_at?: string;
  job?: JobListing;
}

export interface Alert {
  id: string;
  user_id: string;
  min_score: number;
  keywords: string[];
  locations: string[];
  is_active: boolean;
  last_sent_at?: string;
  created_at: string;
}
