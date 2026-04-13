import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/types';

const columns: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'sent', label: 'Wysłane', color: 'bg-blue-100 text-blue-800' },
  { status: 'interview', label: 'Rozmowa', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'offer', label: 'Oferta', color: 'bg-green-100 text-green-800' },
  { status: 'rejected', label: 'Odrzucone', color: 'bg-red-100 text-red-800' },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Application[]>('/api/applications')
      .then(r => setApplications(r.data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    await api.patch(`/api/applications/${id}`, { status });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tracker aplikacji</h1>
        <span className="text-sm text-muted-foreground">{applications.length} aplikacji</span>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <p className="font-semibold">Brak aplikacji</p>
          <p className="mt-1 text-sm text-muted-foreground">Zacznij aplikować na oferty, by śledzić ich status.</p>
          <Link to="/jobs" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Przeglądaj oferty
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map(col => (
            <div key={col.status} className="rounded-xl border bg-secondary/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-medium text-sm">{col.label}</h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.color}`}>
                  {applications.filter(a => a.status === col.status).length}
                </span>
              </div>
              <div className="space-y-2">
                {applications.filter(a => a.status === col.status).map(app => (
                  <div key={app.id} className="rounded-lg border bg-background p-3 shadow-sm">
                    <Link to={`/jobs/${app.job_id}`} className="block font-medium text-sm hover:text-primary hover:underline truncate">
                      {app.job?.title ?? 'Oferta'}
                    </Link>
                    <p className="text-xs text-muted-foreground">{app.job?.company}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(app.applied_at)}</p>
                    <select
                      value={app.status}
                      onChange={e => updateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="mt-2 w-full rounded-md border bg-background px-2 py-1 text-xs focus:outline-none"
                    >
                      {columns.map(c => <option key={c.status} value={c.status}>{c.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
