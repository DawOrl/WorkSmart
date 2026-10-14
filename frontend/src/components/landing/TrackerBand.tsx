const board: { label: string; cards: { title: string; company: string; note?: string; nudge?: string }[] }[] = [
  {
    label: 'Wysłane',
    cards: [
      { title: 'Frontend Developer (React)', company: 'Lumen Fintech', note: 'Wysłano 3 dni temu' },
      { title: 'Frontend Developer, e-commerce', company: 'Sklep Brzoza', nudge: '11 dni bez odpowiedzi: czas na przypomnienie' },
    ],
  },
  { label: 'Rozmowa', cards: [{ title: 'Mid Frontend Developer', company: 'Kwadrat Software House', note: 'Czwartek, 14:00' }] },
  { label: 'Oferta', cards: [{ title: 'React Developer', company: 'Polna Logistics', note: 'Odpowiedź do piątku' }] },
  { label: 'Odmowa', cards: [{ title: 'Fullstack Developer', company: 'Sowa Edukacja' }] },
];

/** Full-bleed band in a darker shade of the same paper: the one section that is about process, not documents. */
export default function TrackerBand() {
  return (
    <section className="bg-sunken/70">
      <div className="container py-20 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 className="max-w-[18ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            Wiesz, gdzie czekasz, a gdzie warto się przypomnieć
          </h2>
          <p className="max-w-prose text-lg leading-8 text-muted-foreground">
            Tracker układa aplikacje w etapy. Po siedmiu dniach ciszy podpowie, żeby napisać do rekrutera. Alert e-mail da znać,
            gdy pojawi się oferta powyżej progu, który sam ustawisz.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Przykładowy tracker aplikacji" role="img">
          {board.map(col => (
            <div key={col.label} className="rounded-lg bg-background/70 p-2">
              <p className="flex items-baseline justify-between px-2 pb-2 pt-1 text-sm font-semibold">
                {col.label}
                <span className="num font-display text-xl font-normal text-muted-foreground">{col.cards.length}</span>
              </p>
              <div className="space-y-2">
                {col.cards.map(card => (
                  <div key={card.title} className="rounded-md border bg-surface p-3">
                    <p className="text-sm font-medium leading-snug">{card.title}</p>
                    <p className="text-xs text-muted-foreground">{card.company}</p>
                    {card.note && <p className="mt-2 text-xs">{card.note}</p>}
                    {card.nudge && <p className="mt-2 text-xs font-medium text-primary">{card.nudge}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.9375rem]">
          <span className="font-medium">Alert:</span>
          <span className="text-muted-foreground">dopasowanie od 80%, React i TypeScript, Warszawa lub zdalnie.</span>
          <span className="text-muted-foreground">Sprawdzamy nowe oferty co godzinę.</span>
        </p>
      </div>
    </section>
  );
}
