import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';
import MatchMeter from '@/components/ui/MatchMeter';

const requirements: { name: string; state: 'has' | 'missing' }[] = [
  { name: 'React', state: 'has' },
  { name: 'TypeScript', state: 'has' },
  { name: 'HTML/CSS', state: 'has' },
  { name: 'Git', state: 'has' },
  { name: 'REST API', state: 'has' },
  { name: 'Figma', state: 'missing' },
];

/**
 * The signature moment: an offer read the way people read printed ads, with a
 * highlighter. Strokes are laid down once when the sheet scrolls into view.
 */
export default function MatchExplainer() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <section id="jak-to-dziala" className="scroll-mt-6 border-t">
      <div className="container grid gap-12 py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-28">
        <div className="lg:pt-6">
          <p className="eyebrow">Jak liczymy dopasowanie</p>
          <h2 className="mt-3 max-w-[16ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            Dopasowanie, które da się sprawdzić
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-8 text-muted-foreground">
            Nie dostajesz samej liczby. Widzisz, które wymagania z ogłoszenia już masz w CV, których brakuje i czy warto aplikować teraz.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
              <dt className="text-lg"><span className="mark">React</span></dt>
              <dd className="text-[0.9375rem] leading-6 text-muted-foreground">Zakreślone: to wymaganie jest w Twoim CV.</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
              <dt className="text-lg"><span className="gap-mark">Figma</span></dt>
              <dd className="text-[0.9375rem] leading-6 text-muted-foreground">Podkreślone: tego brakuje. Często wystarczy dopisać to do CV, jeśli tego używasz.</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
              <dt className="num font-display text-3xl leading-none text-primary">89</dt>
              <dd className="text-[0.9375rem] leading-6 text-muted-foreground">Wynik od 0 do 100. Od 80 w górę oznaczamy dopasowanie jako mocne.</dd>
            </div>
          </dl>
        </div>

        <div ref={ref} className="relative self-start">
          {/* A second sheet peeking out: one offer from a pile, not a lone mockup. */}
          <div className="absolute inset-x-6 -bottom-3 top-6 rounded-lg border bg-surface/70 sm:inset-x-10" aria-hidden />
          <article className={cn('mark-draw relative rounded-lg border bg-surface shadow-lift', inView && 'is-in')}>
            <header className="border-b px-6 py-5 sm:px-8">
              <p className="text-meta text-muted-foreground">NoFluffJobs · zdalnie · 12 000–17 000 zł</p>
              <h3 className="mt-1 font-display text-3xl font-medium leading-tight">Mid Frontend Developer</h3>
              <p className="text-muted-foreground">Kwadrat Software House</p>
            </header>
            <div className="px-6 py-6 sm:px-8">
              <p className="eyebrow mb-3">Wymagania</p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {requirements.map((r, i) => (
                  <li key={r.name} className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2.5 text-[1.0625rem]">
                    {r.state === 'has' ? <span className="mark" style={{ transitionDelay: `${i * 110}ms` }}>{r.name}</span> : <span className="gap-mark">{r.name}</span>}
                    <span className="text-meta text-muted-foreground">{r.state === 'has' ? 'w CV' : 'brak'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="grid gap-4 border-t bg-background/60 px-6 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:px-8">
              <MatchMeter score={89} showLabel />
              <p className="text-[0.9375rem] leading-6 text-muted-foreground">
                Masz 5 z 6 wymagań. Jeśli pracujesz z makietami od projektanta, dopisz Figmę do CV.
              </p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
