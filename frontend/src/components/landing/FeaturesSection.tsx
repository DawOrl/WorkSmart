import { FileText, Search, Percent, Bell, KanbanSquare, PenLine } from 'lucide-react';

/**
 * Features section with animated cards.
 * TODO: Replace card divs with ReactBits StarBorder component:
 *   npx shadcn@latest add "https://reactbits.dev/shadcn/star-border"
 */
const features = [
  {
    icon: FileText,
    title: 'CV Analyzer',
    description: 'Prześlij PDF lub DOCX. AI wyciąga umiejętności, ocenia czytelność ATS i daje konkretne sugestie poprawek.',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Agent 1',
  },
  {
    icon: Search,
    title: 'Job Aggregator',
    description: 'Oferty z JustJoin.it, Pracuj.pl, NoFluffJobs, RocketJobs i OLX w jednym miejscu. Aktualizowane 2x dziennie.',
    color: 'from-green-500 to-emerald-500',
    badge: 'Agent 2',
  },
  {
    icon: Percent,
    title: 'Match Score',
    description: 'AI porównuje Twój profil z każdą ofertą i pokazuje % dopasowania + czego brakuje. Oferty posortowane dla Ciebie.',
    color: 'from-purple-500 to-violet-500',
    badge: 'Agent 3',
  },
  {
    icon: Bell,
    title: 'Alerty & Tracker',
    description: 'Ustaw próg (np. 75%) i otrzymaj e-mail, gdy pojawi się nowa oferta. Śledź status aplikacji w kanbanie.',
    color: 'from-orange-500 to-amber-500',
    badge: 'Agent 4',
  },
  {
    icon: PenLine,
    title: 'Letter Writer',
    description: 'AI generuje spersonalizowany list motywacyjny pod konkretną ofertę w 30 sekund. 3 style do wyboru.',
    color: 'from-rose-500 to-pink-500',
    badge: 'Agent 5 · Pro',
    pro: true,
  },
  {
    icon: KanbanSquare,
    title: 'Kanban Tracker',
    description: 'Zarządzaj aplikacjami: wysłane → rozmowa → oferta. Reminder po 7 dniach milczenia.',
    color: 'from-slate-500 to-zinc-500',
    badge: 'Wbudowane',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">Wszystko, czego potrzebujesz</h2>
          <p className="text-muted-foreground">5 agentów AI pracuje dla Ciebie 24/7</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color, badge, pro }) => (
            <div
              key={title}
              className={`group relative rounded-xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${pro ? 'border-yellow-200' : ''}`}
            >
              {/* Gradient icon background */}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-semibold">{title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pro ? 'bg-yellow-100 text-yellow-700' : 'bg-secondary text-secondary-foreground'}`}>
                  {badge}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
