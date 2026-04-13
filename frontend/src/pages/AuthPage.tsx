import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Briefcase } from 'lucide-react';

export default function AuthPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Create profile row
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from('profiles').upsert({ id: userData.user.id, email, plan: 'free' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/20 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">WorkSmart</span>
        </div>
        <h1 className="mb-1 text-2xl font-bold">
          {mode === 'signin' ? 'Zaloguj się' : 'Załóż konto'}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {mode === 'signin' ? 'Wróć do swoich dopasowań' : 'Zacznij za darmo, bez karty kredytowej'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="jan@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Ładowanie...' : mode === 'signin' ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'signin' ? 'Nie masz konta?' : 'Masz już konto?'}{' '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-medium text-primary hover:underline"
          >
            {mode === 'signin' ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </div>
  );
}
