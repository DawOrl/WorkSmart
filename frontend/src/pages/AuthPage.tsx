import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { isDemo } from '@/lib/env';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import Wordmark from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { inputClass, labelClass } from '@/components/ui/field';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState(isDemo ? 'demo@worksmart.pl' : '');
  const [password, setPassword] = useState(isDemo ? 'demo-haslo' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from('profiles').upsert({ id: userData.user.id, email, plan: 'free' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? 'Nie udało się zalogować. Sprawdź e-mail i hasło.' : 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Link to="/" className="self-start rounded-sm" aria-label="WorkSmart, strona główna"><Wordmark /></Link>

        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-[-0.01em]">
            {mode === 'signin' ? 'Wróć do swoich dopasowań' : 'Załóż konto'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {mode === 'signin' ? 'Zaloguj się, żeby zobaczyć nowe oferty i etap swoich aplikacji.' : 'Plan Free jest bezpłatny i nie wymaga karty.'}
          </p>

          <div className="mt-8 flex h-11 rounded-md border border-input p-1" role="tablist" aria-label="Logowanie lub rejestracja">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setError(''); }}
                className={cn('flex-1 rounded-sm text-sm transition-colors', mode === m ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}
              >
                {m === 'signin' ? 'Logowanie' : 'Rejestracja'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>E-mail</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="twoj@email.pl" />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>Hasło</label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={inputClass}
                aria-describedby={mode === 'signup' ? 'password-hint' : undefined}
              />
              {mode === 'signup' && <p id="password-hint" className="mt-1 text-meta text-muted-foreground">Co najmniej 8 znaków.</p>}
            </div>
            {error && <p role="alert" className="rounded-md bg-destructive-soft px-3 py-2.5 text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Chwileczkę…' : mode === 'signin' ? 'Zaloguj się' : 'Utwórz konto'}
            </Button>
          </form>

          {isDemo && (
            <p className="mt-6 rounded-md bg-sunken/70 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Wersja demo.</span> Zaloguje Cię dowolny e-mail i hasło. Zobaczysz konto przykładowej kandydatki z wgranym CV.
            </p>
          )}
        </main>
      </div>

      <aside className="relative hidden flex-col justify-end overflow-hidden border-l bg-sunken/60 p-12 lg:flex" aria-hidden>
        <img
          src="/img/dopasowanie-zlozone.webp"
          alt=""
          width={900}
          height={647}
          className="absolute left-1/2 top-[42%] w-[78%] max-w-[620px] -translate-x-1/2 -translate-y-1/2"
        />
        <p className="relative max-w-sm font-display text-2xl leading-snug">
          Twoje CV z jednej strony, wymagania oferty z drugiej. Pokazujemy, gdzie do siebie pasują.
        </p>
      </aside>
    </div>
  );
}
