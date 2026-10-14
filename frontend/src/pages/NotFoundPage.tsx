import { Link } from 'react-router-dom';
import Wordmark from '@/components/ui/Wordmark';
import { buttonVariants } from '@/components/ui/buttonVariants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container flex h-16 items-center">
        <Link to="/" className="rounded-sm" aria-label="WorkSmart, strona główna"><Wordmark /></Link>
      </header>
      <main className="container flex flex-1 flex-col items-start justify-center pb-24">
        <p className="eyebrow">Błąd 404</p>
        <h1 className="mt-3 max-w-xl font-display text-5xl font-medium leading-[1.05] tracking-[-0.015em] sm:text-6xl">
          Ta strona do niczego tu nie pasuje.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Adres mógł się zmienić albo oferta została zdjęta z portalu. Wróć na start albo do listy ofert.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className={buttonVariants()}>Strona główna</Link>
          <Link to="/jobs" className={buttonVariants({ variant: 'secondary' })}>Lista ofert</Link>
        </div>
      </main>
    </div>
  );
}
