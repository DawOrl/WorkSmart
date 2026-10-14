import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { isDemo } from '@/lib/env';

export default function PageLayout() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      <a href="#tresc" className="sr-only z-50 rounded-md bg-surface px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Przejdź do treści
      </a>
      <Sidebar />
      <div className="min-w-0">
        <Navbar />
        {isDemo && (
          <p className="border-b bg-sunken/60 px-4 py-2 text-center text-xs text-muted-foreground lg:hidden">
            Tryb demo: dane przykładowe, zmiany znikają po odświeżeniu.
          </p>
        )}
        <main id="tresc" className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
