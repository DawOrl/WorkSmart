import { create } from 'zustand';
import type { JobListing, MatchScore, PaginatedJobs } from '@/types';

interface JobFilters {
  source?: string;
  remote_type?: string;
  location?: string;
  search?: string;
}

interface JobState {
  jobs: JobListing[];
  matches: MatchScore[];
  total: number;
  page: number;
  loading: boolean;
  filters: JobFilters;
  setJobs: (result: PaginatedJobs) => void;
  setMatches: (matches: MatchScore[]) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (key: keyof JobFilters, value: string | undefined) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  matches: [],
  total: 0,
  page: 1,
  loading: false,
  filters: {},
  setJobs: ({ jobs, total, page }) => set({ jobs, total, page }),
  setMatches: (matches) => set({ matches }),
  setLoading: (loading) => set({ loading }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })),
  setPage: (page) => set({ page }),
  reset: () => set({ jobs: [], matches: [], total: 0, page: 1, loading: false, filters: {} }),
}));
