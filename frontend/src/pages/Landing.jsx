import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorks";
import Footer from "../components/landing/Footer";
import PortalSection from "../components/landing/PortalSection";
import ImpactSection from "../components/landing/ImpactSection";

export default function Landing() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PortalSection/>
      {/* <ImpactSection/> */}
      <Footer />
    </main>
  );
}
