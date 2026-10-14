import { Link, NavLink } from 'react-router-dom';
import { Bell, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/hooks/useAuth';
import { isDemo } from '@/lib/env';
import { cn } from '@/lib/utils';
import Wordmark from '@/components/ui/Wordmark';
import { buttonVariants } from '@/components/ui/buttonVariants';

const iconLink = ({ isActive }: { isActive: boolean }) =>
  cn(buttonVariants({ variant: 'ghost', size: 'icon' }), isActive && 'bg-sunken text-foreground');

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/dashboard" className="rounded-sm lg:hidden" aria-label="WorkSmart, pulpit">
          <Wordmark className="text-xl" />
        </Link>

        {isDemo && (
          <p className="hidden text-meta text-muted-foreground lg:block">
            Tryb demo: dane przykładowe, nic nie jest wysyłane. Zmiany znikają po odświeżeniu.
          </p>
        )}

        <div className="flex items-center gap-1">
          <NavLink to="/alerts" className={iconLink} aria-label="Alerty">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </NavLink>
          <NavLink to="/settings" className={iconLink} aria-label="Ustawienia">
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </NavLink>
          <button type="button" onClick={() => void signOut()} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'ml-1 hidden h-11 sm:inline-flex')}>
            <LogOut strokeWidth={1.75} aria-hidden />
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  );
}
