import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { isDemo } from '@/lib/env';
import { useQuery } from '@/hooks/useQuery';
import { formatDate, formatSalary, matchTone, matchToneLabel, remoteLabels, sourceLabels, timeAgo } from '@/lib/utils';
import type { Application, JobListing, MatchScore } from '@/types';
import Panel from '@/components/ui/Panel';
import MatchMeter from '@/components/ui/MatchMeter';
import SourceTag from '@/components/ui/SourceTag';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { EmptyState, ErrorState } from '@/components/ui/States';

const stageLabel: Record<Application['status'], string> = {
  sent: 'wysłana',
  interview: 'rozmowa',
  offer: 'oferta',
  rejected: 'odmowa',
};

interface Detail {
  job: JobListing | null;
  match?: MatchScore;
  application?: Application;
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, setData, error, loading, reload } = useQuery<Detail>(async () => {
    const jobReq = api.get<JobListing>(`/api/jobs/${id}`).then(r => r.data).catch(err => {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      throw err;
    });
    const [job, matches, applications] = await Promise.all([
      jobReq,
      api.get<{ matches: MatchScore[] }>('/api/matches?limit=100').then(r => r.data.matches),
      api.get<Application[]>('/api/applications').then(r => r.data),
    ]);
    return { job, match: matches.find(m => m.job_id === id), application: applications.find(a => a.job_id === id) };
  }, [id], 'Nie udało się wczytać oferty.');

  const addToTracker = async () => {
    if (!data?.job) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { data: created } = await api.post<Application>('/api/applications', { job_id: data.job.id, status: 'sent' });
      setData({ ...data, application: created });
    } catch {
      setSaveError('Nie udało się zapisać w trackerze. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  const back = (
    <Link to="/jobs" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Wszystkie oferty
    </Link>
  );

  if (error) return <>{back}<ErrorState message={error} onRetry={reload} /></>;

  if (loading && !data) {
    return (
      <div aria-busy="true">
        {back}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3 rounded-lg border bg-surface p-6" aria-hidden>
            <div className="animate-skeleton h-4 w-24 rounded-sm bg-sunken" />
            <div className="animate-skeleton h-8 w-3/5 rounded-sm bg-sunken" />
            <div className="animate-skeleton h-3 w-2/5 rounded-sm bg-sunken/70" />
            <div className="animate-skeleton mt-6 h-24 rounded-sm bg-sunken/60" />
          </div>
          <div className="animate-skeleton h-64 rounded-lg border bg-surface" aria-hidden />
        </div>
        <span className="sr-only">Wczytuję ofertę…</span>
      </div>
    );
  }

  if (!data?.job) {
    return (
      <>
        {back}
        <EmptyState title="Nie znaleźliśmy tej oferty" action={<Link to="/jobs" className={buttonVariants()}>Wróć do listy ofert</Link>}>
          Ogłoszenie mogło wygasnąć albo zostać usunięte z portalu, z którego je pobraliśmy.
        </EmptyState>
      </>
    );
  }

  const { job, match, application } = data;
  const isMatching = (req: string) => match?.matching_skills.some(s => same(s, req));
  const isMissing = (req: string) => match?.missing_skills.some(s => same(s, req));
  const metCount = job.requirements.filter(isMatching).length;

  return (
    <div className="animate-settle">
      {back}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── The offer, read like a printed ad with a highlighter ─────────── */}
        <article className="rounded-lg border bg-surface">
          <header className="border-b px-5 py-6 sm:px-7">
            <p className="flex flex-wrap items-center gap-2 text-meta text-muted-foreground">
              <SourceTag source={job.source} />
              <span>dodana {timeAgo(job.scraped_at)}</span>
            </p>
            <h1 className="mt-3 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[2.5rem]">{job.title}</h1>
            <p className="mt-2 text-lg">{job.company}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-meta text-muted-foreground">Miejsce</dt>
                <dd className="font-medium">{job.location === 'Zdalnie' ? 'Dowolne' : job.location}</dd>
              </div>
              <div>
                <dt className="text-meta text-muted-foreground">Tryb pracy</dt>
                <dd className="font-medium">{job.remote_type ? remoteLabels[job.remote_type] : 'Nie podano'}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-meta text-muted-foreground">Widełki miesięcznie</dt>
                <dd className="num font-medium">{formatSalary(job.salary_min, job.salary_max, job.currency)}</dd>
              </div>
            </dl>
          </header>

          {job.description && (
            <section className="border-b px-5 py-6 sm:px-7">
              <h2 className="eyebrow mb-2">O stanowisku</h2>
              <p className="max-w-prose leading-7">{job.description}</p>
            </section>
          )}

          {job.requirements.length > 0 && (
            <section className="px-5 py-6 sm:px-7">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="eyebrow">Wymagania</h2>
                {match && (
                  <p className="text-meta text-muted-foreground">
                    <span className="mark text-foreground">zakreślone</span> masz w CV, <span className="gap-mark text-foreground">podkreślone</span> brakuje
                  </p>
                )}
              </div>
              <ul className="space-y-2.5">
                {job.requirements.map(req => (
                  <li key={req} className="flex items-baseline justify-between gap-4 border-b border-dashed pb-2.5 last:border-0 last:pb-0">
                    <span className="text-[1.0625rem]">
                      {isMatching(req) ? <span className="mark">{req}</span> : isMissing(req) ? <span className="gap-mark">{req}</span> : req}
                    </span>
                    <span className="shrink-0 text-meta text-muted-foreground">
                      {isMatching(req) ? 'w Twoim CV' : isMissing(req) ? 'brak w CV' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {/* ── Your fit and what to do next ─────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <Panel title="Twoje dopasowanie">
            {match ? (
              <>
                <MatchMeter score={match.score} size="lg" />
                <p className="mt-3 text-sm font-medium">
                  {matchToneLabel[matchTone(match.score)]} · {metCount} z {job.requirements.length} wymagań
                </p>
                <p className="mt-3 text-[0.9375rem] leading-6 text-muted-foreground">{match.recommendation}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Dopasowanie dla tej oferty nie jest jeszcze policzone. Przelicz je na pulpicie albo wgraj aktualne CV.
              </p>
            )}

            <div className="mt-5 space-y-2 border-t pt-4">
              {application ? (
                <p className="rounded-md bg-primary-soft px-3 py-2.5 text-sm">
                  W trackerze od {formatDate(application.applied_at)}, etap: <strong className="font-semibold">{stageLabel[application.status]}</strong>.{' '}
                  <Link to="/tracker" className="font-medium underline underline-offset-4">Otwórz tracker</Link>
                </p>
              ) : (
                <Button className="w-full" onClick={addToTracker} disabled={saving}>
                  {saving ? 'Zapisuję…' : 'Dodaj do trackera jako wysłaną'}
                </Button>
              )}
              {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
              <Link to={`/letter?job=${job.id}`} className={buttonVariants({ variant: 'secondary', className: 'w-full' })}>
                Napisz list motywacyjny
              </Link>
            </div>
          </Panel>

          {isDemo ? (
            <p className="px-1 text-meta text-muted-foreground">
              To przykładowe ogłoszenie z wersji demo, dlatego link do {sourceLabels[job.source]} jest wyłączony.
            </p>
          ) : (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'ghost', className: 'w-full' })}>
              Otwórz ogłoszenie na {sourceLabels[job.source]} <ExternalLink aria-hidden />
              <span className="sr-only">(nowa karta)</span>
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
