import { FileText, Search, Percent, Bell, KanbanSquare, PenLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: FileText,
    title: 'CV Analyzer',
    description: 'Prześlij PDF lub DOCX. AI wyciąga umiejętności, ocenia czytelność ATS i daje konkretne sugestie poprawek.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.28)',
    badge: 'Agent 1',
  },
  {
    icon: Search,
    title: 'Job Aggregator',
    description: 'Oferty z JustJoin.it, Pracuj.pl, NoFluffJobs, RocketJobs i OLX w jednym miejscu. Aktualizowane 2x dziennie.',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'rgba(34,197,94,0.28)',
    badge: 'Agent 2',
  },
  {
    icon: Percent,
    title: 'Match Score',
    description: 'AI porównuje Twój profil z każdą ofertą i pokazuje % dopasowania + czego brakuje. Oferty posortowane dla Ciebie.',
    gradient: 'from-purple-500 to-violet-500',
    glow: 'rgba(168,85,247,0.28)',
    badge: 'Agent 3',
  },
  {
    icon: Bell,
    title: 'Alerty & Tracker',
    description: 'Ustaw próg (np. 75%) i otrzymaj e-mail, gdy pojawi się nowa oferta. Śledź status aplikacji w kanbanie.',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.28)',
    badge: 'Agent 4',
  },
  {
    icon: PenLine,
    title: 'Letter Writer',
    description: 'AI generuje spersonalizowany list motywacyjny pod konkretną ofertę w 30 sekund. 3 style do wyboru.',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.28)',
    badge: 'Agent 5 · Pro',
    pro: true,
  },
  {
    icon: KanbanSquare,
    title: 'Kanban Tracker',
    description: 'Zarządzaj aplikacjami: wysłane → rozmowa → oferta. Reminder po 7 dniach milczenia.',
    gradient: 'from-slate-500 to-zinc-500',
    glow: 'rgba(100,116,139,0.22)',
    badge: 'Wbudowane',
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export default function FeaturesSection() {
  const { ref, visible } = useReveal();

  return (
    <section className="relative overflow-hidden py-24">
      {/* ── Section background ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 50%, #eff6ff 100%)' }}
      />

      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-blob-1 absolute -right-40 top-10 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }}
        />
        <div
          className="animate-blob-3 absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* ── Heading ──────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
            Funkcjonalności
          </span>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">Wszystko, czego potrzebujesz</h2>
          <p className="text-muted-foreground">5 agentów AI pracuje dla Ciebie 24/7</p>
        </div>

        {/* ── Cards grid ───────────────────────────────────────────── */}
        <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, gradient, glow, badge, pro }, i) => (
            <div
              key={title}
              className={`feature-card group relative rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur-sm ${pro ? 'border-yellow-200' : 'border-white'}`}
              style={{
                '--glow-color': glow,
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, box-shadow 0.3s ease`,
              } as React.CSSProperties}
            >
              {/* Top gradient line */}
              <div className={`absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Icon */}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                <Icon className="h-6 w-6" />
              </div>

              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-semibold">{title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pro ? 'bg-yellow-100 text-yellow-700' : 'bg-secondary text-secondary-foreground'}`}>
                  {badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

              {/* Corner glow on hover */}
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, filter: 'blur(16px)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
