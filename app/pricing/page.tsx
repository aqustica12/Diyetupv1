import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PricingHero from '@/components/pricing/PricingHero';
import PricingPlans from '@/components/pricing/PricingPlans';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import PricingCTA from '@/components/pricing/PricingCTA';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PricingHero />
        <PricingPlans />
        <PricingFAQ />
        <PricingCTA />
      </main>
      <Footer />
    </div>
  );
}