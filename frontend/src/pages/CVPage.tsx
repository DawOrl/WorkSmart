import { useRef, useState, type DragEvent } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useQuery } from '@/hooks/useQuery';
import { atsLabel, cn, plural, timeAgo } from '@/lib/utils';
import type { ATSSuggestion, CVProfile } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import Panel from '@/components/ui/Panel';
import MatchMeter from '@/components/ui/MatchMeter';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/States';

const ACCEPTED = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_BYTES = 10 * 1024 * 1024;

const impactOrder: Record<ATSSuggestion['impact'], number> = { high: 0, medium: 1, low: 2 };
const impactLabel: Record<ATSSuggestion['impact'], string> = { high: 'Duży wpływ', medium: 'Średni wpływ', low: 'Mały wpływ' };

function atsSummary(score: number) {
  if (score >= 85) return 'System rekrutacyjny odczyta prawie wszystko. Zostały drobne poprawki.';
  if (score >= 65) return 'Większość danych jest czytelna, ale część słów kluczowych umyka. Poprawki poniżej są uporządkowane od najważniejszej.';
  return 'Spora część CV może zostać pominięta przez system rekrutacyjny. Zacznij od poprawek z dużym wpływem.';
}

function period(start: string, end?: string) {
  const fmt = (v: string) => v.split('-').reverse().join('.');
  return `${fmt(start)}–${end ? fmt(end) : 'obecnie'}`;
}

export default function CVPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const { data: cv, setData, error, loading, reload } = useQuery(async () => {
    try {
      return (await api.get<CVProfile>('/api/cv/me')).data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      throw err;
    }
  }, [], 'Nie udało się wczytać CV.');

  const upload = async (file: File) => {
    setUploadError(null);
    if (!ACCEPTED.includes(file.type)) {
      setUploadError('Ten plik ma inny format. Wgraj CV jako PDF albo DOCX.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Plik ma ponad 10 MB. Zapisz CV jako lżejszy PDF i spróbuj ponownie.');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('cv', file);
      const { data } = await api.post<CVProfile>('/api/cv/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setData(data);
    } catch {
      setUploadError('Nie udało się przeanalizować CV. Spróbuj ponownie za chwilę.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void upload(file);
  };

  const dropProps = {
    onDragOver: (e: DragEvent) => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop,
  };

  const fileInput = (
    <input
      ref={fileRef}
      type="file"
      accept=".pdf,.docx"
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f); }}
    />
  );

  const suggestions = [...(cv?.suggestions ?? [])].sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

  return (
    <div className="animate-settle">
      <PageHeader
        title="Moje CV"
        description="Tak Twoje CV widzi system rekrutacyjny (ATS) i na tej podstawie liczymy dopasowanie do ofert."
      />
      {fileInput}
      <p className="sr-only" aria-live="polite">{uploading ? 'Analizuję CV, to potrwa kilka sekund.' : ''}</p>

      {error && <ErrorState message={error} onRetry={reload} className="mb-6" />}
      {uploadError && <ErrorState message={uploadError} className="mb-4" />}

      {loading && !cv && !error ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true">
          <div className="animate-skeleton h-72 rounded-lg border bg-surface" aria-hidden />
          <div className="animate-skeleton h-72 rounded-lg border bg-surface" aria-hidden />
          <span className="sr-only">Wczytuję CV…</span>
        </div>
      ) : !cv ? (
        <div
          {...dropProps}
          className={cn(
            'flex flex-col items-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors',
            dragging ? 'border-primary bg-primary-soft' : 'border-input bg-surface',
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          <p className="mt-4 font-display text-2xl">{uploading ? 'Analizuję CV…' : 'Wgraj swoje CV'}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            PDF albo DOCX, do 10 MB. Odczytamy umiejętności i doświadczenie, ocenimy czytelność dla ATS i policzymy dopasowania.
          </p>
          <Button className="mt-6" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Analizuję…' : 'Wybierz plik'}
          </Button>
          <p className="mt-3 text-meta text-muted-foreground">albo przeciągnij go tutaj</p>
        </div>
      ) : (
        <>
          {/* Current file + replace */}
          <div
            {...dropProps}
            className={cn(
              'mb-6 flex flex-col gap-3 rounded-lg border border-dashed px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
              dragging ? 'border-primary bg-primary-soft' : 'border-input bg-surface',
            )}
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{cv.file_url ?? 'Twoje CV'}</p>
              <p className="text-meta text-muted-foreground">
                {uploading ? 'Analizuję nową wersję, to potrwa kilka sekund…' : `Przeanalizowane ${timeAgo(cv.updated_at)}. Przeciągnij tu nowy plik albo wybierz go z dysku.`}
              </p>
            </div>
            <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading} className="shrink-0">
              <Upload strokeWidth={1.75} aria-hidden />
              {uploading ? 'Analizuję…' : 'Wgraj nową wersję'}
            </Button>
          </div>

          <div className={cn('grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]', uploading && 'opacity-60 transition-opacity')}>
            <div className="space-y-6">
              <Panel title="Czytelność dla systemów ATS">
                <MatchMeter score={cv.ats_score} size="lg" showLabel label={atsLabel(cv.ats_score)} />
                <p className="mt-4 max-w-prose text-[0.9375rem] leading-6 text-muted-foreground">{atsSummary(cv.ats_score)}</p>
              </Panel>

              <Panel title="Co poprawić" description={`${suggestions.length} ${plural(suggestions.length, 'sugestia', 'sugestie', 'sugestii')}, od największego wpływu`} bodyClassName="p-0">
                <ol className="divide-y">
                  {suggestions.map((s, i) => (
                    <li key={s.issue} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 px-5 py-4">
                      <span className="num font-display text-lg leading-6 text-muted-foreground">{i + 1}</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="font-medium">{s.issue}</p>
                          <span
                            className={cn(
                              'rounded-sm px-1.5 py-0.5 text-xs font-medium',
                              s.impact === 'high' ? 'bg-foreground text-background' : s.impact === 'medium' ? 'bg-sunken text-foreground' : 'border text-muted-foreground',
                            )}
                          >
                            {impactLabel[s.impact]}
                          </span>
                        </div>
                        <p className="mt-1 max-w-prose text-[0.9375rem] leading-6 text-muted-foreground">{s.fix}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>
            </div>

            <Panel title="Co odczytaliśmy z CV" as="aside">
              <h3 className="eyebrow mb-2">Umiejętności ({cv.skills.length})</h3>
              <ul className="flex flex-wrap gap-1.5">
                {cv.skills.map(skill => (
                  <li key={skill} className="rounded-sm border bg-background px-2 py-1 text-sm">{skill}</li>
                ))}
              </ul>

              {cv.experience.length > 0 && (
                <>
                  <h3 className="eyebrow mb-2 mt-6">Doświadczenie</h3>
                  <ol className="space-y-4">
                    {cv.experience.map(e => (
                      <li key={`${e.company}-${e.start}`}>
                        <p className="font-medium">{e.role}</p>
                        <p className="text-meta text-muted-foreground">{e.company} · {period(e.start, e.end)}</p>
                        {e.description && <p className="mt-1 text-sm leading-6">{e.description}</p>}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {cv.education.length > 0 && (
                <>
                  <h3 className="eyebrow mb-2 mt-6">Wykształcenie</h3>
                  <ul className="space-y-2">
                    {cv.education.map(ed => (
                      <li key={ed.institution}>
                        <p className="font-medium">{ed.institution}</p>
                        <p className="text-meta text-muted-foreground">{[ed.degree, ed.field, ed.graduation].filter(Boolean).join(' · ')}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
