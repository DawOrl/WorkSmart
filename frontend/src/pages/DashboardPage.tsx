import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, TrendingUp, Bell, ArrowRight, RefreshCw } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useCV } from '@/hooks/useCV';
import { useAuthStore } from '@/store/authStore';
import { scoreColor, formatSalary } from '@/lib/utils';

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { matches, loading, fetchMatches, refreshMatches } = useJobs();
  const { cvProfile, loadCV } = useCV();

  useEffect(() => {
    fetchMatches();
    loadCV();
  }, []);

  const topMatches = matches.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dzień dobry 👋</h1>
        <p className="text-muted-foreground">Oto Twoje dzisiejsze dopasowania.</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Twój ATS Score', value: cvProfile ? `${cvProfile.ats_score}%` : '—', icon: FileText, link: '/cv' },
          { label: 'Dopasowane oferty', value: matches.length, icon: Briefcase, link: '/jobs' },
          { label: 'Najlepszy match', value: topMatches[0] ? `${topMatches[0].score}%` : '—', icon: TrendingUp, link: '/jobs' },
          { label: 'Aktywne alerty', value: '—', icon: Bell, link: '/alerts' },
        ].map(stat => (
          <Link
            key={stat.label}
            to={stat.link}
            className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* CV missing warning */}
      {!cvProfile && (
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
          <FileText className="mx-auto mb-2 h-8 w-8 text-primary/60" />
          <h3 className="font-semibold">Wgraj swoje CV</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Prześlij CV, żeby AI mogło analizować oferty i obliczać dopasowania.
          </p>
          <Link to="/cv" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Wgraj CV <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Top matches */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Twoje top dopasowania</h2>
          <button
            onClick={() => refreshMatches().then(fetchMatches)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
          >
            <RefreshCw className="h-3 w-3" /> Odśwież
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        ) : topMatches.length === 0 ? (
          <p className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
            Brak dopasowań – wgraj CV i kliknij Odśwież.
          </p>
        ) : (
          <div className="space-y-3">
            {topMatches.map(m => (
              <Link
                key={m.id}
                to={`/jobs/${m.job_id}`}
                className="flex items-center justify-between rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <p className="font-medium">{m.job?.title ?? 'Oferta'}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.job?.company} · {m.job?.location} · {formatSalary(m.job?.salary_min, m.job?.salary_max, m.job?.currency)}
                  </p>
                </div>
                <div className={`text-xl font-bold ${scoreColor(m.score)}`}>
                  {m.score}%
                </div>
              </Link>
            ))}
            <Link to="/jobs" className="flex items-center justify-center gap-2 rounded-xl border bg-background p-3 text-sm font-medium text-muted-foreground hover:bg-accent">
              Zobacz wszystkie oferty <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
