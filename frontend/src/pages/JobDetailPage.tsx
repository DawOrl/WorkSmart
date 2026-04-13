import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Building2, Wifi, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { formatSalary, formatDate, scoreColor } from '@/lib/utils';
import type { JobListing, MatchScore } from '@/types';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [match, setMatch] = useState<MatchScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<JobListing>(`/api/jobs/${id}`),
      api.get<{ matches: MatchScore[] }>('/api/matches?limit=100'),
    ]).then(([jobRes, matchRes]) => {
      setJob(jobRes.data);
      const m = matchRes.data.matches.find(m => m.job_id === id);
      if (m) setMatch(m);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!job) return <div className="text-center text-muted-foreground py-16">Oferta nie została znaleziona.</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Powrót do ofert
      </Link>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              {job.company && <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company}</span>}
              {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
              {job.remote_type && <span className="flex items-center gap-1"><Wifi className="h-4 w-4" />{job.remote_type}</span>}
            </div>
            <p className="mt-2 font-medium text-primary">{formatSalary(job.salary_min, job.salary_max, job.currency)}</p>
          </div>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Aplikuj <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Match score */}
        {match && (
          <div className="mb-4 rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Twoje dopasowanie:</span>
                  <span className={`text-xl font-bold ${scoreColor(match.score)}`}>{match.score}%</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{match.recommendation}</p>
              </div>
            </div>
            {match.missing_skills.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Brakujące umiejętności:</p>
                <div className="flex flex-wrap gap-1">
                  {match.missing_skills.map(s => (
                    <span key={s} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground">Dodano: {formatDate(job.scraped_at)} · Źródło: {job.source}</p>
      </div>

      {job.description && (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="mb-3 font-semibold">Opis stanowiska</h2>
          <div className="prose prose-sm max-w-none text-sm text-muted-foreground whitespace-pre-line">{job.description}</div>
        </div>
      )}

      {job.requirements.length > 0 && (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="mb-3 font-semibold">Wymagania</h2>
          <ul className="space-y-1.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
