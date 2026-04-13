import { useState } from 'react';
import { Crown, PenLine, Copy, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

type Style = 'formal' | 'conversational' | 'creative';

export default function LetterWriterPage() {
  const { profile } = useAuthStore();
  const isPro = profile?.plan !== 'free';
  const [jobId, setJobId] = useState('');
  const [style, setStyle] = useState<Style>('formal');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isPro) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center gap-4">
        <Crown className="h-12 w-12 text-yellow-500" />
        <h1 className="text-2xl font-bold">Funkcja Pro</h1>
        <p className="text-muted-foreground max-w-sm">
          Generator listów motywacyjnych jest dostępny w planie Pro i Premium.
        </p>
        <Link to="/pricing" className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground">
          Przejdź na Pro – 29 zł/mies.
        </Link>
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId.trim()) { setError('Podaj ID oferty'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post<{ letter: string }>('/api/letter/generate', { job_id: jobId, style, language: 'pl' });
      setLetter(data.letter);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Błąd generowania');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PenLine className="h-6 w-6" /> Generator listów motywacyjnych
        </h1>
        <p className="text-muted-foreground">AI tworzy spersonalizowany list pod konkretną ofertę.</p>
      </div>

      <form onSubmit={handleGenerate} className="rounded-xl border bg-background p-6 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">ID oferty</label>
          <input
            type="text"
            value={jobId}
            onChange={e => setJobId(e.target.value)}
            placeholder="Skopiuj UUID z adresu URL oferty"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Styl</label>
          <div className="flex gap-2">
            {(['formal', 'conversational', 'creative'] as Style[]).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${style === s ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                {s === 'formal' ? 'Formalny' : s === 'conversational' ? 'Konwersacyjny' : 'Kreatywny'}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {loading ? 'Generuję...' : 'Generuj list motywacyjny'}
        </button>
      </form>

      {letter && (
        <div className="rounded-xl border bg-background p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Wygenerowany list</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              {copied ? <><Check className="h-4 w-4 text-green-500" /> Skopiowano</> : <><Copy className="h-4 w-4" /> Kopiuj</>}
            </button>
          </div>
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            rows={16}
            className="w-full rounded-lg border bg-secondary/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      )}
    </div>
  );
}
