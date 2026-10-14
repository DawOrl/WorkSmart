import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, apiErrorMessage } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { MatchScore } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import Panel from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { inputClass, labelClass } from '@/components/ui/field';

type Style = 'formal' | 'conversational' | 'creative';
type Language = 'pl' | 'en';

const styles: { value: Style; label: string; hint: string }[] = [
  { value: 'formal', label: 'Formalny', hint: 'Korporacje, administracja, banki' },
  { value: 'conversational', label: 'Bezpośredni', hint: 'Software house, startup, mały zespół' },
  { value: 'creative', label: 'Z charakterem', hint: 'Agencje, marketing, produkt' },
];

export default function LetterWriterPage() {
  const { profile } = useAuthStore();
  const [params, setParams] = useSearchParams();
  const [jobId, setJobId] = useState(params.get('job') ?? '');
  const [style, setStyle] = useState<Style>('formal');
  const [language, setLanguage] = useState<Language>('pl');
  const [letter, setLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const offers = useQuery(
    () => api.get<{ matches: MatchScore[] }>('/api/matches?limit=100').then(r => r.data.matches),
    [],
    'Nie udało się wczytać ofert.',
  );

  // Default to the best match when no offer was passed in the URL.
  useEffect(() => {
    if (!jobId && offers.data?.length) setJobId(offers.data[0].job_id);
  }, [offers.data, jobId]);

  if (profile?.plan === 'free') {
    return (
      <div className="animate-settle">
        <PageHeader title="Listy motywacyjne" />
        <EmptyState title="Ta funkcja jest w planie Pro" action={<Link to="/pricing" className={buttonVariants()}>Porównaj plany</Link>}>
          W Pro piszesz 10 listów miesięcznie, każdy pod konkretną ofertę i Twoje CV. Plan kosztuje 29 zł miesięcznie.
        </EmptyState>
      </div>
    );
  }

  const selected = offers.data?.find(m => m.job_id === jobId);

  const generate = async () => {
    if (!jobId) {
      setGenError('Wybierz ofertę, pod którą ma powstać list.');
      return;
    }
    setGenerating(true);
    setGenError(null);
    setCopied(false);
    try {
      const { data } = await api.post<{ letter: string }>('/api/letter/generate', { job_id: jobId, style, language });
      setLetter(data.letter);
    } catch (err) {
      setGenError(apiErrorMessage(err, 'Nie udało się napisać listu. Spróbuj ponownie.'));
    } finally {
      setGenerating(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setGenError('Przeglądarka zablokowała schowek. Zaznacz tekst i skopiuj go ręcznie.');
    }
  };

  const download = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `list-${selected?.job?.company?.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]+/gi, '-') ?? 'motywacyjny'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-settle">
      <PageHeader
        title="Listy motywacyjne"
        description="List pod konkretną ofertę: korzysta z jej wymagań i z doświadczenia z Twojego CV. Przeczytaj go i popraw, zanim wyślesz."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="Ustawienia listu">
          <form onSubmit={e => { e.preventDefault(); void generate(); }} className="space-y-5">
            <div>
              <label htmlFor="offer" className={labelClass}>Oferta</label>
              {offers.error ? (
                <ErrorState message={offers.error} onRetry={offers.reload} />
              ) : (
                <select
                  id="offer"
                  value={jobId}
                  disabled={offers.loading}
                  onChange={e => { setJobId(e.target.value); setParams(e.target.value ? { job: e.target.value } : {}, { replace: true }); }}
                  className={inputClass}
                >
                  {offers.loading && <option>Wczytuję oferty…</option>}
                  {offers.data?.map(m => (
                    <option key={m.job_id} value={m.job_id}>
                      {m.job?.title}, {m.job?.company} ({m.score}%)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <fieldset>
              <legend className={labelClass}>Styl</legend>
              <div className="space-y-2">
                {styles.map(s => (
                  <label
                    key={s.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition-colors',
                      style === s.value ? 'border-primary bg-primary-soft' : 'border-input hover:border-foreground/40',
                    )}
                  >
                    <input type="radio" name="style" value={s.value} checked={style === s.value} onChange={() => setStyle(s.value)} className="mt-1 accent-[hsl(var(--primary))]" />
                    <span>
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="block text-meta text-muted-foreground">{s.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>Język</legend>
              <div className="flex h-11 rounded-md border border-input p-1">
                {(['pl', 'en'] as Language[]).map(l => (
                  <label key={l} className={cn('flex flex-1 cursor-pointer items-center justify-center rounded-sm text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring', language === l ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}>
                    <input type="radio" name="language" value={l} checked={language === l} onChange={() => setLanguage(l)} className="sr-only" />
                    {l === 'pl' ? 'Polski' : 'Angielski'}
                  </label>
                ))}
              </div>
            </fieldset>

            {genError && <p role="alert" className="text-sm text-destructive">{genError}</p>}

            <Button type="submit" className="w-full" disabled={generating || offers.loading}>
              {generating ? 'Piszę list…' : letter ? 'Napisz od nowa' : 'Napisz list'}
            </Button>
          </form>
        </Panel>

        {/* ── The letter as a sheet of paper ───────────────────────────────── */}
        <section aria-label="List motywacyjny" className="rounded-lg border bg-surface shadow-lift">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
            <p className="min-w-0 truncate text-sm">
              {selected ? <><span className="font-medium">{selected.job?.title}</span> <span className="text-muted-foreground">· {selected.job?.company}</span></> : <span className="text-muted-foreground">Wybierz ofertę</span>}
            </p>
            {letter && !generating && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={copy}>{copied ? 'Skopiowano' : 'Kopiuj'}</Button>
                <Button variant="ghost" size="sm" onClick={download}>Pobierz .txt</Button>
              </div>
            )}
          </div>
          <p className="sr-only" aria-live="polite">{generating ? 'Piszę list…' : letter ? 'List gotowy.' : ''}</p>

          {generating ? (
            <div className="space-y-3 px-6 py-8 sm:px-12 sm:py-12" aria-hidden>
              {[92, 100, 96, 70, 0, 100, 94, 98, 88, 60].map((w, i) =>
                w === 0 ? <div key={i} className="h-3" /> : <div key={i} className="animate-skeleton h-3.5 rounded-sm bg-sunken" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />,
              )}
            </div>
          ) : letter ? (
            <textarea
              value={letter}
              onChange={e => setLetter(e.target.value)}
              aria-label="Treść listu, możesz ją edytować"
              rows={22}
              className="block w-full resize-y rounded-b-lg bg-transparent px-6 py-8 font-display text-[1.0625rem] leading-[1.75] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:px-12 sm:py-12"
            />
          ) : (
            <div className="px-6 py-16 text-center sm:px-12">
              <p className="font-display text-2xl">Tu pojawi się list</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Wybierz ofertę i styl, a list powstanie w kilka sekund. Tekst możesz od razu edytować.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
