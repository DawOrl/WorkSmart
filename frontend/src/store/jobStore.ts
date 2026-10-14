import { create } from 'zustand';

export interface JobFilters {
  source?: string;
  remote_type?: string;
  search?: string;
}

export type JobSort = 'match' | 'newest' | 'salary';

interface JobState {
  filters: JobFilters;
  sort: JobSort;
  page: number;
  setFilter: (key: keyof JobFilters, value: string | undefined) => void;
  setSort: (sort: JobSort) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

/** Filters survive navigation between the list and an offer. */
export const useJobStore = create<JobState>((set) => ({
  filters: {},
  sort: 'match',
  page: 1,
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })),
  setSort: (sort) => set({ sort }),
  setPage: (page) => set({ page }),
  reset: () => set({ filters: {}, sort: 'match', page: 1 }),
}));
