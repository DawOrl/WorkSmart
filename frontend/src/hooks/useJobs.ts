import { useCallback } from 'react';
import { api } from '@/lib/api';
import { useJobStore } from '@/store/jobStore';
import type { MatchScore, PaginatedJobs } from '@/types';

export function useJobs() {
  const { jobs, matches, total, page, loading, filters, setJobs, setMatches, setLoading, setFilter, setPage } =
    useJobStore();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filters.source) params.set('source', filters.source);
      if (filters.remote_type) params.set('remote_type', filters.remote_type);
      if (filters.location) params.set('location', filters.location);
      if (filters.search) params.set('search', filters.search);

      const { data } = await api.get<PaginatedJobs>(`/api/jobs?${params}`);
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }, [page, filters, setJobs, setLoading]);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<{ matches: MatchScore[] }>('/api/matches');
      setMatches(data.matches);
    } finally {
      setLoading(false);
    }
  }, [setMatches, setLoading]);

  const refreshMatches = async () => {
    const { data } = await api.post<{ count: number }>('/api/matches/refresh');
    return data.count;
  };

  return { jobs, matches, total, page, loading, filters, fetchJobs, fetchMatches, refreshMatches, setFilter, setPage };
}
