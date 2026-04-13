import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, KanbanSquare, Bell, PenLine, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cv', label: 'Moje CV', icon: FileText },
  { to: '/jobs', label: 'Oferty pracy', icon: Briefcase },
  { to: '/tracker', label: 'Tracker', icon: KanbanSquare },
  { to: '/alerts', label: 'Alerty', icon: Bell },
  { to: '/letter', label: 'List motywacyjny', icon: PenLine, pro: true },
];

export default function Sidebar() {
  const { profile } = useAuthStore();
  const isPro = profile?.plan !== 'free';

  return (
    <aside className="flex w-56 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 border-b">
        <span className="text-lg font-semibold text-primary">WorkSmart</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon, pro }) => {
          const locked = pro && !isPro;
          return (
            <NavLink
              key={to}
              to={locked ? '/pricing' : to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  locked && 'opacity-60',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {pro && !isPro && <Crown className="ml-auto h-3 w-3 text-yellow-500" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <NavLink
          to="/pricing"
          className="flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm font-medium text-white"
        >
          <Crown className="h-4 w-4" />
          Przejdź na Pro
        </NavLink>
      </div>
    </aside>
  );
}
