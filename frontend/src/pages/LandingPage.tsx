import SiteHeader from '@/components/landing/SiteHeader';
import Hero from '@/components/landing/Hero';
import MatchExplainer from '@/components/landing/MatchExplainer';
import TrackerBand from '@/components/landing/TrackerBand';
import Documents from '@/components/landing/Documents';
import PricingSection from '@/components/landing/PricingSection';
import Closing from '@/components/landing/Closing';
import Footer from '@/components/layout/Footer';
import { sourceLabels } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-clip">
      <SiteHeader />
      <main>
        <Hero />
        <div className="border-y">
          <p className="container flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-sm text-muted-foreground sm:gap-x-10">
            <span className="text-foreground">Oferty z</span>
            {Object.values(sourceLabels).map(name => <span key={name} className="font-medium">{name}</span>)}
          </p>
        </div>
        <MatchExplainer />
        <TrackerBand />
        <Documents />
        <PricingSection />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
