import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { cn, daysSince, plural, timeAgo } from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { EmptyState, ErrorState } from '@/components/ui/States';

const columns: { status: ApplicationStatus; label: string; hint: string }[] = [
  { status: 'sent', label: 'Wysłane', hint: 'Czekasz na odpowiedź' },
  { status: 'interview', label: 'Rozmowa', hint: 'Umówione spotkania' },
  { status: 'offer', label: 'Oferta', hint: 'Masz propozycję' },
  { status: 'rejected', label: 'Odmowa', hint: 'Zamknięte procesy' },
];

const FOLLOW_UP_DAYS = 7;

function formatMeeting(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

export default function TrackerPage() {
  const { data: applications, setData, error, loading, reload } = useQuery(
    () => api.get<Application[]>('/api/applications').then(r => r.data),
    [],
    'Nie udało się wczytać aplikacji.',
  );
  const [moveError, setMoveError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    if (!applications) return;
    const previous = applications;
    setMoveError(null);
    setData(applications.map(a => (a.id === id ? { ...a, status } : a)));
    try {
      await api.patch(`/api/applications/${id}`, { status });
    } catch {
      setData(previous);
      setMoveError('Nie udało się zmienić etapu. Spróbuj ponownie.');
    }
  };

  const count = applications?.length ?? 0;

  return (
    <div className="animate-settle">
      <PageHeader
        title="Tracker aplikacji"
        description={
          applications
            ? `${count} ${plural(count, 'aplikacja', 'aplikacje', 'aplikacji')}. Zmień etap, gdy firma się odezwie. Po ${FOLLOW_UP_DAYS} dniach ciszy podpowiemy, żeby się przypomnieć.`
            : 'Wszystkie wysłane aplikacje w jednym miejscu.'
        }
        action={<Link to="/jobs" className={buttonVariants({ variant: 'secondary' })}>Szukaj ofert</Link>}
      />

      {moveError && <ErrorState message={moveError} className="mb-4" />}

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !applications ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {columns.map(c => <div key={c.status} className="animate-skeleton h-56 rounded-lg border bg-surface" aria-hidden />)}
          <span className="sr-only">Wczytuję aplikacje…</span>
        </div>
      ) : count === 0 ? (
        <EmptyState title="Jeszcze nic tu nie ma" action={<Link to="/jobs" className={buttonVariants()}>Przejrzyj oferty</Link>}>
          Otwórz ofertę i wybierz „Dodaj do trackera”. Będziesz widzieć, gdzie czekasz na odpowiedź, a gdzie warto się przypomnieć.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map(col => {
            const items = applications!.filter(a => a.status === col.status);
            return (
              <section key={col.status} aria-labelledby={`col-${col.status}`} className="flex flex-col rounded-lg bg-sunken/70 p-2">
                <header className="flex items-baseline justify-between px-2 pb-3 pt-2">
                  <div>
                    <h2 id={`col-${col.status}`} className="font-semibold">{col.label}</h2>
                    <p className="text-meta text-muted-foreground">{col.hint}</p>
                  </div>
                  <span className="num font-display text-2xl leading-none text-muted-foreground">{items.length}</span>
                </header>
                <ul className="flex flex-1 flex-col gap-2">
                  {items.length === 0 && (
                    <li className="rounded-md border border-dashed border-input px-3 py-6 text-center text-meta text-muted-foreground">Pusto</li>
                  )}
                  {items.map(app => <TrackerCard key={app.id} app={app} onMove={updateStatus} />)}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrackerCard({ app, onMove }: { app: Application; onMove: (id: string, status: ApplicationStatus) => void }) {
  const silentDays = app.status === 'sent' ? daysSince(app.applied_at) : 0;

  return (
    <li className="rounded-md border bg-surface p-3.5">
      <Link to={`/jobs/${app.job_id}`} className="font-medium leading-snug hover:underline hover:underline-offset-4">
        {app.job?.title ?? 'Oferta'}
      </Link>
      <p className="text-meta text-muted-foreground">{app.job?.company}</p>
      <p className="mt-2 text-meta">Wysłano {timeAgo(app.applied_at)}</p>

      {app.status === 'interview' && app.follow_up_at && (
        <p className="mt-2 rounded-sm bg-primary-soft px-2 py-1.5 text-meta">
          <span className="font-medium">Rozmowa:</span> <span className="first-letter:uppercase">{formatMeeting(app.follow_up_at)}</span>
        </p>
      )}
      {silentDays >= FOLLOW_UP_DAYS && (
        <p className="mt-2 text-meta font-medium text-primary">{silentDays} dni bez odpowiedzi: czas na krótkie przypomnienie.</p>
      )}
      {app.notes && <p className="mt-2 border-l-2 border-input pl-2.5 text-meta text-muted-foreground">{app.notes}</p>}

      <label className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-meta text-muted-foreground">
        Etap
        <select
          value={app.status}
          onChange={e => onMove(app.id, e.target.value as ApplicationStatus)}
          className={cn('h-11 rounded-md border border-input bg-background px-2 text-sm text-foreground sm:h-9')}
        >
          {columns.map(c => <option key={c.status} value={c.status}>{c.label}</option>)}
        </select>
      </label>
    </li>
  );
}
