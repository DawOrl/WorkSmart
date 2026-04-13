import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
        <p>© 2026 WorkSmart. Wszystkie prawa zastrzeżone.</p>
        <div className="flex gap-6">
          <Link to="/pricing" className="hover:text-foreground">Cennik</Link>
          <a href="mailto:kontakt@worksmart.pl" className="hover:text-foreground">Kontakt</a>
        </div>
      </div>
    </footer>
  );
}
