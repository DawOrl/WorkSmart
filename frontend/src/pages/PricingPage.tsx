import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-background px-6">
        <Link to="/" className="text-lg font-bold text-primary">WorkSmart</Link>
        <Link to="/auth" className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Zaloguj się
        </Link>
      </header>
      <PricingSection />
      <Footer />
    </div>
  );
}
