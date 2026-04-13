import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, KanbanSquare, Bell, PenLine, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/cv',        label: 'Moje CV',             icon: FileText },
  { to: '/jobs',      label: 'Oferty pracy',        icon: Briefcase },
  { to: '/tracker',   label: 'Tracker',             icon: KanbanSquare },
  { to: '/alerts',    label: 'Alerty',              icon: Bell },
  { to: '/letter',    label: 'List motywacyjny',    icon: PenLine, pro: true },
];

export default function Sidebar() {
  const { profile } = useAuthStore();
  const isPro = profile?.plan !== 'free';

  return (
    <aside className="relative flex w-56 flex-col overflow-hidden border-r"
      style={{ background: 'linear-gradient(180deg, #f8faff 0%, #faf8ff 100%)' }}
    >
      {/* Subtle background orb */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />

      {/* Logo */}
      <div className="relative flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold gradient-text-animated">WorkSmart</span>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 space-y-0.5 p-3">
        {navItems.map(({ to, label, icon: Icon, pro }) => {
          const locked = pro && !isPro;
          return (
            <NavLink
              key={to}
              to={locked ? '/pricing' : to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm',
                  locked && 'opacity-60',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isActive ? 'scale-110' : 'group-hover:scale-105')} />
                  {label}
                  {pro && !isPro && <Crown className="ml-auto h-3 w-3 text-yellow-500" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {!isPro && (
        <div className="relative p-3 pt-0">
          <NavLink
            to="/pricing"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
          >
            {/* Shimmer sweep on hover */}
            <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-white/20 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[200%]" />
            <Crown className="h-4 w-4 shrink-0" />
            <span>Przejdź na Pro</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
}
