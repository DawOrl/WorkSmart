import SiteHeader from '@/components/landing/SiteHeader';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/layout/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader onLanding={false} />
      <main>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
