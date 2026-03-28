import { Toaster } from "@/components/ui/sonner";
import ContactSection from "./components/ContactSection";
import DifferentiatorSection from "./components/DifferentiatorSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import PricingSection from "./components/PricingSection";
import TechnologySection from "./components/TechnologySection";
import WhatWeDoSection from "./components/WhatWeDoSection";
import WhyUsSection from "./components/WhyUsSection";

export default function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-bg" />
      <Navigation />
      <main>
        <HeroSection />
        <DifferentiatorSection />
        <WhatWeDoSection />
        <WhyUsSection />
        <PricingSection />
        <TechnologySection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            color: "oklch(0.94 0 0)",
          },
        }}
      />
    </div>
  );
}
