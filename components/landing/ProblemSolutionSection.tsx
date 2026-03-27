"use client";
import React, { useEffect, useRef, useState } from 'react';

const PROBLEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 7v11h14V7L10 2z" stroke="#D4A017" strokeWidth="1.5"
          strokeLinejoin="round" />
        <path d="M10 12v-4M10 14v.5" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    problem: 'Uncertain yield estimates',
    solution: `AgriForecast models your crop data to give accurate yield projections weeks
    before harvest.`,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 14l4-5 3 3 3-4 4 5" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"
          strokeLinejoin="round" />
        <rect x="2" y="3" width="16" height="14" rx="1" stroke="#D4A017" strokeWidth="1.5" />
      </svg>
    ),
    problem: 'Unpredictable market prices',
    solution: `Price forecasting tools track market trends so you know what to expect before you
    sell.`,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#D4A017" strokeWidth="1.5" />
        <path d="M10 6v4.5l3 2" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    problem: 'Selling at the wrong time',
    solution: `Smart advisory tells you when market conditions align with your harvest window
    for maximum return.`,
  },
];

const ProblemSolutionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem-solution" ref={sectionRef}
      className="relative py-24 overflow-hidden" style={{ background: '#E8F0E4' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(27,67,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,67,50,0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{
              background: 'linear-gradient(90deg, #1B4332, transparent)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '0.6rem',
              letterSpacing: '0.3em', color: 'rgba(27,67,50,0.6)' }}>
              The Problem · The Solution
            </span>
          </div>
          <h2 className="font-sans font-light" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' , color: '#1B4332' ,
              letterSpacing: '-0.02em' , lineHeight: 1.1 }}>
              The guesswork ends<br />
              <span style={{ color: '#D4A017' , fontWeight: 600 }}>here.</span>
          </h2>
          <p className="mt-8 mx-auto max-w-xl font-sans" style={{ color: 'rgba(27, 67, 50, 0.7)' ,
              fontSize: '1rem' , lineHeight: 1.7 }}>
              Agricultural markets are volatile and yield is unpredictable. AgriForecast cuts
              through the noise with data from historical trends and local conditions.
          </p>
        </div>

        {/* Problem/Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMS.map((item, i) => (
            <div key={i} className={`section-hidden ${visible ? 'section-visible' : ''
              }`} style={{ transitionDelay: `${0.15 + i * 0.15}s` }}>
              <div className="rounded-sm h-full p-6 flex flex-col gap-4" style={{
                background: '#F5F9F3', border: '1px solid rgba(212, 160, 23, 0.6)',
              }}>
                {/* Icon */}
                <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,160,23,0.1)',
                  border: '1px solid rgba(212,160,23,0.6)' }}>
                  {item.icon}
                </div>

                {/* Problem label */}
                <div>
                  <span className="font-mono uppercase" style={{
                    fontSize: '0.58rem', letterSpacing: '0.2em',
                    color: 'rgba(27, 67, 50, 0.5)' }}>
                    Challenge
                  </span>
                  <p className="font-sans font-semibold mt-1" style={{
                    fontSize: '0.9375rem', color: '#1B4332', lineHeight: 1.4
                    }}>
                    {item.problem}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px w-full" style={{
                  background: 'linear-gradient(90deg, rgba(212,160,23,0.6), transparent)'
                }} />

                {/* Solution */}
                <div>
                  <span className="font-mono uppercase" style={{
                    fontSize: '0.58rem', letterSpacing: '0.2em',
                    color: 'rgba(212,160,23,0.7)' }}>
                    How AgriForecast Helps
                  </span>
                  <p className="font-sans mt-1" style={{ fontSize: '0.875rem',
                    color: 'rgba(27, 67, 50, 0.65)', lineHeight: 1.6 }}>
                    {item.solution}
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

export default ProblemSolutionSection;