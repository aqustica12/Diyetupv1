import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutTeam from '@/components/about/AboutTeam';
import AboutValues from '@/components/about/AboutValues';
import AboutStats from '@/components/about/AboutStats';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutStats />
        <AboutTeam />
      </main>
      <Footer />
    </div>
  );
}