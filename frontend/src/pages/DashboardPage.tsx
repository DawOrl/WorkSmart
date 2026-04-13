import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, TrendingUp, Bell, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useCV } from '@/hooks/useCV';
import { useAuthStore } from '@/store/authStore';
import { formatSalary } from '@/lib/utils';

const statCards = [
  { key: 'ats',     label: 'Twój ATS Score',    icon: FileText,    link: '/cv',     gradient: 'from-blue-500 to-cyan-400',    glow: 'rgba(59,130,246,0.20)',  bg: 'bg-blue-50',    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-400' },
  { key: 'matched', label: 'Dopasowane oferty',  icon: Briefcase,   link: '/jobs',   gradient: 'from-green-500 to-emerald-400', glow: 'rgba(34,197,94,0.20)',   bg: 'bg-green-50',   iconBg: 'bg-gradient-to-br from-green-500 to-emerald-400' },
  { key: 'best',    label: 'Najlepszy match',    icon: TrendingUp,  link: '/jobs',   gradient: 'from-purple-500 to-violet-400', glow: 'rgba(168,85,247,0.20)',  bg: 'bg-purple-50',  iconBg: 'bg-gradient-to-br from-purple-500 to-violet-400' },
  { key: 'alerts',  label: 'Aktywne alerty',     icon: Bell,        link: '/alerts', gradient: 'from-orange-500 to-amber-400',  glow: 'rgba(249,115,22,0.20)',  bg: 'bg-orange-50',  iconBg: 'bg-gradient-to-br from-orange-500 to-amber-400' },
];

function scoreBadge(score: number) {
  if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-400 text-white';
  if (score >= 75) return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white';
  if (score >= 55) return 'bg-gradient-to-r from-orange-400 to-amber-400 text-white';
  return 'bg-gradient-to-r from-red-400 to-rose-400 text-white';
}

function useEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);
  return { ref, visible };
}

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { matches, loading, fetchMatches, refreshMatches } = useJobs();
  const { cvProfile, loadCV } = useCV();
  const { visible } = useEntrance();

  useEffect(() => {
    fetchMatches();
    loadCV();
  }, []);

  const topMatches = matches.slice(0, 5);
  const statValues: Record<string, string | number> = {
    ats:     cvProfile ? `${cvProfile.ats_score}%` : '—',
    matched: matches.length,
    best:    topMatches[0] ? `${topMatches[0].score}%` : '—',
    alerts:  '—',
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Dzień dobry' : hour < 18 ? 'Cześć' : 'Dobry wieczór';

  return (
    <div className="space-y-6">

      {/* ── Greeting ──────────────────────────────────────────────── */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <h1 className="text-2xl font-bold">
          {greeting}{' '}
          <span className="gradient-text-animated">
            {profile?.email?.split('@')[0] ?? 'użytkowniku'}
          </span>{' '}
          <span className="animate-float inline-block">👋</span>
        </h1>
        <p className="text-muted-foreground">Oto Twoje dzisiejsze dopasowania.</p>
      </div>

      {/* ── Quick stat cards ──────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Link
            key={stat.key}
            to={stat.link}
            className="feature-card group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm"
            style={{
              '--glow-color': stat.glow,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(16px)',
              transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, box-shadow 0.3s ease`,
            } as React.CSSProperties}
          >
            {/* Top gradient line */}
            <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${stat.gradient}`} />

            {/* Background glow blob */}
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`, filter: 'blur(12px)' }}
            />

            <div className="flex items-center gap-3">
              <div className={`relative shrink-0 rounded-lg ${stat.iconBg} p-2 shadow-sm`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{statValues[stat.key]}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CV missing warning ────────────────────────────────────── */}
      {!cvProfile && (
        <div
          className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.5s ease 0.36s, transform 0.5s ease 0.36s',
          }}
        >
          {/* Pulsing ring */}
          <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center">
            <span className="absolute h-14 w-14 animate-ping rounded-full bg-primary/15" />
            <span className="absolute h-10 w-10 animate-pulse rounded-full bg-primary/10" />
            <FileText className="relative h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold">Wgraj swoje CV</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Prześlij CV, żeby AI mogło analizować oferty i obliczać dopasowania.
          </p>
          <Link
            to="/cv"
            className="group inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Wgraj CV
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      {/* ── Top matches ───────────────────────────────────────────── */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.44s, transform 0.5s ease 0.44s',
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Twoje top dopasowania</h2>
          <button
            onClick={() => refreshMatches().then(fetchMatches)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            <RefreshCw className="h-3 w-3" /> Odśwież
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative h-16 overflow-hidden rounded-xl bg-secondary">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: `shimmer-sweep 1.5s linear infinite ${i * 0.2}s`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : topMatches.length === 0 ? (
          <p className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
            Brak dopasowań – wgraj CV i kliknij Odśwież.
          </p>
        ) : (
          <div className="space-y-2">
            {topMatches.map((m, i) => (
              <Link
                key={m.id}
                to={`/jobs/${m.job_id}`}
                className="group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateX(-8px)',
                  transition: `opacity 0.4s ease ${0.5 + i * 0.07}s, transform 0.4s ease ${0.5 + i * 0.07}s, box-shadow 0.2s ease`,
                }}
              >
                {/* Rank number */}
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium group-hover:text-primary transition-colors">{m.job?.title ?? 'Oferta'}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {m.job?.company} · {m.job?.location} · {formatSalary(m.job?.salary_min, m.job?.salary_max, m.job?.currency)}
                  </p>
                </div>
                <span className={`ml-3 shrink-0 rounded-full px-3 py-1 text-sm font-bold shadow-sm ${scoreBadge(m.score)}`}>
                  {m.score}%
                </span>
              </Link>
            ))}
            <Link
              to="/jobs"
              className="flex items-center justify-center gap-2 rounded-xl border bg-background p-3 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            >
              Zobacz wszystkie oferty <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
