import { Link } from 'react-router-dom';
import Wordmark from '@/components/ui/Wordmark';
import { isDemo } from '@/lib/env';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Oferty z pięciu polskich portali, porównane z Twoim CV.
            {isDemo && ' Ta wersja to demo z przykładowymi danymi.'}
          </p>
        </div>
        <nav aria-label="Stopka" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/pricing" className="py-2 text-muted-foreground hover:text-foreground">Cennik</Link>
          <Link to="/auth" className="py-2 text-muted-foreground hover:text-foreground">Zaloguj się</Link>
          <a href="mailto:kontakt@worksmart.pl" className="py-2 text-muted-foreground hover:text-foreground">kontakt@worksmart.pl</a>
        </nav>
      </div>
    </footer>
  );
}
