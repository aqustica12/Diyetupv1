import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturesHero from '@/components/features/FeaturesHero';
import FeaturesList from '@/components/features/FeaturesList';
import FeatureComparison from '@/components/features/FeatureComparison';
import FeaturesCTA from '@/components/features/FeaturesCTA';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FeaturesHero />
        <FeaturesList />
        <FeatureComparison />
        <FeaturesCTA />
      </main>
      <Footer />
    </div>
  );
}