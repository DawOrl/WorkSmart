import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navItems } from './nav';

const mobileItems = navItems.filter(item => item.to !== '/alerts');

/** Bottom tab bar on phones: thumbs reach it, and the content gets the full width. */
export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Nawigacja aplikacji"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {mobileItems.map(({ to, short, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} aria-hidden />
                  {short}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
