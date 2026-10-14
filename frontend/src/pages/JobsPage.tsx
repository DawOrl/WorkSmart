import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { useJobStore, type JobSort } from '@/store/jobStore';
import { cn, formatSalary, placeLabel, plural, sourceLabels, timeAgo } from '@/lib/utils';
import type { JobListing, MatchScore, PaginatedJobs } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import MatchMeter from '@/components/ui/MatchMeter';
import SourceTag from '@/components/ui/SourceTag';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingRows } from '@/components/ui/States';
import { inputClass } from '@/components/ui/field';

const PAGE_SIZE = 20;

const sortOptions: { value: JobSort; label: string }[] = [
  { value: 'match', label: 'Dopasowanie' },
  { value: 'newest', label: 'Najnowsze' },
  { value: 'salary', label: 'Widełki' },
];

export default function JobsPage() {
  const { filters, sort, page, setFilter, setSort, setPage, reset } = useJobStore();
  const [search, setSearch] = useState(filters.search ?? '');

  // Debounce typing so the list does not refetch on every key.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((filters.search ?? '') !== search) setFilter('search', search || undefined);
    }, 250);
    return () => clearTimeout(t);
  }, [search, filters.search, setFilter]);

  const jobsQuery = useQuery(async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (filters.source) params.set('source', filters.source);
    if (filters.remote_type) params.set('remote_type', filters.remote_type);
    if (filters.search) params.set('search', filters.search);
    const { data } = await api.get<PaginatedJobs>(`/api/jobs?${params}`);
    return data;
  }, [page, filters.source, filters.remote_type, filters.search], 'Nie udało się wczytać ofert.');

  const matchesQuery = useQuery(
    () => api.get<{ matches: MatchScore[] }>('/api/matches?limit=100').then(r => r.data.matches),
    [],
  );

  const scoreFor = useMemo(() => {
    const map = new Map(matchesQuery.data?.map(m => [m.job_id, m.score]));
    return (id: string) => map.get(id);
  }, [matchesQuery.data]);

  const jobs = useMemo(() => {
    const list = [...(jobsQuery.data?.jobs ?? [])];
    if (sort === 'match') list.sort((a, b) => (scoreFor(b.id) ?? -1) - (scoreFor(a.id) ?? -1));
    if (sort === 'salary') list.sort((a, b) => (b.salary_max ?? b.salary_min ?? 0) - (a.salary_max ?? a.salary_min ?? 0));
    if (sort === 'newest') list.sort((a, b) => b.scraped_at.localeCompare(a.scraped_at));
    return list;
  }, [jobsQuery.data, sort, scoreFor]);

  const total = jobsQuery.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(filters.source || filters.remote_type || filters.search);

  return (
    <div className="animate-settle">
      <PageHeader
        title="Oferty pracy"
        description="Ogłoszenia z JustJoin.it, Pracuj.pl, NoFluffJobs, RocketJobs i OLX w jednym miejscu. Nowe zbieramy codziennie o 7:00 i 19:00."
      />

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]" role="search">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Szukaj w ofertach</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Stanowisko, firma albo technologia"
            className={cn(inputClass, 'pl-9')}
          />
        </label>
        <label>
          <span className="sr-only">Tryb pracy</span>
          <select value={filters.remote_type ?? ''} onChange={e => setFilter('remote_type', e.target.value || undefined)} className={inputClass}>
            <option value="">Każdy tryb pracy</option>
            <option value="remote">Zdalnie</option>
            <option value="hybrid">Hybrydowo</option>
            <option value="office">Stacjonarnie</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Portal</span>
          <select value={filters.source ?? ''} onChange={e => setFilter('source', e.target.value || undefined)} className={inputClass}>
            <option value="">Wszystkie portale</option>
            {Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div className="flex h-11 rounded-md border border-input bg-surface p-1 sm:col-span-2 lg:col-span-1" role="group" aria-label="Sortowanie">
          {sortOptions.map(o => (
            <button
              key={o.value}
              type="button"
              aria-pressed={sort === o.value}
              onClick={() => setSort(o.value)}
              className={cn(
                'flex-1 whitespace-nowrap rounded-sm px-3 text-sm transition-colors',
                sort === o.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-meta text-muted-foreground" aria-live="polite">
        <span>
          {jobsQuery.loading ? 'Wczytuję oferty…' : `${total} ${plural(total, 'oferta', 'oferty', 'ofert')}${hasFilters ? ' dla wybranych filtrów' : ''}`}
        </span>
        {hasFilters && (
          <button type="button" onClick={() => { reset(); setSearch(''); }} className="min-h-11 px-2 font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
            Wyczyść filtry
          </button>
        )}
      </div>

      {jobsQuery.error ? (
        <ErrorState message={jobsQuery.error} onRetry={jobsQuery.reload} />
      ) : jobsQuery.loading && !jobsQuery.data ? (
        <LoadingRows rows={6} label="Wczytuję oferty" />
      ) : jobs.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'Nic nie pasuje do tych filtrów' : 'Brak ofert w bazie'}
          action={hasFilters ? <Button variant="secondary" onClick={() => { reset(); setSearch(''); }}>Wyczyść filtry</Button> : undefined}
        >
          {hasFilters
            ? 'Spróbuj krótszej frazy albo innego trybu pracy.'
            : 'Oferty pojawią się po najbliższym zbieraniu ogłoszeń (7:00 lub 19:00).'}
        </EmptyState>
      ) : (
        <div className={cn('rounded-lg border bg-surface', jobsQuery.loading && 'opacity-60 transition-opacity')}>
          <div className="hidden grid-cols-[minmax(0,1fr)_9.5rem_9.5rem_11rem] gap-6 border-b px-5 py-2.5 text-xs font-medium text-muted-foreground lg:grid" aria-hidden>
            <span>Stanowisko</span>
            <span>Miejsce</span>
            <span>Widełki miesięcznie</span>
            <span>Dopasowanie do CV</span>
          </div>
          <ul className="divide-y">
            {jobs.map(job => <JobRow key={job.id} job={job} score={scoreFor(job.id)} />)}
          </ul>
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between" aria-label="Strony wyników">
          <Button variant="secondary" size="sm" className="h-11" onClick={() => setPage(page - 1)} disabled={page <= 1}>Poprzednia</Button>
          <span className="num text-meta text-muted-foreground">Strona {page} z {pages}</span>
          <Button variant="secondary" size="sm" className="h-11" onClick={() => setPage(page + 1)} disabled={page >= pages}>Następna</Button>
        </nav>
      )}
    </div>
  );
}

function JobRow({ job, score }: { job: JobListing; score?: number }) {
  return (
    <li className="relative grid gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-sunken/50 lg:grid-cols-[minmax(0,1fr)_9.5rem_9.5rem_11rem] lg:items-center">
      <div className="min-w-0">
        <Link to={`/jobs/${job.id}`} className="font-medium after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ring">
          {job.title}
        </Link>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta text-muted-foreground">
          <span>{job.company}</span>
          <span aria-hidden>·</span>
          <span>{timeAgo(job.scraped_at)}</span>
          <SourceTag source={job.source} className="ml-1" />
        </p>
      </div>
      <p className="text-meta lg:text-sm">{placeLabel(job.location, job.remote_type)}</p>
      <p className="num text-meta lg:text-sm">{formatSalary(job.salary_min, job.salary_max, job.currency)}</p>
      {score !== undefined ? (
        <MatchMeter score={score} size="sm" className="max-w-[16rem]" />
      ) : (
        <p className="text-meta text-muted-foreground">Jeszcze nie policzone</p>
      )}
    </li>
  );
}
