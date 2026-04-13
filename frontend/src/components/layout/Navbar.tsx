import { Bell, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const planStyle: Record<string, string> = {
  free:    'bg-secondary text-secondary-foreground',
  pro:     'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm',
  premium: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-sm',
};

export default function Navbar() {
  const { profile } = useAuthStore();
  const { signOut } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {profile?.plan && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${planStyle[profile.plan] ?? planStyle.free}`}>
            {profile.plan.toUpperCase()}
          </span>
        )}
        {profile?.email && (
          <span className="hidden text-sm text-muted-foreground sm:block">{profile.email}</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Link
          to="/alerts"
          className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          title="Alerty"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <Link
          to="/settings"
          className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          title="Ustawienia"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={signOut}
          className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
          title="Wyloguj"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </header>
  );
}
