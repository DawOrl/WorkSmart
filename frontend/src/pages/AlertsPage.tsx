import { useEffect, useState } from 'react';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import type { Alert } from '@/types';

export default function AlertsPage() {
  const { alerts, loading, fetchAlerts, createAlert, updateAlert, deleteAlert } = useAlerts();
  const [showForm, setShowForm] = useState(false);
  const [minScore, setMinScore] = useState(75);

  useEffect(() => { fetchAlerts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAlert({ min_score: minScore, keywords: [], locations: [], is_active: true });
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerty</h1>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Nowy alert
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">Nowy alert</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Minimalny match score: {minScore}%</label>
            <input
              type="range" min={50} max={95} step={5}
              value={minScore}
              onChange={e => setMinScore(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Utwórz</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Anuluj</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}</div>
      ) : alerts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center">
          <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="font-semibold">Brak alertów</p>
          <p className="text-sm text-muted-foreground">Utwórz alert, by otrzymywać powiadomienia o nowych ofertach.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: Alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-xl border bg-background p-4 shadow-sm">
              <div>
                <p className="font-medium">Match ≥ {alert.min_score}%</p>
                <p className="text-sm text-muted-foreground">
                  {alert.last_sent_at ? `Ostatnio: ${new Date(alert.last_sent_at).toLocaleDateString('pl-PL')}` : 'Nie wysłano jeszcze'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateAlert(alert.id, { is_active: !alert.is_active })}>
                  {alert.is_active
                    ? <ToggleRight className="h-6 w-6 text-primary" />
                    : <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                  }
                </button>
                <button onClick={() => deleteAlert(alert.id)} className="rounded-md p-1.5 hover:bg-accent">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
