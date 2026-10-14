import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { timeAgo } from '@/lib/utils';
import type { Alert } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import Panel from '@/components/ui/Panel';
import Switch from '@/components/ui/Switch';
import MatchMeter from '@/components/ui/MatchMeter';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingRows } from '@/components/ui/States';
import { inputClass, labelClass } from '@/components/ui/field';

const splitList = (value: string) => value.split(',').map(s => s.trim()).filter(Boolean);

export default function AlertsPage() {
  const { data: alerts, setData, error, loading, reload } = useQuery(
    () => api.get<Alert[]>('/api/alerts').then(r => r.data),
    [],
    'Nie udało się wczytać alertów.',
  );
  const [showForm, setShowForm] = useState(false);
  const [minScore, setMinScore] = useState(80);
  const [keywords, setKeywords] = useState('');
  const [locations, setLocations] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      const { data } = await api.post<Alert>('/api/alerts', {
        min_score: minScore,
        keywords: splitList(keywords),
        locations: splitList(locations),
        is_active: true,
      });
      setData([...(alerts ?? []), data]);
      setShowForm(false);
      setKeywords('');
      setLocations('');
    } catch {
      setActionError('Nie udało się zapisać alertu. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (alert: Alert) => {
    if (!alerts) return;
    const previous = alerts;
    setData(alerts.map(a => (a.id === alert.id ? { ...a, is_active: !a.is_active } : a)));
    try {
      await api.patch(`/api/alerts/${alert.id}`, { is_active: !alert.is_active });
    } catch {
      setData(previous);
      setActionError('Nie udało się zmienić alertu. Spróbuj ponownie.');
    }
  };

  const remove = async (id: string) => {
    if (!alerts) return;
    const previous = alerts;
    setConfirmDelete(null);
    setData(alerts.filter(a => a.id !== id));
    try {
      await api.delete(`/api/alerts/${id}`);
    } catch {
      setData(previous);
      setActionError('Nie udało się usunąć alertu. Spróbuj ponownie.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-settle">
      <PageHeader
        title="Alerty e-mail"
        description="Napiszemy, gdy pojawi się oferta z dopasowaniem powyżej Twojego progu. Nowe oferty sprawdzamy co godzinę."
        action={!showForm && <Button onClick={() => setShowForm(true)}>Nowy alert</Button>}
      />

      {actionError && <ErrorState message={actionError} className="mb-4" />}

      {showForm && (
        <Panel title="Nowy alert" className="mb-6">
          <form onSubmit={create} className="space-y-5">
            <div>
              <label htmlFor="threshold" className={labelClass}>Minimalne dopasowanie: <span className="num">{minScore}%</span></label>
              <input
                id="threshold"
                type="range"
                min={50}
                max={95}
                step={5}
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="h-11 w-full accent-[hsl(var(--primary))]"
              />
              <MatchMeter score={minScore} size="sm" className="mt-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="keywords" className={labelClass}>Słowa kluczowe</label>
                <input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="np. React, TypeScript" className={inputClass} />
                <p className="mt-1 text-meta text-muted-foreground">Oddziel przecinkami. Puste: wszystkie oferty.</p>
              </div>
              <div>
                <label htmlFor="locations" className={labelClass}>Miejsca</label>
                <input id="locations" value={locations} onChange={e => setLocations(e.target.value)} placeholder="np. Kraków, Zdalnie" className={inputClass} />
                <p className="mt-1 text-meta text-muted-foreground">Oddziel przecinkami. Puste: cała Polska.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Zapisuję…' : 'Zapisz alert'}</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Anuluj</Button>
            </div>
          </form>
        </Panel>
      )}

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !alerts ? (
        <LoadingRows rows={2} label="Wczytuję alerty" />
      ) : !alerts?.length ? (
        !showForm && (
          <EmptyState title="Nie masz jeszcze alertów" action={<Button onClick={() => setShowForm(true)}>Ustaw pierwszy alert</Button>}>
            Ustaw próg dopasowania, np. 80%. Dostaniesz e-mail tylko wtedy, gdy pojawi się oferta, która go przekracza.
          </EmptyState>
        )
      ) : (
        <ul className="divide-y rounded-lg border bg-surface">
          {alerts.map(alert => (
            <li key={alert.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center">
              <p className="font-display text-3xl leading-none">
                <span className="num">{alert.min_score}</span><span className="text-xl text-muted-foreground">%+</span>
              </p>
              <div className="min-w-0">
                <p className="font-medium">
                  {alert.keywords.length ? alert.keywords.join(', ') : 'Wszystkie oferty'}
                  <span className="font-normal text-muted-foreground"> · {alert.locations.length ? alert.locations.join(', ') : 'cała Polska'}</span>
                </p>
                <p className="text-meta text-muted-foreground">
                  {!alert.is_active ? 'Wstrzymany' : alert.last_sent_at ? `Ostatni e-mail ${timeAgo(alert.last_sent_at)}` : 'Jeszcze nic nie wysłano'}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:justify-end">
                <Switch checked={alert.is_active} onChange={() => void toggle(alert)} label={`Alert od ${alert.min_score}%: ${alert.is_active ? 'włączony' : 'wyłączony'}`} />
                {confirmDelete === alert.id ? (
                  <span className="flex items-center gap-1">
                    <Button variant="danger" size="sm" className="h-11" onClick={() => void remove(alert.id)}>Usuń</Button>
                    <Button variant="ghost" size="sm" className="h-11" onClick={() => setConfirmDelete(null)}>Anuluj</Button>
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" className="h-11" onClick={() => setConfirmDelete(alert.id)}>Usuń</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
