import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { useAuthStore } from '@/store/authStore';
import { cn, daysSince, firstName, formatSalary, placeLabel, plural, timeAgo } from '@/lib/utils';
import type { Alert, Application, CVProfile, MatchScore, PaginatedJobs } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import Panel from '@/components/ui/Panel';
import MatchMeter from '@/components/ui/MatchMeter';
import SourceTag from '@/components/ui/SourceTag';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { EmptyState, ErrorState, LoadingRows } from '@/components/ui/States';

interface DashboardData {
  matches: MatchScore[];
  totalJobs: number;
  cv: CVProfile | null;
  applications: Application[];
  alerts: Alert[];
}

async function loadDashboard(): Promise<DashboardData> {
  const cvRequest = api.get<CVProfile>('/api/cv/me').then(r => r.data).catch(err => {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  });
  const [matches, jobs, cv, applications, alerts] = await Promise.all([
    api.get<{ matches: MatchScore[] }>('/api/matches?limit=100').then(r => r.data.matches),
    api.get<PaginatedJobs>('/api/jobs?limit=1').then(r => r.data),
    cvRequest,
    api.get<Application[]>('/api/applications').then(r => r.data),
    api.get<Alert[]>('/api/alerts').then(r => r.data),
  ]);
  return { matches, totalJobs: jobs.total, cv, applications, alerts };
}

const stageOrder: { status: Application['status']; label: string }[] = [
  { status: 'sent', label: 'Wysłane' },
  { status: 'interview', label: 'Rozmowa' },
  { status: 'offer', label: 'Oferta' },
  { status: 'rejected', label: 'Odmowa' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5 || hour >= 18) return 'Dobry wieczór';
  return 'Dzień dobry';
}

function formatMeeting(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { data, error, loading, reload } = useQuery(loadDashboard, [], 'Nie udało się wczytać pulpitu.');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNote, setRefreshNote] = useState<string | null>(null);

  const name = firstName(profile?.full_name, profile?.email);

  const refresh = async () => {
    setRefreshing(true);
    setRefreshNote(null);
    try {
      const { data: res } = await api.post<{ count: number }>('/api/matches/refresh');
      setRefreshNote(res.count > 0 ? `Dodano ${res.count} nowych dopasowań.` : 'Brak nowych ofert od ostatniego przeliczenia.');
      await reload();
    } catch {
      setRefreshNote('Nie udało się przeliczyć dopasowań. Spróbuj za chwilę.');
    } finally {
      setRefreshing(false);
    }
  };

  const strong = data?.matches.filter(m => m.score >= 80) ?? [];
  const top = data?.matches.slice(0, 6) ?? [];

  return (
    <div className="animate-settle">
      <PageHeader
        title={name ? `${greeting()}, ${name}.` : `${greeting()}.`}
        description={
          data && data.cv
            ? <>Spośród {data.totalJobs} ofert w bazie <strong className="font-semibold text-foreground">{strong.length} {plural(strong.length, 'pasuje', 'pasują', 'pasuje')}</strong> do Twojego CV w co najmniej 80%.</>
            : 'Oferty z pięciu portali, ułożone według dopasowania do Twojego CV.'
        }
        action={
          <>
            <Button variant="secondary" onClick={refresh} disabled={refreshing || loading}>
              {refreshing ? 'Przeliczam…' : 'Przelicz dopasowania'}
            </Button>
            <Link to="/jobs" className={buttonVariants({ variant: 'primary' })}>Wszystkie oferty</Link>
          </>
        }
      />
      <p role="status" className={refreshNote ? '-mt-3 mb-5 text-meta text-muted-foreground' : 'sr-only'}>{refreshNote}</p>

      {error && <ErrorState message={error} onRetry={reload} className="mb-6" />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Ranked matches: the decision this screen exists for ───────────── */}
        <Panel
          title="Najlepiej dopasowane"
          description="Kolejność według zgodności Twojego CV z wymaganiami"
          bodyClassName="p-0"
        >
          {loading && !data ? (
            <LoadingRows rows={5} label="Wczytuję dopasowania" className="rounded-none border-0" />
          ) : data && !data.cv ? (
            <EmptyState
              title="Najpierw wgraj CV"
              className="m-5"
              action={<Link to="/cv" className={buttonVariants()}>Wgraj CV</Link>}
            >
              Dopasowanie liczymy, porównując umiejętności z CV z wymaganiami każdej oferty. Bez CV nie mamy z czym porównać.
            </EmptyState>
          ) : top.length === 0 ? (
            <EmptyState title="Brak dopasowań" className="m-5" action={<Button onClick={refresh}>Przelicz dopasowania</Button>}>
              Nowe oferty zbieramy codziennie o 7:00 i 19:00. Przelicz dopasowania, gdy pojawią się w bazie.
            </EmptyState>
          ) : (
            <>
              <ol className="divide-y">
                {top.map((m, i) => (
                  <li key={m.id}>
                    <Link
                      to={`/jobs/${m.job_id}`}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-sunken/50 sm:grid-cols-[1.5rem_minmax(0,1fr)_11rem]"
                    >
                      <span className="num self-start pt-0.5 font-display text-lg leading-6 text-muted-foreground">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{m.job?.title}</p>
                        <p className="mt-0.5 truncate text-meta text-muted-foreground">
                          {m.job?.company} · {placeLabel(m.job?.location, m.job?.remote_type)}
                        </p>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-meta">
                          <span className="num">{formatSalary(m.job?.salary_min, m.job?.salary_max, m.job?.currency)}</span>
                          {m.job && <SourceTag source={m.job.source} />}
                        </p>
                      </div>
                      <MatchMeter score={m.score} size="sm" className="col-start-2 sm:col-start-auto" />
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="border-t px-5 py-3">
                <Link to="/jobs" className="text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                  Wszystkie oferty ({data?.totalJobs})
                </Link>
              </div>
            </>
          )}
        </Panel>

        {/* ── Side column: CV, applications in progress, alerts ─────────────── */}
        <div className="space-y-6">
          <CVSummary cv={data?.cv} loading={loading && !data} />
          <TrackerSummary applications={data?.applications} loading={loading && !data} />
          <AlertSummary alerts={data?.alerts} loading={loading && !data} />
        </div>
      </div>
    </div>
  );
}

function SideSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="animate-skeleton h-3.5 w-1/2 rounded-sm bg-sunken" />
      <div className="animate-skeleton h-3 w-4/5 rounded-sm bg-sunken/70" />
    </div>
  );
}

function CVSummary({ cv, loading }: { cv?: CVProfile | null; loading: boolean }) {
  const topFix = cv?.suggestions.find(s => s.impact === 'high') ?? cv?.suggestions[0];
  return (
    <Panel title="Twoje CV" action={cv && <Link to="/cv" className="text-sm font-medium text-primary hover:underline">Analiza</Link>}>
      {loading ? <SideSkeleton /> : !cv ? (
        <p className="text-sm text-muted-foreground">
          Brak CV. <Link to="/cv" className="font-medium text-foreground underline underline-offset-4">Wgraj plik PDF lub DOCX</Link>, a policzymy dopasowania.
        </p>
      ) : (
        <>
          <p className="mb-2 text-meta text-muted-foreground">Czytelność dla systemów ATS</p>
          <MatchMeter score={cv.ats_score} label="Czytelność dla ATS" />
          {topFix && (
            <div className="mt-4 border-t pt-3">
              <p className="text-meta text-muted-foreground">Najważniejsza poprawka</p>
              <p className="mt-0.5 text-sm font-medium">{topFix.issue}</p>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

function TrackerSummary({ applications, loading }: { applications?: Application[]; loading: boolean }) {
  const next = applications
    ?.filter(a => a.status === 'interview' && a.follow_up_at)
    .sort((a, b) => (a.follow_up_at ?? '').localeCompare(b.follow_up_at ?? ''))[0];
  const silent = applications?.filter(a => a.status === 'sent' && daysSince(a.applied_at) >= 7) ?? [];

  return (
    <Panel title="Aplikacje w toku" action={<Link to="/tracker" className="text-sm font-medium text-primary hover:underline">Tracker</Link>}>
      {loading || !applications ? <SideSkeleton /> : applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">Jeszcze nic nie śledzisz. Zapisz ofertę w trackerze z poziomu jej karty.</p>
      ) : (
        <>
          <dl className="grid grid-cols-4 gap-2 text-center">
            {stageOrder.map(({ status, label }) => {
              const count = applications.filter(a => a.status === status).length;
              return (
                <div key={status} className={cn('rounded-md py-2', count ? 'bg-sunken/70' : 'bg-transparent')}>
                  <dd className="num font-display text-2xl leading-7">{count}</dd>
                  <dt className="text-[0.6875rem] font-medium text-muted-foreground">{label}</dt>
                </div>
              );
            })}
          </dl>
          {next && (
            <div className="mt-4 border-t pt-3">
              <p className="text-meta text-muted-foreground">Najbliższa rozmowa</p>
              <p className="mt-0.5 text-sm font-medium">{next.job?.company}: {next.job?.title}</p>
              <p className="text-sm first-letter:uppercase">{formatMeeting(next.follow_up_at!)}</p>
            </div>
          )}
          {silent.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <p className="text-meta text-muted-foreground">Bez odpowiedzi od tygodnia</p>
              <ul className="mt-0.5 space-y-0.5 text-sm">
                {silent.map(a => (
                  <li key={a.id}>
                    {a.job?.company} <span className="text-muted-foreground">({daysSince(a.applied_at)} dni)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

function AlertSummary({ alerts, loading }: { alerts?: Alert[]; loading: boolean }) {
  const active = alerts?.filter(a => a.is_active) ?? [];
  return (
    <Panel title="Alerty e-mail" action={<Link to="/alerts" className="text-sm font-medium text-primary hover:underline">Ustawienia</Link>}>
      {loading || !alerts ? <SideSkeleton /> : active.length === 0 ? (
        <p className="text-sm text-muted-foreground">Żaden alert nie jest włączony. Ustaw próg, a napiszemy, gdy pojawi się pasująca oferta.</p>
      ) : (
        <ul className="space-y-3">
          {active.map(a => (
            <li key={a.id} className="text-sm">
              <p className="font-medium">Dopasowanie od {a.min_score}%</p>
              <p className="text-muted-foreground">
                {[...a.keywords, ...a.locations].join(', ') || 'Wszystkie oferty'}
              </p>
              <p className="text-meta text-muted-foreground">
                {a.last_sent_at ? `Ostatni e-mail ${timeAgo(a.last_sent_at)}` : 'Jeszcze nic nie wysłano'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
