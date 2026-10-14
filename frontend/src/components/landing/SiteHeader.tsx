import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Wordmark from '@/components/ui/Wordmark';
import { buttonVariants } from '@/components/ui/buttonVariants';

/** Public header for the landing and pricing pages. Every link has a real target. */
export default function SiteHeader({ onLanding = true }: { onLanding?: boolean }) {
  const { user } = useAuthStore();
  const anchor = (hash: string) => (onLanding ? hash : `/${hash}`);

  return (
    <header className="container flex h-16 items-center justify-between gap-4 sm:h-20">
      <Link to="/" className="rounded-sm" aria-label="WorkSmart, strona główna">
        <Wordmark />
      </Link>
      <nav aria-label="Główna" className="flex items-center gap-1 sm:gap-2">
        <a href={anchor('#jak-to-dziala')} className="hidden h-11 items-center px-3 text-[0.9375rem] text-muted-foreground hover:text-foreground md:inline-flex">
          Jak to działa
        </a>
        <a href={anchor('#cennik')} className="hidden h-11 items-center px-3 text-[0.9375rem] text-muted-foreground hover:text-foreground md:inline-flex">
          Cennik
        </a>
        {user ? (
          <Link to="/dashboard" className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'h-11' })}>
            Twój pulpit
          </Link>
        ) : (
          <>
            <Link to="/auth" className="inline-flex h-11 items-center px-3 text-[0.9375rem] text-muted-foreground hover:text-foreground">
              Zaloguj się
            </Link>
            <Link to="/auth" className={buttonVariants({ size: 'sm', className: 'hidden h-11 sm:inline-flex' })}>
              Wgraj CV
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
