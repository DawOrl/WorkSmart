import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl font-semibold">Strona nie istnieje</p>
      <p className="text-muted-foreground">Ups! Nie możemy znaleźć tej strony.</p>
      <Link to="/" className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground">
        Wróć do strony głównej
      </Link>
    </div>
  );
}
