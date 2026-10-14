import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import Wordmark from '@/components/ui/Wordmark';
import { navItems } from './nav';

export default function Sidebar() {
  const { profile } = useAuthStore();
  const isFree = profile?.plan === 'free';

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-background lg:flex" aria-label="Nawigacja aplikacji">
      <div className="flex h-16 items-center px-6">
        <Link to="/dashboard" className="rounded-sm" aria-label="WorkSmart, pulpit">
          <Wordmark />
        </Link>
      </div>

      <nav className="flex-1 px-3 pt-4">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, pro }) => {
            const locked = pro && isFree;
            return (
              <li key={to}>
                <NavLink
                  to={locked ? '/pricing' : to}
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 items-center gap-3 rounded-md px-3 text-[0.9375rem] transition-colors',
                      isActive
                        ? 'bg-sunken font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-sunken/60 hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                  <span className="flex-1">{label}</span>
                  {locked && <span className="text-xs font-medium text-primary">Pro</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-lg border bg-surface px-4 py-3">
        <p className="text-sm font-medium">{profile?.full_name ?? profile?.email ?? 'Twoje konto'}</p>
        <p className="mt-0.5 text-meta text-muted-foreground">
          {profile ? (
            <>Plan {profile.plan === 'free' ? 'Free' : profile.plan === 'pro' ? 'Pro' : 'Premium'}</>
          ) : (
            'Wczytywanie konta'
          )}
          {isFree && (
            <>
              {' · '}
              <Link to="/pricing" className="font-medium text-primary underline-offset-4 hover:underline">
                przejdź na Pro
              </Link>
            </>
          )}
        </p>
      </div>
    </aside>
  );
}
