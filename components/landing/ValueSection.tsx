"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const VALUES = [
  {
    value: 'Better planning',
    description: `Know your expected yield weeks in advance. Arrange
    storage, logistics, and buyer conversations with confidence.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="18" height="18" rx="2" stroke="#D4A017"
          strokeWidth="1.5" />
        <path d="M7 11l3 3 5-5" stroke="#D4A017" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: 'Less uncertainty',
    description: `Replace guesswork with data. AgriForecast gives you a
    clear picture of what to expect from your crop and the market.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8.5" stroke="#D4A017"
          strokeWidth="1.5" />
        <path d="M11 7v4.5l3 2" stroke="#D4A017" strokeWidth="1.5"
          strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'Smarter harvest decisions',
    description: `Combine yield forecasts with price trends to decide
    when to harvest and when to sell — not just when it feels right.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 16l5-6 4 4 5-7" stroke="#D4A017" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="7" r="2" stroke="#D4A017"
          strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: 'Improved profitability',
    description: `Selling at the right time, with the right volume,
    consistently improves your return per acre over the season.`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v16M7 7l4-4 4 4M7 15l4 4 4-4" stroke="#D4A017"
          strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round" />
      </svg>
    ),
  },
];

const ValueSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="value" ref={sectionRef}
      className="relative py-24 overflow-hidden bg-[#E8F0E4]"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/harvest_sunset.png"
          alt="Golden harvest" fill className="object-cover opacity-10 mix-blend-multiply" unoptimized={false}
        />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(27,67,50,0.06) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(27,67,50,0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '80px 80px',
        }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{
              background: 'linear-gradient(90deg, #1B4332, transparent)'
            }} />
            <span className="font-mono uppercase" style={{
              fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(27,67,50,0.6)'
            }}>
              What You Gain
            </span>
          </div>
          <h2 className="font-sans font-light" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#1B4332', letterSpacing: '-0.02em',
            lineHeight: 1.1 }}>
            Real outcomes for<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>real farms.</span>
          </h2>
          <p className="mt-4 max-w-xl font-sans" style={{
            color: 'rgba(27, 67, 50, 0.7)',
            fontSize: '0.9375rem', lineHeight: 1.7 }}>
            AgriForecast is built around the outcomes that
            matter to farmers — not dashboards for their own
            sake.
          </p>
        </div>

        {/* Value grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((item, i) => (
            <div key={i} className={`section-hidden ${visible ? 'section-visible' : ''}`} style={{
              transitionDelay: `${0.1 + i * 0.12}s` }}>
              <div className="rounded-sm p-6 h-full flex flex-col gap-4"
                style={{ background: '#F5F9F3',
                border: '1px solid rgba(212, 160, 23, 0.6)', }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(212,160,23,0.08)',
                    border: '1px solid rgba(212,160,23,0.6)'
                  }}>
                  {item.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans font-semibold"
                    style={{ fontSize: '0.9375rem',
                    color: '#1B4332', lineHeight: 1.3
                    }}>
                    {item.value}
                  </h3>
                  <p className="font-sans" style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(27, 67, 50, 0.65)',
                    lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;