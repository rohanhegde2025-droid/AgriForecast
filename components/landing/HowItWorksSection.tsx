"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setVisible(true); });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: '01',
      title: 'Enter your farm details',
      description: 'Tell AgriForecast about your farm — crop type, acreage, location, and planting timeline. Setup takes under five minutes.',
      tags: 'CROP TYPE · FARM SIZE · REGION · SEASON'
    },
    {
      id: '02',
      title: 'Get yield and price insights',
      description: 'The platform generates your expected yield range and shows you current price forecasts for your crop in your target markets.',
      tags: 'YIELD ESTIMATE · PRICE TRENDS · MARKET OUTLOOK'
    },
    {
      id: '03',
      title: 'Make a better selling decision',
      description: 'Review your personalised advisory — when to sell, how much to hold, and what conditions to watch — then act with confidence.',
      tags: 'SELL TIMING · HOLD STRATEGY · RISK SIGNALS'
    }
  ];

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef} 
      className="relative py-32 overflow-hidden bg-[var(--color-primary-900)] border-y border-[var(--color-gold)]/20"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/agri_tech.png" 
          alt="Technological field" fill className="object-cover opacity-10 mix-blend-overlay scale-110" unoptimized={false} 
        />
      </div>

      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-20 section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold/50" />
            <span className="font-mono text-gold/80 text-[0.6rem] uppercase tracking-[0.3em]">
              How It Works · Three Steps
            </span>
          </div>
          <h2 className="font-sans font-light leading-[1.1]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#E8F0E4' }}>
            From farm details<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>to a confident decision.</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div 
              key={step.id} 
              className={`flex flex-col gap-4 section-hidden ${visible ? 'section-visible' : ''}`}
              style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
            >
              {/* Step indicator */}
              <div 
                className="w-8 h-8 flex items-center justify-center font-mono font-bold text-[0.75rem]"
                style={{ 
                  background: 'rgba(212, 160, 23, 0.15)', 
                  border: '1px solid rgba(212, 160, 23, 0.6)',
                  color: '#D4A017'
                }}
              >
                {step.id}
              </div>

              {/* Card */}
              <div 
                className="flex-1 p-8 flex flex-col gap-6"
                style={{ 
                  background: 'rgba(13, 43, 31, 0.4)', 
                  border: '1px solid rgba(212, 160, 23, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div>
                  <h3 className="font-sans font-bold text-lg mb-4" style={{ color: '#E8F0E4' }}>
                    {step.title}
                  </h3>
                  <p className="font-sans font-light leading-relaxed" style={{ color: 'rgba(232, 240, 228, 0.7)', fontSize: '0.9rem' }}>
                    {step.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <span className="font-mono uppercase text-[#D4A017]/60" style={{ fontSize: '0.55rem', letterSpacing: '0.15em' }}>
                    {step.tags}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;