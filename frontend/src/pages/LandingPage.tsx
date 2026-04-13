import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
