import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Crown, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { profile, user } = useAuthStore();
  const { signOut } = useAuth();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Ustawienia</h1>

      <div className="rounded-xl border bg-background p-6 shadow-sm space-y-4">
        <h2 className="font-semibold">Twoje konto</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">E-mail</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className={`font-semibold ${profile?.plan === 'free' ? 'text-muted-foreground' : 'text-primary'}`}>
              {profile?.plan?.toUpperCase() ?? 'FREE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Konto od</span>
            <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pl-PL') : '—'}</span>
          </div>
        </div>
      </div>

      {profile?.plan === 'free' && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <h2 className="font-semibold text-yellow-800">Przejdź na Pro</h2>
          </div>
          <p className="text-sm text-yellow-700 mb-4">
            Odblokuj unlimited oferty, alerty real-time, listy motywacyjne i tygodniowy raport kariery.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
          >
            <Crown className="h-4 w-4" /> Porównaj plany
          </Link>
        </div>
      )}

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Akcje</h2>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" /> Wyloguj się
        </button>
      </div>
    </div>
  );
}
