import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ValueSection from '@/components/landing/ValueSection';
import CtaSection from '@/components/landing/CtaSection';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Reinstated Generic Sections (The core landing flow) */}
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ValueSection />
      <CtaSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
