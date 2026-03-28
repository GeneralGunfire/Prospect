import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import DarkHeroSection from "@/components/DarkHeroSection";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import WhoAreWe from "@/components/WhoAreWe";
import ThreeColumnFeatures from "@/components/ThreeColumnFeatures";
import TopCareers from "@/components/TopCareers";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function LandingNormal() {
  return (
    <main className="bg-white">
      <Navigation />
      <HeroSection />
      <FeatureCards />
      <DarkHeroSection />
      <StatsBar />
      <HowItWorks />
      <WhoAreWe />
      <ThreeColumnFeatures />
      <TopCareers />
      <CTABanner />
      <Footer />
    </main>
  );
}
