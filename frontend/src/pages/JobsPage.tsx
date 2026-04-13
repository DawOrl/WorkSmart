import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Wifi, Building2, ExternalLink } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { formatSalary, scoreColor } from '@/lib/utils';
import type { RemoteType } from '@/types';

const remoteLabels: Record<RemoteType, string> = {
  remote: 'Zdalnie',
  hybrid: 'Hybrydowo',
  office: 'Stacjonarnie',
};

export default function JobsPage() {
  const { jobs, matches, total, page, loading, filters, fetchJobs, fetchMatches, setFilter, setPage } = useJobs();

  useEffect(() => {
    fetchJobs();
    fetchMatches();
  }, []);

  useEffect(() => { fetchJobs(); }, [page, filters]);

  const scoreForJob = (jobId: string) => matches.find(m => m.job_id === jobId)?.score;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Oferty pracy</h1>
        <span className="text-sm text-muted-foreground">{total} ofert</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Szukaj..."
            value={filters.search ?? ''}
            onChange={e => setFilter('search', e.target.value || undefined)}
            className="rounded-lg border bg-background py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filters.remote_type ?? ''}
          onChange={e => setFilter('remote_type', e.target.value || undefined)}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tryb pracy</option>
          <option value="remote">Zdalnie</option>
          <option value="hybrid">Hybrydowo</option>
          <option value="office">Stacjonarnie</option>
        </select>
        <select
          value={filters.source ?? ''}
          onChange={e => setFilter('source', e.target.value || undefined)}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Wszystkie portale</option>
          <option value="justjoin">JustJoin.it</option>
          <option value="pracuj">Pracuj.pl</option>
          <option value="nofluffjobs">NoFluffJobs</option>
          <option value="rocketjobs">RocketJobs</option>
          <option value="olx">OLX</option>
        </select>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const score = scoreForJob(job.id);
            return (
              <div key={job.id} className="flex items-center justify-between rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job.id}`} className="font-medium hover:text-primary hover:underline truncate">
                      {job.title}
                    </Link>
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{job.source}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {job.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company}</span>}
                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    {job.remote_type && <span className="flex items-center gap-1"><Wifi className="h-3 w-3" />{remoteLabels[job.remote_type]}</span>}
                    <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  {score !== undefined && (
                    <span className={`text-lg font-bold ${scoreColor(score)}`}>{score}%</span>
                  )}
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 hover:bg-accent">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent"
            >
              ← Poprzednia
            </button>
            <span className="text-sm text-muted-foreground">Strona {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={jobs.length < 20}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent"
            >
              Następna →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
