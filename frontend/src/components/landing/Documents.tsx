import MatchMeter from '@/components/ui/MatchMeter';

const fixes = [
  { issue: 'Brak słów kluczowych o testowaniu', impact: 'Duży wpływ' },
  { issue: 'Podsumowanie ma jedno zdanie', impact: 'Średni wpływ' },
  { issue: 'Brak linku do GitHuba lub portfolio', impact: 'Średni wpływ' },
];

/** Two documents side by side: the CV going in, the letter going out. */
export default function Documents() {
  return (
    <section className="container py-20 lg:py-28">
      <h2 className="max-w-[22ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
        CV, które przejdzie przez ATS, i list pod konkretną ofertę
      </h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <div className="rounded-lg border bg-surface">
            <div className="border-b px-6 py-5">
              <p className="text-meta text-muted-foreground">Czytelność dla systemów ATS</p>
              <MatchMeter score={72} size="lg" className="mt-3" showLabel label="Dobra czytelność" />
            </div>
            <ol className="divide-y">
              {fixes.map((f, i) => (
                <li key={f.issue} className="flex items-baseline gap-4 px-6 py-3.5">
                  <span className="num font-display text-lg text-muted-foreground">{i + 1}</span>
                  <span className="flex-1 text-[0.9375rem]">{f.issue}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{f.impact}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-4 max-w-prose text-[0.9375rem] leading-6 text-muted-foreground">
            Wgrywasz PDF albo DOCX. Odczytujemy umiejętności i doświadczenie, oceniamy, ile z tego zobaczy system rekrutacyjny,
            i układamy poprawki od najważniejszej.
          </p>
        </div>

        <div>
          <div className="rounded-lg border bg-surface px-6 py-8 shadow-lift sm:px-10 sm:py-10">
            <p className="text-meta text-muted-foreground">List pod ofertę: Mid Frontend Developer, Kwadrat Software House</p>
            <div className="mt-5 space-y-4 font-display text-[1.0625rem] leading-[1.75]">
              <p>Dzień dobry,</p>
              <p>
                piszę w sprawie oferty Mid Frontend Developer. Od trzech lat pracuję jako frontend developerka i najwięcej satysfakcji
                daje mi porządkowanie dużych interfejsów tak, żeby dało się je rozwijać bez obaw.
              </p>
              <p className="text-muted-foreground">
                Na co dzień rozwijam panel sprzedawcy w React i TypeScript. Zaproponowałam i przeprowadziłam migrację…
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-prose text-[0.9375rem] leading-6 text-muted-foreground">
            W planie Pro list powstaje z wymagań oferty i doświadczenia z Twojego CV, w jednym z trzech stylów. Zawsze możesz go poprawić przed wysłaniem.
          </p>
        </div>
      </div>
    </section>
  );
}
