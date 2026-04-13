import { Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { profile } = useAuthStore();
  const { signOut } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="text-sm text-muted-foreground">
        {profile?.plan && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            profile.plan === 'free'
              ? 'bg-secondary text-secondary-foreground'
              : profile.plan === 'pro'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {profile.plan.toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/alerts" className="rounded-md p-2 hover:bg-accent">
          <Bell className="h-4 w-4" />
        </Link>
        <Link to="/settings" className="rounded-md p-2 hover:bg-accent">
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={signOut}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent"
        >
          Wyloguj
        </button>
      </div>
    </header>
  );
}
